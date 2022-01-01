/*
let dictionary2 =
{ mp_cx: 696, // pixels Y
  mp_cy: 528, // pixels Y after change
  mp_tr: true, // is mouse position trusted?
  mp_mx: 175, // pixels X
  mp_my: -14, // pixels X after change
  mp_sx: 696, // pixels moved across Y
  mp_sy: 599, // some math?
  ttst: 48.635000028298236, // difference between 2 functions
  ifov: false, // does cursor fail test?
  wdifts: false, // is chrome in native browser code?
  wdifrm: false, // same as wdifts
  wdif: false,  // did browser create iframe?
  br_h: 969, // display height
  br_w: 707, // display width
  br_oh: 1040, // display original height
  br_ow: 1920, // display orignal widtht
  nddc: 0, // how many datadome cookies dos device have?
  rs_h: 1080, // resolution height
  rs_w: 1920, // resolution width
  rs_cd: 24, // color depth
  phe: false, // using phantomjs?
  nm: false, // using nightmare?
  jsf: false,
  ua: // user agent
   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
  lg: 'en-US', // language
  pr: 1, // pixel ratio
  hc: 8, // hardware concurrency
  ars_h: 1040, // = display orignal height "avail height"
  ars_w: 1920, // = display orignal width "avail width"
  tz: 240, // timezone offset
  str_ss: true, // session storage enabled? (ALWAYS TRUE)
  str_ls: true, // does device have local storage (ALWAYS TRUE)
  str_idb: true, // does device have indexed database (ALWAYS TRUE)
  str_odb: true, // does device have open database (ALWAYS TRUE)
  plgod: false, // is chrome? (USE FALSE)
  plg: 3, // number of plugins installed
  pltod: false, // platform enabled? (use false?)
  lb: false, // is browser firefox, or safari?
  eva: 33, // WHAT IS THE BROWSER? (37 = safari or firefox; 39 = internet explorer; 33 = chrome, opera, or other )
  lo: false, // is device mobile?
  ts_mtp: 0, // max touch points? (0 if desktop)
  ts_tec: false, // does device have touch points? (in other words, is it a phone)
  ts_tsa: false, // max touch points area
  vnd: 'Google Inc.', // browser vendor
  bid: 'NA', // browser build ID (NA = unknown)
  mmt: // Multipurpose Internet Mail Extensions (MIME TYPES)
   'application/pdf,application/x-google-chrome-pdf,application/x-nacl,application/x-pnacl', 
  plu: 'Chrome PDF Plugin,Chrome PDF Viewer,Native Client', // plugins
  hdn: false, // is document hidden?
  awe: false, // is awesomium webdriver loaded?
  geb: false, // is GEBISH loaded? (browser automation)
  dat: false, // is there a DOM automation controller?
  med: 'defined', // are media devices loaded?
  aco: 'probably', // can window play ogg audio with vorbis codec?
  acots: false, // is ogg audio with vorbis codec SUPPORTED (depends on site)
  acmp: 'probably', // can browser play mpeg audio?
  acmpts: true, // is mpeg audio SUPPORTED (depends on site)
  acw: 'probably', // can browser play wav audio?
  acwts: false, // does site support wav audio?
  acma: 'maybe', // can browser play x-m4a audio?
  acmats: false, // does site support x-m4a audio?
  acaa: 'probably', // can browser play aac audio?
  acaats: true, // does site support aac audio? 
  ac3: '', // can browser play 3gpp audio? (blank - no)
  ac3ts: false, // does site support 3gpp audio?
  acf: 'probably', // can browser play flac audio?
  acfts: false, // does site support flac audio?
  acmp4: 'maybe', // can browser play mp4 audio?
  acmp4ts: false, // does site support mp4 audio? 
  acmp3: 'probably', // can browser play mp3 audio?
  acmp3ts: false, // does site support mp3 audio?
  acwm: 'maybe', // can browser play webm audio?
  acwmts: false, // does browser support webm audio?
  ocpt: false, // is script to check aco-acwmts running? (if true, the values would be 'NA')
  vco: 'probably', // can browser play ogg video (codec is theora)
  vcots: false, // does site support ogg video with theora codec?
  vch: 'probably', // can browser play mp4 video with codec av1.42E01E
  vchts: true, // does site support mp4 video with codec av1.42E01E
  vcw: 'probably', // can browser play webm video with codecs vp8 and vorbis? 
  vcwts: true, // does site support webm video with codecs vp8 and vorbis? 
  vc3: 'maybe', // can browser play 3gpp video?
  vc3ts: false, // does site support 3gpp video?
  vcmp: '', // can browser play mpeg video? (blank - no)
  vcmpts: false, // does site support mpeg video?
  vcq: '', // can browser play quicktime video? (blank = no)
  vcqts: false, // does site support quicktime video? 
  vc1: 'probably', // can browser play mp4 video with codec av01.0.08M.08?
  vc1ts: false, // does site support mp4 video with codec av01.0.08M.08?
  dvm: 8, // device memory per stick (RAM)
  sqt: false, // is the browser sequentum?
  so: 'landscape-primary', // screen orientation
  wbd: false, // is there a webdriver?
  wbdm: false, // is there a webdriver?
  wdw: true, // is browser a chrome window?
  cokys: 'bG9hZFRpbWVzY3NpYXBwcnVudGltZQ==L=', // loadTimescsiappruntime in base64 + 'L='
  ecpc: false, // is site displayed in electron process?
  lgs: true, // does navigator have languages?
  lgsod: false, // does browser tell site what languages are enabled?
  bcda: true, // is there a barcode detector?
  idn: true, // are there display names?
  capi: false, // is contacts manager enabled?
  svde: false, // is browser blocking SVGs? (vectors)
  vpbq: true, // can browser see video elements?
  xr: true, // is xr enabled? 
  bgav: true, // does device have bluetooth?
  rri: true, // does device have RTC peer connection?
  idfr: true, // does device format time?
  ancs: true, // can device play animations?
  inlc: true, // is device in local time?
  cgca: true, // can device see 2d renders in canvas?
  inlf: true, // can device format lists?
  tecd: true, // does device encode streamed text? 
  sbct: true, // can device read buffered info from source?
  aflt: true, // is window array flat?
  rgp: true, // is RTCtpSender enabled?
  bint: true, // can device show "BigInt" (big integers?)
  spwn: false, // did a window spawn?
  emt: false, // dis a window emit?
  bfr: false, // is there a buffer?
  dbov: false, // is console open?
  glvd: 'Google Inc.', // static?
  glrd: 'ANGLE (NVIDIA GeForce GTX 960 Direct3D11 vs_5_0 ps_5_0)', // unmasked webgl renderer (graphics card)
  tagpu: 15.435000001161825, // difference between 2 webgl things
  prm: true, // does browser have notification permissions?
  tzp: 'America/New_York', // timezone
  cvs: true, // is canvas 2d? 
  usb: 'defined' // can browser access usb?
}*/

