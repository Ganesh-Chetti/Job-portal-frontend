// Job.js (Model)

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    qualification:[{
        type: String 
    }],
    salary: {
        type: Number,
        required: true
    },
    experienceLevel:{
        type:Number,
        required:true,
    },
    location: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    employementType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    applications: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Application',
      }
  ]
},{timestamps:true});
const Job = mongoose.model("Job", jobSchema);
module.exports = Job;









