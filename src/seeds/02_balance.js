
const moment = require('moment');

exports.seed = (knex) => {
  return knex('users').insert([
    { id: 10100, name: 'User #3', mail: 'user3@mail.com', passwd: '$2a$10$WOfyC8Q3fu4eFxG1buXVieBImyAFo8tpcNTgskCsV8qhXrY6nprMG' },
    { id: 10101, name: 'User #4', mail: 'user4@mail.com', passwd: '$2a$10$WOfyC8Q3fu4eFxG1buXVieBImyAFo8tpcNTgskCsV8qhXrY6nprMG' },
    { id: 10102, name: 'User #5', mail: 'user5@mail.com', passwd: '$2a$10$WOfyC8Q3fu4eFxG1buXVieBImyAFo8tpcNTgskCsV8qhXrY6nprMG' },
  ])
  .then(() => knex('accounts').insert([
    { id: 10100, name: 'Acc saldo principal', user_id: 10100 },
    { id: 10101, name: 'Acc saldo secundário', user_id: 10100 },
    { id: 10102, name: 'Acc alternativa 1', user_id: 10101 },
    { id: 10103, name: 'Acc alternativa 2', user_id: 10101 },
    { id: 10104, name: 'Acc geral principal', user_id: 10102 },
    { id: 10105, name: 'Acc geral secundário', user_id: 10102 },
  ]))
  .then(() => knex('transfers').insert([
    { id: 10100, description: 'Transfer #1', user_id: 10102, acc_ori_id: 10105, acc_dest_id: 10104, ammount: 256, date: new Date() },
    { id: 10101, description: 'Transfer #2', user_id: 10101, acc_ori_id: 10102, acc_dest_id: 10103, ammount: 512, date: new Date() },
  ]))
  .then(() => knex('transactions').insert([
    // transação positiva / saldo = 2 / saldo = 0
    { description: '2', date: new Date(), ammount: 2, type: 'I', acc_id: 10104, status: true },
    // transação usuário errado / saldo = 2 / saldo = 0
    { description: '2', date: new Date(), ammount: 4, type: 'I', acc_id: 10102, status: true },
    // transação outra conta / saldo = 2 / saldo = 8
    { description: '2', date: new Date(), ammount: 8, type: 'I', acc_id: 10105, status: true },
    // transação pendente / saldo = 2 / saldo = 8
    { description: '2', date: new Date(), ammount: 16, type: 'I', acc_id: 10104, status: false },
    // transação passada / saldo = 34 / saldo = 8
    { description: '2', date: moment().subtract({ days: 5 }), ammount: 32, type: 'I', acc_id: 10104, status: true },
    // transação futura / saldo = 34 / saldo = 8
    { description: '2', date: moment().add({ days: 5 }), ammount: 64, type: 'I', acc_id: 10104, status: true },
    // transação negativa / saldo = -94 / saldo = 8
    { description: '2', date: new Date(), ammount: -128, type: 'O', acc_id: 10104, status: true },
    // transferência / saldo = 162 / saldo = -248
    { description: '2', date: new Date(), ammount: 256, type: 'I', acc_id: 10104, status: true },
    { description: '2', date: new Date(), ammount: -256, type: 'O', acc_id: 10105, status: true },
    // transferência / saldo = 162 / saldo = -248
    { description: '2', date: new Date(), ammount: 512, type: 'I', acc_id: 10103, status: true },
    { description: '2', date: new Date(), ammount: -512, type: 'O', acc_id: 10102, status: true },
  ]));
};
