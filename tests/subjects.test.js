const should = require('should');
const request = require('supertest');
const app = require('../app');

const Students = require('../models/student');
const Careers = require('../models/career');
const Subjects = require('../models/subject');
const StudentSubjects = require('../models/student-subject');

describe('Subjects tests \n\n', function() {

  before(() => {
    return Promise.all([Students.deleteMany({}), Careers.deleteMany({}), Subjects.deleteMany()])
      .then(() => {
        return Promise.all([
             Students.create({
               _id: "5c4a09796b13b42a8e793cf2",
               fullname: "Juan Perez",
               address: "Calle Falsa 123",
               birthDate: new Date(1995, 11, 11),
               career: "5c4a09796b13b42a8e793cf1"
             }),
             Careers.create({
               _id: "5c4a09796b13b42a8e793cf1",
               name: 'Ingenieria informatica',
               degree: 'Ingeniero en Informatica'
             }),
             Careers.create({
               _id: "5c4a09796b13b42a8e793cf3",
               name: 'Sociologia',
               degree: 'Licenciado en Sociologia'
             }),
             Subjects.create({
               _id: "5c4a09796b13b42a8e793cf1",
               name: 'Matematica 1',
               weeklyHours: 8,
               careers: ["5c4a09796b13b42a8e793cf1"]
             }),
             Subjects.create({
               _id: "5c4a09796b13b42a8e793cf5",
               name: 'Programcion',
               weeklyHours: 8,
               careers: ["5c4a09796b13b42a8e793cf1"]
             }),
             Subjects.create({
               _id: "5c4a09796b13b42a8e793cf4",
               name: 'Filosofia',
               weeklyHours: 8,
               careers: ["5c4a09796b13b42a8e793cf3"]
             }),
             StudentSubjects.create({
               _id: "5c4a09796b13b42a8e793cf9",
               student: '5c4a09796b13b42a8e793cf2',
               subject: '5c4a09796b13b42a8e793cf5'
             })
         ]);
      });
  });

  it('Get subjects should return the list of created subjects', () => {
    return request(app)
      .get(`/subjects`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        response.body.length.should.be.equal(3)
        response.body[0].name.should.be.equal("Matematica 1");
        response.body[0].weeklyHours.should.be.equal(8);
      });
  });

  it('Register new Subject', () => {
    const body = {
      name: "Programacion",
      weeklyHours: 8
    };
    return request(app)
      .post(`/subjects`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const newSubject = await Subjects.findOne({name: "Programacion"}).lean();
        newSubject.name.should.be.equal("Programacion");
        newSubject.weeklyHours.should.be.equal(8);
      });
  });

  it('Add subject to one career', () => {
    const body = {
      subject: "5c4a09796b13b42a8e793cf1",
      careers: ["5c4a09796b13b42a8e793cf1"]
    };
    return request(app)
      .post(`/subjects/addToCareers`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const newSubject = await Subjects.findById("5c4a09796b13b42a8e793cf1").lean();
        newSubject.careers.length.should.be.equal(2);
      });
  });

  it('Add subject to multiple careers', () => {
    const body = {
      subject: "5c4a09796b13b42a8e793cf1",
      careers: ["5c4a09796b13b42a8e793cf1"]
    };
    return request(app)
      .post(`/subjects/addToCareers`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const newSubject = await Subjects.findById("5c4a09796b13b42a8e793cf1").lean();
        newSubject.careers.length.should.be.equal(3);
      });
  });

  it('Subscribe student to subject', () => {
    const body = {
      student: "5c4a09796b13b42a8e793cf2",
      subject: "5c4a09796b13b42a8e793cf1"
    }
    return request(app)
      .post(`/subjects/subscribeStudent`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const studentSubject = await StudentSubjects.findOne({student: body.student, subject: body.subject}).lean();
        studentSubject.status.should.be.equal('registered');
      });
  });

  it('Fail to subscribe to subject that is not in students career', () => {
    const body = {
      student: "5c4a09796b13b42a8e793cf2",
      subject: "5c4a09796b13b42a8e793cf4"
    }
    return request(app)
      .post(`/subjects/subscribeStudent`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(500)
      .then(async (response) => {
        response.body.msg.should.be.equal('Error subscribing student: Subject does not belong to students career');
      });
  });

  it('Finished subject should be failed', () => {
    const body = {
      studentSubject: "5c4a09796b13b42a8e793cf9",
      grade: 2
    }
    return request(app)
      .post(`/subjects/closeSubject`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const studentSubject = await StudentSubjects.findById("5c4a09796b13b42a8e793cf9");
        studentSubject.grade.should.be.equal(2);
        studentSubject.status.should.be.equal('failed');

      });
  });

  it('Finished subject should be approved', () => {
    const body = {
      studentSubject: "5c4a09796b13b42a8e793cf9",
      grade: 6
    }
    return request(app)
      .post(`/subjects/closeSubject`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .then(async (response) => {
        const studentSubject = await StudentSubjects.findById("5c4a09796b13b42a8e793cf9");
        studentSubject.grade.should.be.equal(6);
        studentSubject.status.should.be.equal('approved');
      });
  });

  it('Student subject should not be found', () => {
    const body = {
      studentSubject: "5c4a09796b13b42a8e793cf1",
      grade: 6
    }
    return request(app)
      .post(`/subjects/closeSubject`)
      .send(body)
      .set('Accept', 'application/json')
      .expect(500)
      .then((response) => {
        response.body.msg.should.be.equal('Error subscribing student: Student is not subscribed to the subject')
      });
  });

  after(() => {
    return Promise.all([
        Students.deleteMany({}),
        Subjects.deleteMany({}),
        Careers.deleteMany({}),
        StudentSubjects.deleteMany({})
    ]);
  });
});
