require('dotenv').config();
const fs = require('fs');

const path = require('path');

const Sequelize = require('sequelize');

const basename = path.basename(module.filename);

const env = process.env.ENVIRONMENT || 'development';
const maxPools = 15;

const config = require(`../../postgres-config.js`)[env];
const db = {};
let sequelize;

// set max pool and appName
config.pool = { max: maxPools, min: 0, idle: 10000 };
if (!config.dialectOptions) {
  config.dialectOptions = {};
}

config.dialectOptions.application_name = process.env.PG_APPNAME || 'sl_no_app_name';

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const options = {};
options.logging = false;
options.force = true;

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
