const {Pool} = require('pg');

conexao = process.env.DATABASE_URL || "postgres://..."
const proConfig = {
    connectionString: conexao
}

const pool = new Pool(proConfig);

module.exports = {
    query: (text, params) => pool.query(text, params)
}