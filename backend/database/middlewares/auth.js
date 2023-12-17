const jwt = require("jsonwebtoken");
const config = require("config");
const { isMembersExist } = require('../services/general');

module.exports = async function (req, res, next) {
    const token = req.header("X-Auth-Token");
    if (!token) return res.status(400).send("Access denied! Missing request header token");

    try {
        // The verify function will parse whether the incoming token is legal. If it is not, an exception will be thrown. 
        // If it is legal, the content of the token will be returned
        const tokenData = jwt.verify(token, config.get("jwtKey"));
        const exist = await isMembersExist(tokenData.memberName);
        if (!exist) {
           return res.status(404).send("This Member does not exist in the database");
        }
        
        req.tokenData = tokenData;
        return next();
    } catch (error) {
        return res.status(400).send(`Member auth failed : ${error}`);
    }
};