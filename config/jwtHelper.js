'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.verifyJwtToken = (req, res, next) => {
  var token;
  
  //console.log('HEADERS: ' + JSON.stringify(req.headers));
  const { headers: { authorization } } = req;
  //console.log('authorization: ' + JSON.stringify(authorization));
  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    token = authorization.split(' ')[1];
  }
  /*
  if ('authorization' in req.headers) {
    token = req.headers['authorization'].split(' ')[1];
  }
  */
  if (!token) {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  } else {
    jwt.verify(token,  config.get("JWTSECRET"),
      (err, decoded) => {
        if (err) {
          return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
        } else {
          req._id = decoded._id;
          next();
        }
      }
    )
  }
}