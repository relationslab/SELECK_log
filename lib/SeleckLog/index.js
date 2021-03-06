var winston = require('winston');

// Date Formatter
function now() {
  var zeroPadding = function(target) {
    return ('0' + target).slice(-2);
  }

  var now = new Date();
  var date = now.getFullYear() + "-"
    + zeroPadding(now.getMonth() + 1) + "-"
    + zeroPadding(now.getDate());
  var time = zeroPadding(now.getHours()) + ":"
    + zeroPadding(now.getMinutes()) + ":"
    + zeroPadding(now.getSeconds());

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
  var environment = opt.environment || 'development';

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
          var app = '<' + system + '-' + subSystem + "(" + version + ')> <' + environment + '>';
          var msg = '';

          // check BigQuery Message
          var messages = args.message.split(' ');
          if (messages.length > 1 && /^bq_/.test(messages[messages.length - 1])) {

            var bqTag = messages[messages.length - 1];
            msg = '<' + bqTag + '> ' + args.message.replace(' ' + bqTag, '');
          }
          else {
            msg = args.message;
          }

          return header + ' - ' + app + ' <' + host + '> ' + msg;
        }
      })
    ]
  });
}
