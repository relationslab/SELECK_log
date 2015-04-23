var winston = require('winston');

function now() {
  var zeroPadding = function(target) {
    return ('0' + target).slice(-2);
  }

  var now = new Date();
  var date = zeroPadding(now.getUTCFullYear()) + "-"
    + zeroPadding(now.getUTCMonth() + 1) + "-"
    + zeroPadding(now.getDate());
  var time = zeroPadding(now.getUTCHours()) + ":"
    + zeroPadding(now.getUTCMinutes()) + ":"
    + zeroPadding(now.getUTCSeconds());

  return date + "T" + time + "+09:00";
}

module.exports = function(opt) {
  var system = opt.system || 'node app';
  var subSystem = opt.subSystem || '-';
  var version = opt.version || 'Unknown Version';
  var host = opt.host || 'Unknonw Host';
  var level = opt.level || 'debug';
  var path = opt.path || './.tmp/test.log';
  var toConsole = opt.toConsole || true;

  return new winston.Logger({
    transports: [
      new (winston.transports.File)({
        level: level,
        filename: path,
        json: false,
        formatter: function(args) {
          if (toConsole) {
            console.log(args.message);
          }

          var header = now() + " " + args.level.toUpperCase();
          var app = '<' + system + '-' + subSystem + " " + version + '>';

          return header + '-' + app + '<' + host + '>' + args.message;
        }
      })
    ]
  });
}
