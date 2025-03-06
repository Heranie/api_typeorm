const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    
    try {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        // connect to db
        const sequelize = new Sequelize(database, user, password, { 
            dialect: 'mysql',
            host: host,
            port: port
        });

        // init models and add them to the exported db object
        db.User = require('../users/user.model')(sequelize);

        // sync all models with database
        await sequelize.sync({ alter: true });
        
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error.message);
        console.error("Please make sure your MySQL server is running and the credentials in config.json are correct");
        process.exit(1);
    }
}