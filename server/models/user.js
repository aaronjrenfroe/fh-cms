
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  privleges: {
    type: String,
    require: true,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
}, /* Options*/ {usePushEach : true});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'name','username', 'privleges']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = user.privleges == 'admin' ? 'admin' : 'auth';
  let obj = {_id: user._id.toHexString(), access, name: user.name, username: user.username}
  console.log(obj);
  
  var token = jwt.sign(obj, process.env.JWT_SECRET).toString();

  user.tokens.push ({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  console.log(token);
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.pre('save', function (next) {
  let user = this;
  if(user.isModified('password')){
    console.log(user.password);
    
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next();
      });
  });
  }else{
    next();
  }
});

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

  }catch (err){
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : decoded.access
  })
}

UserSchema.statics.findByCredentials = function(username, password){
  var User = this;
  console.log('Searching: ' + username);
  return User.findOne({username}).then((user) => {
    if(!user){
      console.log('rejecting:' + username);
      
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      //resolve(user);
      bcrypt.compare(password, user.password, (err, res) => {
        
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
}



var User = mongoose.model('User', UserSchema);

module.exports = {User}
