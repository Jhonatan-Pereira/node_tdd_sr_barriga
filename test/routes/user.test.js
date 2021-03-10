const request = require('supertest')
const jwt = require('jwt-simple')

const app = require('../../src/app')

const mail = `${Date.now()}@mail.com`

const MAIN_ROUTE = '/v1/users';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, passwd: '123456' })
  user = { ...res[0] }
  user.token = jwt.encode(user, 'Segredo!')
})


test('Deve listar todos os usuários', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('Deve inserir usuário com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Jhonatan Frade', mail, passwd: '12345' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Jhonatan Frade')
      expect(res.body).not.toHaveProperty('passwd')
    })
})

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', mail: `${Date.now()}@mail.com`, passwd: '12345' })
    .set('authorization', `bearer ${user.token}`)

  expect(res.status).toBe(201)

  const { id } = res.body
  const userDB = await app.services.user.findOne({ id })
  expect(userDB.passwd).not.toBeUndefined()
  expect(userDB.passwd).not.toBe('12345')
})

test('Não deve inserir usuário sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ mail: 'teste@teste.com', passwd: '12345' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Nome é um atributo obrigatório')
    })
})

test('Não deve inserir usuário sem e-mail', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', passwd: '12345' })
    .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('E-mail é um atributo obrigatório')
})

test('Não deve inserir usuário sem senha', (done) => {
  request(app).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', mail: 'teste@teste.com' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Senha é um atributo obrigatório')
      done()
    })
    .catch(err => done.fail(err))
})

test('Não deve inserir usuário com email existente', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', mail, passwd: '12345' })
    .set('authorization', `bearer ${user.token}`)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Já existe um usuário com este email')
    })
})