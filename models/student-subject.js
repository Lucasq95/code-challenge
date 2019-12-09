const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  status: {
    type: String,
    enum: ['registered', 'approved', 'failed'],
    default: 'registered',
  },
  grade: {
    type: Number,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'StudentSubject'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudentSubject', studentSchema);
