#!/usr/bin/env node

var sprintf = require('sprintf');
    mkdirp = require('mkdirp'),
    os = require('os'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    zlib = require('zlib');

var url = 'http://nipster.blob.core.windows.net/cdn/npm-datatables.json';
var dbPath = path.join(process.env.HOME || os.tmpdir(), '.nipster');
var dbFile = path.join(dbPath, 'npm-datatables.json');
var etagFile = path.join(dbPath, 'etag');
var etag, npm;
mkdirp.sync(dbPath);

if (fs.existsSync(etagFile)) {
  etag = fs.readFileSync(etagFile, { encoding: 'utf8' });
  check(etag);
} else {
  console.error('Downloading NPM database...');
  download();
}

function doSearch() {
  npm = require(dbFile);
  var kws = process.argv.slice(2);
  searchNpm(null, kws);
}

function check(etag) {
  request.head(url, function (err, res) {
    if (err) return fail(err);
    if (res.headers.etag === etag) {
      doSearch();
    } else {
      console.error('NPM Database has changed - Downloading...');
      download();
    }
  })
}

function download() {
  request(url, function (err, res) {
      if (err) return fail(err);
      fs.writeFileSync(etagFile, res.headers.etag, { encoding: 'utf8' });
    })
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(dbFile))
    .on('finish', function () {
      console.error('Database downloaded.');
      doSearch();
    });
}

function match(kws) {
  kws = kws.map(function (kw) {
    return kw.toLowerCase();
  });
  return function (haystack) {
    var hs = (haystack || '').toLowerCase();
    return kws.every(function (kw) {
      return ~hs.indexOf(kw);
    });
  }
}

function search(kws) {
  var m = match(kws);
  return function (data) {
    return m(data[0]) || m(data[1]) || m(data[2]) || m(data[3]) || m(data[8]);
  };
}

function searchNpm(err, kws) {
  if (err) return fail(err);
  var results = npm.aaData
    .filter(search(kws))
    .map(authorOnly)
    .sort(asc('Stars'));
  printResults(results);
}

function printResults(results) {
  var cols;
  var f = Object.keys(fields(true));

  // calculate column widths
  if (results.length) {
    cols = results.reduce(function (acc, result) {
      acc = result.map(function (col, i) {
        return Math.max(String(col || '').length, acc[i] || 0)
      }, acc);
      return acc;
    }, []);
  } else {
    cols = f.map(function (colName) {
      return colName.length;
    });
  }

  // adjust column widths
  var ttyCols = process.stdout.columns || 135;
  cols[6] = Math.max(5, cols[6]);
  cols[3] = Math.min(20, cols[3]);
  if (cols[0] + cols[2] + cols[3] + cols[4] + cols[6] + 7 > ttyCols) {
    cols[2] =ttyCols - cols[0] - cols[3] - cols[4] - cols[6] - 9;
  }

  // print header
  var line;
  line = sprintf('%-' + cols[0] + 's  ' +
                 '%-' + cols[2] + 's  ' +
                 '%-' + cols[3] + 's  ' +
                 '%-' + cols[4] + 's  ' +
                 '%' + cols[6] + 's ',
                 String(f[0].toUpperCase()).substr(0, cols[0]),
                 String(f[2].toUpperCase()).substr(0, cols[2]),
                 String(f[3].toUpperCase()).substr(0, cols[3]),
                 String(f[4].toUpperCase()).substr(0, cols[4]),
                 String(f[6].toUpperCase()).substr(0, cols[6]));
  console.log(line);

  // print data
  results.forEach(function (result) {
    line = sprintf('%-' + cols[0] + 's  ' +
                   '%-' + cols[2] + 's  ' +
                   '%-' + cols[3] + 's  ' +
                   '%-' + cols[4] + 's  ' +
                   '%' + cols[6] + 's ',
                   String(result[0] || '').substr(0, cols[0]),
                   String(result[2] || '').substr(0, cols[2]),
                   String(result[3] || '').substr(0, cols[3]),
                   String(result[4] || '').substr(0, cols[4]),
                   String(result[6]).substr(0, cols[6]));
    console.log(line);
  });
}

function fields(keys) {
  var f = {
    'Package':     0,
    'Repo':        1,
    'Description': 2,
    'Author':      3,
    'Modified':    4,
    'Forks':       5,
    'Stars':       6,
    'Watchers':    7,
    'Keywords':    8
  };

  if (keys) {
    return f;
  } else {
    return Object.keys(f).reduce(function (acc, k) {
      acc[f[k]] = k;
      return acc;
    }, {});
  }
}

function asc(field) {
 var f = fields(true);
 var fieldIndex = f[field];
  return function cmp(a, b) {
    var _a = a[fieldIndex];
    var _b = b[fieldIndex];
    if (_a < _b) {
      return -1;
    } else if (_a > _b) {
      return +1;
    } else {
      return 0;
    }
  };
}

function authorOnly(data) {
  data[3] = data[3].split(';')[1];
  return data;
}

function fail(err) {
  console.error('Error: ', err);
  process.exit(1);
}
