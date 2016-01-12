const parseXML = require("xml2js").parseString
    , request = require("request")
    , pageChanged = require("page-changed")
    , ul = require("ul")
    , config = require(ul.USER_DIR + "/.github-config")
    , notifier = require('node-notifier')
    , moment = require("moment")
    , path = require("path")
    ;

var pc = pageChanged({
    page: "https://github.com/" + config.username + ".private.atom"
  , interval: 1000
}, function (err, body) {
    body = JSON.parse(body);
    notifier.notify({
        title: body.title[0]._
      , message: moment(body.published[0]).fromNow()
      , icon: __dirname + "/../res/gh.png"
    });

});

pc.request = function (cb) {
    request.get({
        headers: {
            "user-agent": "GitHub - Notify"
        }
      , auth: {
            username: config.username
          , password: config.token
        }
      , url: this.page
    }, function (err, status, body) {
        parseXML(body, function (err, result) {
            if (err) { return; }
            cb(null, JSON.stringify(result.feed.entry[0]));
        });
    });
};
