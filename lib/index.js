"use strict";

// Dependencies
const parseXML = require("xml2js").parseString
    , request = require("request")
    , pageChanged = require("page-changed")
    , notifier = require('node-notifier')
    , moment = require("moment")
    , path = require("path")
    , GitHub = require("gh.js")
    ;

/**
 * githubNotify
 * Creates requests to the GitHub private atom stream and calls the callback
 * function when there is a new item in the stream.
 *
 * @name githubNotify
 * @function
 * @param {String} token The GitHub token.
 * @param {Number} interval The number of milliseconds between requests.
 * @param {Function} callback The callback function.
 * @return {PageChanged} The [`PageChanged`](https://github.com/IonicaBizau/node-page-changed) instance.
 */
module.exports = function githubNotify(token, interval, callback) {

    if (!token) {
        return callback(new Error("The token is mandatory."));
    }

    var gh = new GitHub({
        token: token
    });

    gh.get("user", (err, authUser) => {
        if (err) { return callback(err); }

        var pc = pageChanged({
            page: `https://github.com/${authUser.login}.private.atom`
          , interval: interval
          , request: function (cb) {
                request.get({
                    headers: {
                        "user-agent": "GitHub - Notify"
                    }
                  , auth: {
                        username: authUser.login
                      , password: token
                    }
                  , url: this.page
                }, function (err, res, body) {
                    if (res.statusCode === 404) {
                        err = new Error("Cannot access the private stream. Check if your token has access to the private stream.");
                    }
                    if (err) { return callback(err); }
                    parseXML(body, function (err, result) {
                        if (err) { return cb(err); }
                        cb(null, JSON.stringify(result.feed.entry[0]));
                    });
                });
            }
        }, (err, body) => {
            if (err) { return callback(err); }
            body = JSON.parse(body);
            callback(null, body);
        });

    });

    return gh;
};
