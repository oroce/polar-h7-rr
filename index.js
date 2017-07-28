const noble = require('noble');
const debug = require('debug')('polar-h7-rr');
const through = require('through');

var startTime;
function onRead(val) {
  if (!startTime) {
    startTime = Date.now();
  }
  const diff = (Date.now() - startTime) / 1000;
  const rate = val.readUInt8(1);
  const n = (val.length - 2) / 2;
  if (n === 0) {
    return;
  }
  const rr = +(val.readUInt16LE(2 + 2 * 0).toFixed(4));
  if (!rr) {
    return;
  }
  return {
    timediff: diff,
    rr: rr
  };
}

const noop = () => {};
module.exports = function(opts) {
  if (!opts.uuid) {
    throw new Error('Please pass an uuid');
  }
  let onstartCalled = false;
  const onstart = opts.onstart || noop;
  const stream = through(function write(data) {
    this.queue(data) //data *must* not be null
  });

  noble.on('discover', function(p) {
    if (p.id !== opts.uuid) {
      debug('ignore unknown device: %s (%j)', p.id, p.advertisement.localName);
      return;
    }
    debug('trying to connect to %s (%j)', p.id, p.advertisement.localName)
    p.connect(function() {
      debug('connected to %s (%j)', p.id, p.advertisement.localName);

      p.discoverServices(['180d'], (_, ss) => {
        ss[0].discoverCharacteristics(['2a37'], (_, cs) => {
          cs[0].notify(true);
          cs[0].on('read', function(val) {
            const ret = onRead(val);
            if (ret) {
              if (!onstartCalled) {
                onstartCalled = true;
                onstart();
              }
              stream.write(ret);
            }
          });
        });
      });
    });
  });

  noble.on('stateChange', function(state) {
    debug('noble\'s state is %s', state);
    if (state == 'poweredOn') {
      noble.startScanning();
    }
    else {
      noble.stopScanning()
    }
  });

  if (noble.state === 'poweredOn') {
    noble.startScanning();
  }

  return stream;
}
