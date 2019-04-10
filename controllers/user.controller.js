'use strict'

const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    return res.status(422).json({
      errors: {
        fields: 'Please enter all fields',
      },
    });
  }

  let errs = {};
  
  let  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    errs['email'] = 'Incorrect Email format';
  }

  if (password.length<6) {
    errs['password'] = ['Password must be at least 6 characters'];
  } 

  if (password !== password2) {
    if (typeof(errs['password']) === 'undefined') {
      errs['password'] = ['Password and Password confirmation must matched'];
    } else {
      errs['password'].push('Password and Password confirmation must matched');
    }
  }

  if (Object.keys(errs).length > 0) {
    return res.status(422).json(errs);
  }

  var user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  user.save((err, doc) => {
    console.log('Err: ' + JSON.stringify(err));
    console.log('Saved User: ' + JSON.stringify(doc));
    if (!err) {
      //res.send(doc);
      res.send({
        user : doc.toJSON(),
        'token': user.generateJwt() 
      })
    } else {
      if (err.code == 11000) {
        //res.status(422).send(['Duplicate email adrress found.']);
        res.status(422).send({
          errors: {
            email: 'Duplicate email adrress found.',
          }
        });
      }  else {
        return next(err);
      }
    }
  });
  /*
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      if (err.code == 11000) {
        res.status(422).send(['Duplicate email adrress found.']);
      }  else {
        return next(err);
      }
    }
  });
  */
}

module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {       
    // error from passport middleware
    if (err) {
      return res.status(400).json(err);
    } else if (user) {
      // registered user
      console.log('USER: ' + JSON.stringify(user));
      return res.status(200).json({ 
        'user' : {
          'id': user._id,
          'email': user.email,
          'name': user.name || 'unknown'
        },
        'token': user.generateJwt() 
      });
    } else {
      // unknown user or wrong password
      return res.status(404).json(info)
    };
  })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user) {
        return res.status(404).json({ 
          status: false, message: 'User record not found.' 
        });
      } else {
        //return res.status(200).json({ status: true, user : _.pick(user,['_id','name','email','date']) });
        return res.status(200).json({ 
          status: true, 
          user : user.toJSON()
        });
      }
    }
  );
}