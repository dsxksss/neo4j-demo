const config = require('config');
const bcrypt = require('bcrypt');

const encryptionData=(data)=>{
    const salt = bcrypt.genSaltSync(10);
    const hashedData = bcrypt.hashSync(`${data}-${config.get("bcryptKey")}`, salt);
    return hashedData;
}

const compareBcryptData = (newData,oldData)=>{
    const validate = bcrypt.compareSync(`${newData}-${config.get("bcryptKey")}`, oldData);
    return validate;
} 

module.exports = { encryptionData, compareBcryptData }