//====================================================================================================================================================================

const fetch = require('node-fetch');

function random2Vars() {
	var digs = Math.floor(Math.random() * 90 + 10);
	var decis = Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000;
	return digs + '.' + decis;
}

function randomIP() {
	var num1 = Math.floor(Math.random() * 90 + 10);
	var num2 = Math.floor(Math.random() * 90 + 10);
	var num3 = Math.floor(Math.random() * 90 + 10);
	var num4 = Math.floor(Math.random() * 90 + 10);
	return num1 + '.' + num2 + '.' + num3 + '.' + num4
}

class Datadome{
    async cookieGen() {
        const response = await fetch("https://api-js.datadome.co/js/", {
            "method": "POST",
            "mode": "cors",
            "headers": {
                'x-forwarded-for': randomIP(),
                'Content-type': 'application/x-www-form-urlencoded',
                'Host': 'api-js.datadome.co',
                'Origin': 'https://www.footlocker.com',
                'Referer': 'https://www.footlocker.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
            },
            "body": new URLSearchParams({
                "events": [],
                "eventCounters": [],
                'jsType': 'ch',
                'cid': 'null',
                'ddk': 'A55FBF4311ED6F1BF9911EB71931D5',
                'Referer': '',
                'request': '%2F',
                'responsePage': 'origin',
                'ddv': '4.1.26',
                'dddomain': 'www.kidsfootlocker.com',
                "jsData": JSON.stringify({
                    "ttst": random2Vars(),
                    "ifov": false,
                    "wdifts": false,
                    "wdifrm": false,
                    "wdif": false,
                    "br_h": 969,
                    "br_w": 1052,
                    "br_oh": 1040,
                    "br_ow": 1920,
                    "nddc": 0,
                    "rs_h": 1080,
                    "rs_w": 1920,
                    "rs_cd": 24,
                    "phe": false,
                    "nm": false,
                    "jsf": false,
                    "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
                    "lg": "en-US",
                    "pr": 1,
                    "hc": 8,
                    "ars_h": 1040,
                    "ars_w": 1920,
                    "tz": 300,
                    "str_ss": true,
                    "str_ls": true,
                    "str_idb": true,
                    "str_odb": true,
                    "plgod": false,
                    "plg": 3,
                    "pltod": false,
                    "lb": false,
                    "eva": 33,
                    "lo": false,
                    "ts_mtp": 0,
                    "ts_tec": false,
                    "ts_tsa": false,
                    "vnd": "Google Inc.",
                    "bid": "NA",
                    "mmt": "application/pdf,application/x-google-chrome-pdf,application/x-nacl,application/x-pnacl",
                    "plu": "Chrome PDF Plugin,Chrome PDF Viewer,Native Client",
                    "hdn": false,
                    "awe": false,
                    "geb": false,
                    "dat": false,
                    "med": "defined",
                    "aco": "probably",
                    "acots": false,
                    "acmp": "probably",
                    "acmpts": true,
                    "acw": "probably",
                    "acwts": false,
                    "acma": "maybe",
                    "acmats": false,
                    "acaa": "probably",
                    "acaats": true,
                    "ac3": "",
                    "ac3ts": false,
                    "acf": "probably",
                    "acfts": false,
                    "acmp4": "maybe",
                    "acmp4ts": false,
                    "acmp3": "probably",
                    "acmp3ts": false,
                    "acwm": "maybe",
                    "acwmts": false,
                    "ocpt": false,
                    "vco": "probably",
                    "vcots": false,
                    "vch": "probably",
                    "vchts": true,
                    "vcw": "probably",
                    "vcwts": true,
                    "vc3": "maybe",
                    "vc3ts": false,
                    "vcmp": "",
                    "vcmpts": false,
                    "vcq": "",
                    "vcqts": false,
                    "vc1": "probably",
                    "vc1ts": false,
                    "dvm": 8,
                    "sqt": false,
                    "so": "landscape-primary",
                    "wbd": false,
                    "wbdm": false,
                    "wdw": true,
                    "cokys": "bG9hZFRpbWVzY3NpYXBwcnVudGltZQ==L=",
                    "ecpc": false,
                    "lgs": true,
                    "lgsod": false,
                    "bcda": true,
                    "idn": true,
                    "capi": false,
                    "svde": false,
                    "vpbq": true,
                    "xr": true,
                    "bgav": true,
                    "rri": true,
                    "idfr": true,
                    "ancs": true,
                    "inlc": true,
                    "cgca": true,
                    "inlf": true,
                    "tecd": true,
                    "sbct": true,
                    "aflt": true,
                    "rgp": true,
                    "bint": true,
                    "spwn": false,
                    "emt": false,
                    "bfr": false,
                    "dbov": false,
                    "glvd": "Google Inc.",
                    "glrd": "ANGLE (NVIDIA GeForce GTX 960 Direct3D11 vs_5_0 ps_5_0)",
                    "tagpu": random2Vars(),
                    "prm": true,
                    "tzp": "America/New_York",
                    "cvs": true,
                    "usb": "defined"
                }),
            }).toString(),
        });
        const body = await response.text();
       //console.log(body.toString().substring(24, body.length - 2));
        return body.toString().substring(24, body.length - 2);
    }
}
module.exports = Datadome;