import knex from 'knex';

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

connection.on('query', (query) => {
  console.log('SQL: ', query.sql);
  console.log('Bindings: ', query.bindings);
  const q = connection.raw(query.sql, query.bindings).toQuery();  
  console.log('[db]', q);
});