const { Pool } = require('pg');
const config = require('config');
const tablesSchemas = require('./models/tablesSchemas');
const chalk = require('chalk');

let dbInstance = null;

class Database {
    constructor() {
        this.pool = new Pool({
            database: 'postgres', // the default database name
            user: config.get("pgConnectConfig.user"),
            password: config.get("pgConnectConfig.password"),
            host: config.get("pgConnectConfig.host"),
            port: config.get("pgConnectConfig.port"),
            max: config.get("pgConnectConfig.maxConnections"),
            idleTimeoutMillis: config.get("pgConnectConfig.idleTimeoutMillis"),
            connectionTimeoutMillis: config.get("pgConnectConfig.connectionTimeoutMillis"),
        });
    }

    static getInstance() {
        if (!dbInstance) {
            dbInstance = new Database();
        }
        return dbInstance;
    }

    async checkDatabaseExists() {
        const client = await this.pool.connect();
        try {
            const result = await client.query("SELECT datname FROM pg_database WHERE datname = $1", [
                // Because when PostgreSQL creates a database, the database name is all lowercase.
                config.get("pgConnectConfig.database").toLowerCase()
            ]);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error checking if database exists: ${error}`)
        } finally {
            client.release();
        }
    }

    async createDatabase() {
        const client = await this.pool.connect();
        try {
            await client.query(`CREATE DATABASE ${config.get("pgConnectConfig.database")}`);
        } catch (error) {
            throw new Error(`Error createDatabase failed: ${error}`)
        } finally {
            client.release();
        }
    }

    async syncTables() {
        const client = await this.pool.connect();
        try {
            for (let [tableName, tablesSchemaSql] of Object.entries(tablesSchemas)) {
                await client.query(tablesSchemaSql);
                console.log(`Table [${chalk.green(tableName)}] created successfully`);
            }
        } catch (error) {
            throw new Error(`Error syncTables failed: ${error}`)
        } finally {
            client.release();
        }
    }

    async connectToDatabase() {
        try {
            const databaseExists = await this.checkDatabaseExists();
            if (!databaseExists) {
                await this.createDatabase();
            }

            // Update the DB instance
            this.pool = new Pool({
                database: config.get("pgConnectConfig.database").toLowerCase(), // the default database name
                user: config.get("pgConnectConfig.user"),
                password: config.get("pgConnectConfig.password"),
                host: config.get("pgConnectConfig.host"),
                port: config.get("pgConnectConfig.port"),
                max: config.get("pgConnectConfig.maxConnections"),
                idleTimeoutMillis: config.get("pgConnectConfig.idleTimeoutMillis"),
                connectionTimeoutMillis: config.get("pgConnectConfig.connectionTimeoutMillis"),
            });

            // synchronized tables
            await this.syncTables();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

module.exports = Database;