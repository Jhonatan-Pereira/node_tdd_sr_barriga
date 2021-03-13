const ValidatorError = require('../errors/ValidatorError')

module.exports = (app) => {
  const save = async (account) => {

    if(!account.name) throw new ValidatorError('Nome é um atributo obrigatório')

    const accDb = await find({ name: account.name, user_id: account.user_id })
    if(accDb) throw new ValidatorError('Já existe uma conta com este nome')

    return app.db('accounts').insert(account, '*')
  }

  const findAll = (user_id) => {
    return app.db('accounts').where({ user_id })
  }

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first()
  }

  const update = (id, account) => {
    return app.db('accounts').where({ id }).update(account, '*')
  }

  const remove = async (id) => {

    const transaction = await app.services.transaction.findOne({ acc_id: id })
    if(transaction) throw new ValidatorError('Essa conta possui transações associadas')

    return app.db('accounts').where({ id }).del()
  }

  return { save, findAll, find, update, remove }
}