const should = require('should');
const request = require('supertest');
const app = require('../app');

const Students = require('../models/student');
const Careers = require('../models/career');

describe('Careers tests \n\n', function() {

  before(() => {
    return Promise.all([Students.deleteMany({}), Careers.deleteMany({})])
      .then(() => {
        return Promise.all([
             Students.create({
               _id: "5c4a09796b13b42a8e793cf2",
               fullname: "Juan Perez",
               address: "Calle Falsa 123",
               birthDate: new Date(1995, 11, 11)
             }),
             Careers.create({
               _id: "5c4a09796b13b42a8e793cf1",
               name: 'Ingenieria informatica',
               degree: 'Ingeniero en Informatica'
             })
         ]);
      });
  });

  it('Get Careers should return the list of active careers', () => {
    return request(app)
      .get(`/careers`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.length.should.be.equal(1);
        response.body[0].name.should.be.equal("Ingenieria informatica");
        response.body[0].degree.should.be.equal("Ingeniero en Informatica");
      });
  });

  it('Register new Career', () => {
    const body = {
      name: "Arquitectura",
      degree: "Arquitecto"
    };
    return request(app)
      .post(`/careers`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const newStudent = await Careers.findOne({name: "Arquitectura"}).lean();
        newStudent.name.should.be.equal("Arquitectura");
        newStudent.degree.should.be.equal("Arquitecto");
      });
  });

  it('Failed to Register new Career with missing_params', () => {
    const body = {
      name: "Medicina"
    };
    return request(app)
      .post(`/careers`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.msg.should.be.equal('Missing params');
      });
  });

  it('Subscribe a student to a career should fail if career does not exist', () => {
    const body = {
      student: "5c4a09796b13b42a8e793cf2",
      career: "5c4a09796b13b42a8e793cf0"
    };
    return request(app)
      .post(`/careers/subscribe`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(400)
      .then(async (response) => {
        response.body.msg.should.be.equal('Career not found');
        const student = await Students.findById("5c4a09796b13b42a8e793cf2").lean();
        should.not.exist(student.career);
      });
  });

  it('Subscribe a student to a career should fail if career the student does not exist', () => {
    const body = {
      student: "5c4a09796b13b42a8e793cf0",
      career: "5c4a09796b13b42a8e793cf1"
    };
    return request(app)
      .post(`/careers/subscribe`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(400)
      .then(async (response) => {
        response.body.msg.should.be.equal('Student not found');
      });
  });

  it('Subscribe a student to a career', () => {
    const body = {
      student: "5c4a09796b13b42a8e793cf2",
      career: "5c4a09796b13b42a8e793cf1"
    };
    return request(app)
      .post(`/careers/subscribe`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        response.body.msg.should.be.equal('Student subscribed successfully');
        const student = await Students.findById("5c4a09796b13b42a8e793cf2");
        const careerId = student.career.toString();
        careerId.should.be.equal("5c4a09796b13b42a8e793cf1");
      });
  });

  after(() => {
    return Promise.all([
        Students.deleteMany({}),
        Careers.deleteMany({})
    ]);
  });
});
