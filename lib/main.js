'use strict'

const fp = require('fastify-plugin')
const Sequelize = require('sequelize')
const log = require('debug')('fastify-sequelizejs')

const SequelizeActions = function(conn){
	return {
		Schema: this.Schema(),
		DefineModel: this.DefineModel.bind({Connection: conn}),
		Models: conn.models
	}
}
SequelizeActions.prototype.Schema = function() {
	return Sequelize
}
SequelizeActions.prototype.DefineModel = function(modelName, schema = {}) {
	this.Connection.define(modelName, schema).sync()
}

function fastifySequelize (fastify, {
	url,
	dialect,
	protocol = null,
	host = 'localhost',
	port,
	logging = false,
	database,
	username = null,
	password = null,
	sync = { force: true } ,
	operatorsAliases = false,
	pool = {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}, next) {
	let connection
	if (typeof url === 'undefined') {
		let connectionOpts = {
			dialect: dialect,
			protocol: protocol,
			host: host,
			port: port,
			logging: logging,
			sync: sync,
			operatorsAliases: operatorsAliases,
			pool: pool
		}
		switch(true) {
			case typeof dialect === 'undefined':
				return next('fastifySequelize Error: Connection Dialect is not defined.')
			break
			case typeof database === 'undefined':
				return next('fastifySequelize Error: Database Name is not defined.')
			break
			case typeof connectionOpts.port === 'undefined':
				switch (connectionOpts.dialect) {
					case 'mysql':
						connectionOpts.port = 3306
					break
					case 'postgres':
						connectionOpts.port = 5432
					break
					default:
						return next('fastifySequelize Error: Connection Port is not defined.')
				}
			break
		}
		connection = new Sequelize(database, username, password, connectionOpts)
	} else {
		connection = new Sequelize(url)
	}
	connection.authenticate()
		.then(() => {
			log('fastify-sequelizejs: connected to database.')
			fastify.decorate('Sequelize', {})
			fastify.Sequelize[database] = new SequelizeActions(connection)
			next()
		})
		.catch(err => {
			log('fastify-sequelizejs: connection failed.', err.message)
			next(err)
		})
}

module.exports.Client = fp(fastifySequelize, '>=0.13.1')
