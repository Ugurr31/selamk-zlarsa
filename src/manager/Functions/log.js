const moment = require("moment");
moment.locale("tr");

function log(text) {

    const log = console.log(`[${moment().format("DD.MM.YYYY HH:mm:ss")}] ${text}`);

    return log;

};

module.exports = log;