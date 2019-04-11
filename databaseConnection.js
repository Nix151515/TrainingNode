exports.knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '192.168.64.3',
		port:3306,
        user: 'username',
        password: 'password',
        database: 'Proiect1'
    }
});

