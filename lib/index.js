const ParseXML = require("xml2js").parseString
    , Request = require("request")
    , PageChanged = require("page-changed")
    , Ul = require("ul")
    , Config = require(Ul.USER_DIR + "/.github-config")
    , notifier = require('node-notifier')
    , Moment = require("moment")
    , Path = require("path")
    ;

var pc = PageChanged({
    page: "https://github.com/" + Config.username + ".private.atom"
  , interval: 1000
}, function (err, body) {
    body = JSON.parse(body);
    notifier.notify({
        title: body.title[0]._
      , message: Moment(body.published[0]).fromNow()
      , icon: __dirname + "/../res/gh.png"
    });

});

pc.request = function (cb) {
    Request.get({
        headers: {
            "user-agent": "GitHub - Notify"
        }
      , auth: {
            username: Config.username
          , password: Config.token
        }
      , url: this.page
    }, function (err, status, body) {
        ParseXML(body, function (err, result) {
            if (err) { return; }
            cb(null, JSON.stringify(result.feed.entry[0]));
        });
    });
};
