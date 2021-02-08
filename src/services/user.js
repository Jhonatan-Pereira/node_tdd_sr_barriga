const ValidatorError = require('../errors/ValidatorError')

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select()
  }

  const save = async (user) => {

    if(!user.name) throw new ValidatorError('Nome é um atributo obrigatório')
    if(!user.mail) throw new ValidatorError('E-mail é um atributo obrigatório')
    if(!user.passwd) throw new ValidatorError('Senha é um atributo obrigatório')

    const userDb = await findAll({ mail: user.mail })

    if(userDb && userDb.length > 0) throw new ValidatorError('Já existe um usuário com este email')

    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}