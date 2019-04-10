'use strict'

const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

const _getMongDOURI = () => {
  let dbPassword = 'mongodb+srv://rtaggo:'+ encodeURIComponent('g@ligeo2019') + '@rtaggocluster-f2nqm.mongodb.net/test?retryWrites=true';
  let dbURI = `mongodb+srv://${config.get('MONGOUSERNAME')}:${encodeURIComponent(config.get('MONGOPWD'))}@${config.get('MONGOCLUSTER')}`
  return dbURI;
}
const _connectToDB = async () => {  
  let mongoDBURI = _getMongDOURI();
  console.log(`Mongo DB URI: ${mongoDBURI}`);
  try {
      await mongoose.connect(mongoDBURI, { useNewUrlParser: true,useCreateIndex: true });
      console.log('Connected to Mongo DB:-)');
  }
  catch (err) {
      console.log('Could not connect to MongoDB');
      console.log(err);
  }
}

module.exports = {
  connectToDB: _connectToDB
};