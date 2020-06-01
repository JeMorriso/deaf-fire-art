const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// add methods defined in passport-local-mongoose to AdminSchema
AdminSchema.plugin(passportLocalMongoose);

// Name of the model is Admin (from filename), and we're using the AdminSchema as its schema
module.exports = mongoose.model('Admin', AdminSchema);
