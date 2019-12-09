const should = require('should');
const request = require('supertest');
const app = require('../app');

const Students = require('../models/student');

describe('Students tests \n\n', function() {

  before(() => {
    return Students.deleteMany({})
      .then(() => {
        return Promise.all([
             Students.create({
               _id: "5c4a09796b13b42a8e793cf2",
               fullname: "Juan Perez",
               address: "Calle Falsa 123",
               birthDate: new Date(1995, 11, 11)
             }),
         ]);
      });
  });

  it('Get Students should return the list of created students', () => {
    return request(app)
      .get(`/students`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.length.should.be.equal(1)
        response.body[0].fullname.should.be.equal("Juan Perez");
        response.body[0].address.should.be.equal("Calle Falsa 123");
        const bodyBirthDate = response.body[0].birthDate.substring(0, response.body[0].birthDate.indexOf('T'));
        bodyBirthDate.should.be.equal("1995-12-11");
      });
  });

  it('Register new Student', () => {
    const body = {
      fullname: "Lionel Messi",
      address: "Calle Falsa 321",
      birthDate: new Date(1986, 7, 24)
    };
    return request(app)
      .post(`/students`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const newStudent = await Students.findOne({fullname: "Lionel Messi"}).lean();
        newStudent.fullname.should.be.equal("Lionel Messi");
        newStudent.address.should.be.equal("Calle Falsa 321");
      });
  });

  it('Failed to Register new Student with missing_params', () => {
    const body = {
      fullname: "Lionel Messi",
      address: "Calle Falsa 321"
    };
    return request(app)
      .post(`/students`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.msg.should.be.equal('Missing params');
      });
  });

  after(() => {
    return Promise.all([
        Students.deleteMany({})
    ]);
  });
});
