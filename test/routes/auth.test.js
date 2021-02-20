const request = require('supertest')
const app = require('../../src/app')

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