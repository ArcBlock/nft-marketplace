const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  did: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  mobile: { type: String, default: '' },
  avatar: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
