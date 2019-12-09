const express = require('express');
const  mongoose = require('mongoose');

const Students = require('../models/student');
const Careers = require('../models/career');
const router = express.Router();

const createCareer = (career) => {
    const newCareer = new Careers(career);
    return newCareer.save();
}

/* REGISTER CAREER */
router.post('/', async (req, res) => {
  const newCareer = req.body;
  if(!newCareer.name || !newCareer.degree) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await createCareer(newCareer);
    return res.status(200).json({msg: 'Career created successfully'});
  } catch (err) {
    console.error('Error creating career', err);
    return res.status(500).json({msg: 'Unexpect error creating career'});
  }
});

/* GET ALL CAREERS */
router.get('/', async (req, res) => {
  try {
    const careers = await Careers.find().lean();
    return res.status(200).json(careers);
  } catch(e) {
    console.error('Error getting careers', e);
    return res.status(500).json({msg: 'Unexpected error getting careers'});
  }
})

const subscribeStudent = async (student, career) => {
  return new Promise(async (resolve, reject) => {
    const careerFound = await Careers.findOne({_id: career});
    const studentFound = await Students.findOne({_id: student});

    if(!careerFound) {
      return reject('Career not found');
    }

    if(!studentFound) {
      return reject('Student not found');
    }

    if(studentFound.career) {
      return reject('Student is already subscribed to another career');
    }

    return Students.updateOne({_id: student}, {$set: { career: careerFound._id }}).then(() => resolve());
  })

}

/* SUBSCRIBE TO CAREER */
router.post('/subscribe', async (req, res) => {
  const body = req.body;
  if(!body.career || !body.student) {
    return res.status(400).json({msg: 'Missing params'});
  }

  try {
    await subscribeStudent(body.student, body.career);
    return res.status(200).json({msg: 'Student subscribed successfully'});
  } catch (e) {
    if(e === 'Career not found' || e === 'Student not found') {
        return res.status(400).json({msg: e});
    }
    console.error('Error creating career', e);
    return res.status(500).json({msg: 'Unexpect error subscribing student'});
  }
});


module.exports = router;
