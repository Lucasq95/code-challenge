const express = require('express');
const Students = require('../models/student');
const Subjects = require('../models/subject');
const Careers = require('../models/career');
const StudentSubjects = require('../models/student-subject');
const router = express.Router();

const createSubject = (subject) => {
  const newSubject = new Subjects(subject);
  return newSubject.save();
}

/* REGISTER SUBJECT */
router.post('/', async (req, res) => {
  const newSubject = req.body;
  if(!newSubject.name || !newSubject.weeklyHours) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await createSubject(newSubject);
    return res.status(200).json({msg: 'Subject created successfully'});
  } catch (err) {
    console.error('Error creating student', err);
    return res.status(500).json({msg: 'Unexpect error creating Subject'});
  }
});

/* GET SUBJECTS */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subjects.find().lean();
    return res.status(200).json(subjects);
  } catch(e) {
    console.error('Error getting Subjects', e);
    return res.status(500).json({msg: 'Unexpected error getting Subjects'});
  }
});

/* GET SUBJECTS AVAILABLE FOR A CAREER */
router.get('/career/:id', async (req, res) => {
  try {
    const careerId = req.params.id;
    const subjects = await Subjects.find({careers: careerId}).lean();
    return res.status(200).json(subjects);
  } catch(e) {
    console.error('Error getting Subjects', e);
    return res.status(500).json({msg: 'Unexpected error getting Subjects'});
  }
});

const subscribeStudentToSubject = async (studentId, subjectId) => {
  return new Promise(async (resolve, reject) => {
    const studentFound = await Students.findById(studentId).lean();
    const subjectFound = await Subjects.findById(subjectId).lean();

    if(!subjectFound) {
      return reject('Subject not found');
    }

    if(!studentFound) {
      return reject('Student not found');
    }

    if(!studentFound.career) {
      return reject('Student is not subscribed to any career');
    }

    const isSubjectInStudentsCareer = subjectFound.careers.find(career => {
      return career.toString() === studentFound.career.toString();
    });
    if(!isSubjectInStudentsCareer) {
      return reject('Subject does not belong to students career');
    }

    const subjectStudent = await StudentSubjects.findOne({student: studentId, subject: subjectId});

    if(subjectStudent) {
      return reject('Student is already subscribed this subject');
    }

    const newStudentSubject = new StudentSubjects({student: studentId, subject: subjectId});
    return newStudentSubject.save().then(() => resolve());
  });
}

/* SUBSCRIBE STUDENT TO SUBJECT */
router.post('/subscribeStudent', async (req, res) => {
  const data = req.body;
  if(!data.student || !data.subject) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await subscribeStudentToSubject(data.student, data.subject);
    return res.status(200).json({msg: 'Student subscribed to subject successfully'});
  } catch (err) {
    console.error('Error creating student', err);
    return res.status(500).json({msg: 'Error subscribing student: ' + err});
  }
});

const addSubjectToCareers = (subjectId, careers) => {
  return new Promise(async (resolve, reject) => {
    const subjectFound = await Subjects.findById(subjectId).lean();

    if(!subjectFound) {
      return reject('Subject not found');
    }

    return Subjects.update({_id: subjectId}, {$push: {careers: careers}}).then(() => resolve());
  });
}

/* ADD SUBJECT TO CAREER */
router.post('/addToCareers',  async (req, res) => {
  const data = req.body;
  if(!data.careers || !data.subject) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await addSubjectToCareers(data.subject, data.careers);
    return res.status(200).json({msg: 'Subject added to careers successfully'});
  } catch (err) {
    console.error('Error adding subject to career', err);
    return res.status(500).json({msg: 'Error subscribing student: ' + err});
  }
});

const closeSubject = async (studentSubjectId, grade) => {
  return new Promise(async (resolve, reject) => {
    const studentSubjectFound = await StudentSubjects.findById(studentSubjectId);
    if(!studentSubjectFound) {
      return reject('Student is not subscribed to the subject');
    }

    const status = grade > 2 ? 'approved' : 'failed';

    return StudentSubjects.update({_id: studentSubjectFound._id}, {$set: {grade, status}}).then(() => resolve());
  });
}

/* CLOSE SUBJECT */
router.post('/closeSubject',  async (req, res) => {
  const data = req.body;
  if(!data.studentSubject || !data.grade) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await closeSubject(data.studentSubject, data.grade);
    return res.status(200).json({msg: 'Subject closed successfully'});
  } catch (err) {
    console.error('Error closing career', err);
    return res.status(500).json({msg: 'Error subscribing student: ' + err});
  }
});

module.exports = router;
