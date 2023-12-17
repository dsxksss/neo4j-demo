const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function registerControllers(expressApp) {
    const controllersPath = path.join(__dirname, 'database', 'controllers');

    fs.readdir(controllersPath, (err, files) => {
        if (err) {
            console.error('Unable to read controller directory!,error:', err);
            return;
        }

        files.forEach(file => {
            // Only handle .js files
            if (path.extname(file) === '.js') {
                const controller = require(path.join(controllersPath, file));
                // load the controller
                expressApp.use(`/${file.split(".")[0]}`, controller);
                console.log(`Controller [${chalk.blue(`/${file.split(".")[0]}`)}] loaded.`);
            }
        });
    });
}

module.exports = { registerControllers };