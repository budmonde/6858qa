// import node modules
const mongoose = require('mongoose');

// define a schema
const ResponseModelSchema = new mongoose.Schema ({
  author        : String,
  parent      	: String,
  content     	: String,
});

// compile model from schema
module.exports = mongoose.model('ResponseModel', ResponseModelSchema);
