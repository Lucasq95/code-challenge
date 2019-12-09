const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  weeklyHours: {
    type: Number,
    required: true
  },
  careers: [{
    type: Schema.Types.ObjectId,
    ref: 'Career'
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', subjectSchema);
