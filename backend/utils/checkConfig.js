const config = require("config"); //读取配置文件信息库

function checkCofing() {
  const ENV_MISSING_FIELDS = [];
  const DEFAULT_MISSING_FIELDS = [];
  let IS_MISSING = false;

  const envConfigs = [
    "jwtKey",
    "bcryptKey",
  ];
  envConfigs.forEach((configName) => {
    if (!config.has(configName)) ENV_MISSING_FIELDS.push(configName);
  });

  const defaultConfigs = [
    "serverConfig.host",
    "serverConfig.port",
    "pgConnectConfig.port",
    "pgConnectConfig.user",
    "pgConnectConfig.password",
    "pgConnectConfig.database",
    "pgConnectConfig.host",
    "pgConnectConfig.port",
    "pgConnectConfig.maxConnections",
    "pgConnectConfig.idleTimeoutMillis",
    "pgConnectConfig.connectionTimeoutMillis"
  ];
  defaultConfigs.forEach((configName) => {
    if (!config.has(configName)) DEFAULT_MISSING_FIELDS.push(configName);
  });

  if (ENV_MISSING_FIELDS.length > 0) {
    console.log(
        `Missing config fields: [${ENV_MISSING_FIELDS}], Please check the environment variable and start the service again.`,
    );
    IS_MISSING = true;
  }

  if (DEFAULT_MISSING_FIELDS.length > 0) {
    console.log(
        `Missing default.json config fields: [${DEFAULT_MISSING_FIELDS}],please check the configuration file and start the service again.`,
    );
    IS_MISSING = true;
  }

  if(IS_MISSING){
    process.exit(1);
  }
  
}

module.exports = checkCofing;