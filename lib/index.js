var ParseXML = require("xml2js").parseString
  , Request = require("request")
  , PageChanged = require("page-changed")
  , Ul = require("ul")
  , Config = require(Ul.USER_DIR + "/.github-config")
  , BNotify = require("bnotify")
  , Moment = require("moment")
  , Path = require("path")
  ;

var pc = PageChanged({
    page: "https://github.com/" + Config.username + ".private.atom"
  , interval: 1000
}, function (err, body) {
    body = JSON.parse(body);
    BNotify({
        title: body.title[0]._
      , description: Moment(body.published[0]).fromNow()
      , duration: 9000
      , icon: "https://raw.githubusercontent.com/github/octicons/master/svg/mark-github.svg"
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
