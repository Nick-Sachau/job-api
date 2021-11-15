const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide a name'],
    maxLength: 50,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please Provide a email'],
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
    unique: [true, 'SAIDASPD']
  },
  password: {
    type: String,
    required: [true, 'Please Provide a password'],
    minLength: 6,
  }
})
  .pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt())
    next()
  })
  
UserSchema.methods.comparePassword = async function (submittedPassword) {
  const isMatch = await bcrypt.compare(submittedPassword, this.password)
  return isMatch
}
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

module.exports = mongoose.model('User', UserSchema)