const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'name can\'t be empty'
  },
  email: {
    type: String,
    required: 'Email can\'t be empty',
    unique: true
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [6, 'Password must be atleast 4 character long']
  },
  date: {
    type: Date,
    default: Date.now
  },
  saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id},
    config.get("JWTSECRET"),
  {
      expiresIn: '1h'
  });
}

userSchema.methods.toJSON = function () {
  return {
      id: this._id,
      email: this.email,
      name: this.name,
      date: this.date
  };
}

mongoose.model('User', userSchema);