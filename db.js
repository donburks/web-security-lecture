const { Client } = require('pg');
const client = new Client({ database: 'owasp' });

client.connect();
module.exports = client;
