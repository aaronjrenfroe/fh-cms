const express = require('express');
const router = express.Router();
const {authenticate} = require('./../middleware/authenticate');
const _ = require('lodash');
const {User} = require('./../models/user');
const {Post} = require('./../models/post');

const {ObjectID} = require('mongodb');
const moment = require('moment');


// User
// POST /users/create
router.post('/api/user', async (req, res) => {
  console.log(req);  
  let body = _.pick(req.body, ['name', 'password', 'privleges','username']);
  console.log(body);
  
  if(!body.privleges){
      body.privleges = 'user';
  }
  let user = new User(body);
  try{
      await user.save();
      let token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
  }catch(e){
      res.status(400).send(e);
  }
});

// GET 
router.get('/api/user', authenticate , async (req, res) => {
  
    const users = await User.find();
    res.send(users);
});

router.post('/api/user/login', async (req, res) => {
  try{
    console.log('Searching: ' + JSON.stringify(req.body));
      let body = _.pick(req.body, ['name', 'password']);
      let user = await User.findByCredentials(body.name, body.password);
      let token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
  }catch(err){
     res.status(404).send(err);
  }
});

// Update User's name, username, privleges or password
router.post('/api/user/:id', authenticate,  (req, res) => {
  let id = req.params['id'];
  let requester = req.user;

  if (requester.privleges == 'admin' || requester._id ==  id){
    let body = _.pick(req.body, ['name', 'password', 'privleges','username']);

    try{
        User.findById(id, (err, user) => {
        if(err){
          return res.status(400).send(err);
        }
        if(body.password){
          user.set({tokens:[]});
        }
        user.set(body);
        user.save((err2, updatedUser) => {
          if(err2){
            console.log(err2);
            return res.status(400).send(err2);
          }
          
          res.status(200).send(updatedUser);
        })
      });
      
    }catch(err){
      console.log(err);

      res.status(400).send(err);
    }
  }
  else{
    console.log('Permission Denied');
    
    res.status(401).send();
  }
});

router.delete('/api/user/logout', authenticate, async (req, res) => {

  try{
      await req.user.removeToken(req.token);
      res.status(200).send();
  }catch(err){
      res.status(400).send();
  } 
});

// What to do with posts the user has created if we delete them
router.delete('/api/user/:id', authenticate, async (req, res) => {
  // Check if authed user has admin privaleges

  if(req.user.privleges != 'admin'){
    return res.status(401).send('User must be admin');
  }
  // Check if authed user is attempting to delete self
  let id = req.params['id'];

  
  if(req.user._id == id){
    return res.status(401).send('Cannot Delete Yourself');
  }
  // try and delete user
  try{
    let user = await User.findOne({'_id': id});
    if(user){
      Post.replacePostUserId(id,req.user._id).then((posts) => {
        console.log(posts);
      });
      await user.remove();
      res.status(200).send(user);
    }else{
      res.status(400).send('No user with that Id');
    }
  }catch(err){
    res.status(400).send(err);
  }

});

router.get('/api/user/me', authenticate, (req, res) => { res.send(req.user); });

module.exports = router;