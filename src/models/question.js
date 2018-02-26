// import node modules
const mongoose = require('mongoose');

// define a schema
const QuestionModelSchema = new mongoose.Schema ({
  author        : String,
  content       : String,
});

// compile model from schema
module.exports = mongoose.model('QuestionModel', QuestionModelSchema);
