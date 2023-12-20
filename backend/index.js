const express = require('express');
const config = require('config');
const chalk = require('chalk');
const multer = require('multer');
const checkCofing = require("./utils/checkConfig")
const morgan = require('morgan');
const figlet = require('figlet');
const cors = require('cors');
const fs = require('fs')
const path = require('path');
const app = express();
const { registerControllers } = require('./registerControllers')

figlet(`demo`,async function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(chalk.yellowBright(data));
    checkCofing();
    const logStream = fs.createWriteStream(path.join(__dirname, "demo_backend.log"), {
        flags: "a",
    });
    app.use(cors());
    app.use(express.json())
    app.use(express.static(path.join(__dirname, "static")));
    app.use(morgan("combined", { stream: logStream }));

    registerControllers(app);

    const serverConfigHost = config.get('serverConfig.host')
    const serverConfigPort = config.get('serverConfig.port');
    app.listen(serverConfigPort,serverConfigHost, () => {
        console.log("demo backend server is running on",chalk.green(`${serverConfigHost}:${serverConfigPort}`));
    });
});


