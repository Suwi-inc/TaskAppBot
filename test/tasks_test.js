const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../index');
const { Pool } = require('pg');

const URL = "postgres://mqpnptxk:RmLLPKHco0tZNR3p7pr0lhCc2BnJzhwQ@ella.db.elephantsql.com/mqpnptxk";

const pool = new Pool({
  connectionString: URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /tasks/:id', () => {
  it('should return a task when a valid task ID is provided', (done) => {
    const taskId = 70; // Replace with a valid task ID from your database

    chai
      .request(app)
      .get(`/tasks/${taskId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('taskid');
        expect(res.body).to.have.property('userid');
        expect(res.body).to.have.property('creationdate');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('duedate');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('reminder');
        expect(res.body).to.have.property('senderurl');
        done();
      });
  });

  it('should return a 404 status when an invalid task ID is provided', (done) => {
    const invalidTaskId = 999999; // Replace with an invalid task ID

    chai
      .request(app)
      .get(`/tasks/${invalidTaskId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.equal('Task not found');
        done();
      });
  });

  it('should return a 500 status when an error occurs', (done) => {
    const taskIdWithError = 'error'; // Replace with a task ID that would trigger an error in your code

    chai
      .request(app)
      .get(`/tasks/${taskIdWithError}`)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error').to.equal('Internal Server Error');
        done();
      });
  });
});
