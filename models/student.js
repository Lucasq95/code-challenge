const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  fullname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  career: {
    type: Schema.Types.ObjectId,
    ref: 'Career'
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'StudentSubject'
  }]
}, {
  timestamps: true,
});


module.exports = mongoose.model('Student', studentSchema);
