const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Replace with the path to your Express app setup file

describe('API Endpoints', () => {
 
  it('should get a list of users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done(); // Call done() to signal that the test is complete
      });
  });

  it('should get a user by ID', (done) => {
    request(app)
      .get('/users/1') // Replace '1' with an existing user ID
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        done(); // Call done() to signal that the test is complete
      });
  });

  it('should create a new user', (done) => {
    const newUser = {
      telegramid: 'newuser',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    request(app)
      .post('/users')
      .send(newUser)
      .expect(201) 
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.telegramid).to.equal(newUser.telegramid);
        done(); 
      });
  });
});
