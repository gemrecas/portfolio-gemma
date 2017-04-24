# nipster

Search for npm modules with this command line client to [nipser.com](http://nipstr.com) 

An alternative to `npm search` based on the excellent web-site [nipstr.com](http://nipstr.com).

## Installation

This module is installed via npm:

``` bash
$ npm install -g nipster
```

## Example Usage

Just pass one more keywords to search for a package.

The packages are returned in ascending npm star order.

`nipster` will download a cut down JSON database of the npm registry and cache
it for a day or until the web version changes, so it will be much faster than
querying the npm registry.

Pull requests welcome!

``` bash
$ nipster wiring
PACKAGE           DESCRIPTION                                                                       AUTHOR           MODIFIED    STARS
pidriver          Node.js driver for RaspberryPI (A,B,B+) with support for GPIO, SPI, PWM, LCD      Wszerad          2014-08-31      0
zetta-auto-scout  A basic Scout for auto-wiring devices in Zetta.                                   Kevin Swiber     2014-08-11      0
ring-middleware   A utility for wiring together ring spec middleware                                Joseph Moniz     2014-03-12      0
wiringpi          nodejs wrapper for the wiringPi                                                   ZhangYuanwei     2013-09-14      0
mailpress         A wiring up of node-mailer to templates.                                          Jake Swanson     2014-06-24      0
flumine           wiring all                                                                        daichi hiroki    2014-09-01      0
actionman         Autowiring of DOM events into eve                                                 Damon Oehlman    2014-07-21      0
raspi-llio        Provides Node.js bindings to the WiringPi library for controlling a Raspberry Pi  Bryan Hughes     2014-07-23      0
formwork          Wiring object from a configuration file                                           Amaury Mylônas   2014-09-12      0
nodesapiens       WiringPi based Interface to Robosapiens on Raspberry Pi                           Darach Ennis     2013-07-21      1
wires             simple configuration utility with smart module wiring for unobtrusive dependency  Julian Aubourg   2014-05-27      2
attr-range        find ranges for wiring up live automatically updating collections                                  2014-01-19      2
ospi-controller   A Web Controller and REST interface for Raspberry Pi based irrigation system                       2013-08-24      3
ospi              JavaScript binding for Raspberry Pi based Open Sprinkler                                           2013-08-10      3
whomecontrolpi    Wireless Home Control in Node.JS for wiringPi lib on Raspberry Pi                 Tommy Ziegler    2013-07-26      3
rpi               Raspberry Pi GPIO communication on top of WiringPi                                Xavier Seignard  2013-08-13      3
node-wiringpi     Node bindings for libwiringPi                                                     Meadhbh Hamrick  2012-12-29      7
wiring-pi         Bindings to wiringPi                                                              Igor Soarez      2014-08-27     16
node-red          A visual tool for wiring the Internet of Things                                                    2014-06-29    788

```
