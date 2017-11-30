fastify-sequelizejs
===================
### Sequelize.js adapter for Fastify
----
**About Sequelize.js:**
<p align="center" />
	![sequelizejs image](http://docs.sequelizejs.com/manual/asset/logo-small.png)
	
Sequelize is a promise-based ORM for Node.js v4 and up. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.
*source: [website](http://sequelizejs.com)*

---
**Install:**
```bash
    npm install fastify-sequelizejs --save
```
**Usage:**
*server.js*
```javascript
	'use strict'
	
    const fastify = require('fastify')()
    const { Client } = require('fastify-sequelizejs')
	
	fastify.register(Client, {
		"dialect": "postgres",
        "database": "fastify_db_dev"
	})
```
*model.js*
```javascript
	// access to Databse
	const DB = fastify.Sequelize["fastify_db_dev"]

	// Defining a new Model
	DB.DefineModel('Users', {
       first_name: DB.Schema.STRING,
       last_name: DB.Schema.STRING,
       email: DB.Schema.STRING,
       password: DB.Schema.STRING
    })

    // access to Model
    const Model = DB.Models.Users

	// Sample Usage
	Model.create({
		first_name: 'John',
		last_name: 'Doe',
		email: 'john@doe.com',
		password: '123456'
	})
	Model.addHook('afterCreate', 'UserCreated', (user, options) => {
		console.log('user created!')
	})
```

Complete Sequelize Documention: [docs.sequelizejs.com](http://docs.sequelizejs.com/)
