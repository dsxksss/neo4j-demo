const fs = require("fs");
const path = require("path");
const STATICPATHNAEM = path.join(__dirname,"static");
if (!fs.existsSync(STATICPATHNAEM)) fs.mkdirSync(STATICPATHNAEM);

exports.STATICPATH = STATICPATHNAEM;