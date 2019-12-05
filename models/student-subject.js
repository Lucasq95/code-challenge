const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  status: {
    type: String,
    enum: ['registered', 'studying', 'approved', 'failed'],
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

studentSchema.methods.toJSON = () => {
  return this.toObject();
};

module.exports = mongoose.model('Student', studentSchema);
