const express = require('express');
const Students = require('../models/student');
const router = express.Router();

const createStudent = (student) => {
  const newStudent = new Students(student);
  return newStudent.save();
}

/* REGISTER STUDENT */
router.post('/', async (req, res) => {
  const newStudent = req.body;
  if(!newStudent.fullname || !newStudent.birthDate || !newStudent.address) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await createStudent(newStudent);
    return res.status(200).json({msg: 'Student created successfully'});
  } catch (err) {
    console.error('Error creating student', err);
    return res.status(500).json({msg: 'Unexpect error creating student'});
  }

});

/* GET ALL STUDENTS */
router.get('/', async (req, res) => {
  try {
    const students = await Students.find().lean();
    return res.status(200).json(students);
  } catch(e) {
    console.error('Error getting students', e);
    return res.status(500).json({msg: 'Unexpected error getting students'});
  }
})

module.exports = router;
