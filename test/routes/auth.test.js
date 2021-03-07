const request = require('supertest')
const app = require('../../src/app')

test('Deve criar usuário via signup', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'Walter', mail: `${Date.now()}@gmail.com`, passwd: '12345' })
    .then((res) => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Walter')
      expect(res.body).toHaveProperty('mail')
      expect(res.body).not.toHaveProperty('passwd')
    })
})

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@gmail.com`
  const passwd = '12345'
  return app.services.user.save({name: 'Walter', mail, passwd })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ mail, passwd })
        .then((res) => {
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('token')
        })
    })
})

test('Não deve autenticar usuário com senha errada', () => {
  const mail = `${Date.now()}@gmail.com`
  return app.services.user.save({name: 'Walter', mail, passwd: '12345' })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ mail, passwd: '654321' })
        .then((res) => {
          expect(res.status).toBe(400)
          expect(res.body.error).toBe('Usuário ou senha inválido')
        })
    })
})

test('Não deve autenticar usuário com email errado', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'naoexiste@gmail.com', passwd: '654321' })
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Usuário ou senha inválido')
    })
})

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401)
    })
})