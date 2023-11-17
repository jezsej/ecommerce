const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'Rootqas123@',
    port: 5432,
    host: 'localhost',
    database: 'ecommerce'
});

module.exports = pool;