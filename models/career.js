const mongoose = require('mongoose');
const { Schema } = mongoose;

const careerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('Career', careerSchema);
