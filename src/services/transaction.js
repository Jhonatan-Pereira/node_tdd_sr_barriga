const ValidatorError = require('../errors/ValidatorError')

module.exports = (app) => {
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.user_id', '=', userId)
      .select()
  }

  const save = (transaction) => {

    if(!transaction.description) throw new ValidatorError('description é um atributo obrigatório')
    if(!transaction.ammount) throw new ValidatorError('ammount é um atributo obrigatório')
    if(!transaction.date) throw new ValidatorError('date é um atributo obrigatório')
    if(!transaction.acc_id) throw new ValidatorError('acc_id é um atributo obrigatório')
    if(!transaction.type) throw new ValidatorError('type é um atributo obrigatório')
    if(!['I','O'].includes(transaction.type)) throw new ValidatorError('type é um atributo inválido')

    const newTransaction = {...transaction}

    if( (transaction.type === 'I' && transaction.ammount < 0)
      || (transaction.type === 'O' && transaction.ammount > 0)) {
      newTransaction.ammount *= -1;
    }

    return app.db('transactions')
      .insert(newTransaction, '*')
  }

  const findOne = (filter) => {
    return app.db('transactions')
      .where(filter)
      .first()
  }

  const update = (id, transaction) => {
    return app.db('transactions')
      .where({ id })
      .update(transaction, '*')
  }

  const remove = (id) => {
    return app.db('transactions')
      .where({ id })
      .del()
  }

  return { find, save, findOne, update, remove }
}