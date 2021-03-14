
exports.seed = (knex) => {
  return knex('users').insert([
    { id: 10100, name: 'User #3', mail: 'user3@mail.com', passwd: '$2a$10$WOfyC8Q3fu4eFxG1buXVieBImyAFo8tpcNTgskCsV8qhXrY6nprMG' },
    { id: 10101, name: 'User #4', mail: 'user4@mail.com', passwd: '$2a$10$WOfyC8Q3fu4eFxG1buXVieBImyAFo8tpcNTgskCsV8qhXrY6nprMG' }
  ])
  .then(() => knex('accounts').insert([
    { id: 10100, name: 'Acc saldo principal', user_id: 10100 },
    { id: 10101, name: 'Acc saldo secundário', user_id: 10100 },
    { id: 10102, name: 'Acc alternativa 1', user_id: 10101 },
    { id: 10103, name: 'Acc alternativa 2', user_id: 10101 },
  ]))
};
