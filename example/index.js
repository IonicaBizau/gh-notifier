"use strict";

const notify = require("../lib");

// Check every 3 seconds
notify("b80688e1...fc5ba8c4", 3000, (err, data) => {
    console.log(err || `${data.title[0]._} ${data.published[0]}`);
});
// GhitaB forked IonicaBizau/Resources to GhitaB/Resources 2016-01-12T09:03:22Z
