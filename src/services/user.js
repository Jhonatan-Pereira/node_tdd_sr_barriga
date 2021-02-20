const ValidatorError = require('../errors/ValidatorError')
const bcrypt = require('bcrypt-nodejs')

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail'])
  }

  const getPasswdHash = (passwd) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(passwd, salt)
  }

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first()
  }

  const save = async (user) => {

    if(!user.name) throw new ValidatorError('Nome é um atributo obrigatório')
    if(!user.mail) throw new ValidatorError('E-mail é um atributo obrigatório')
    if(!user.passwd) throw new ValidatorError('Senha é um atributo obrigatório')

    const userDb = await findOne({ mail: user.mail })

    if(userDb) throw new ValidatorError('Já existe um usuário com este email')

    const newUser = { ...user }
    newUser.passwd = getPasswdHash(user.passwd)

    return app.db('users').insert(newUser, ['id', 'name', 'mail'])
  }

  return { findAll, save, findOne }
}