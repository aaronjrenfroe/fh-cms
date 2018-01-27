// Global imports
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const parser = require('body-parser');
const { ObjectID } = require('mongodb');
const moment = require('moment');

// local import
const { authenticate } = require('./../middleware/authenticate');
const { getEvents } = require('./../utils/users-events');
const { Post } = require('./../models/post');


// get post for user 
// would be called by mobile app
// accessed by mobile app
router.post('/api/posts/for', async (req, res) => {

  var id = req.body['1'];
  var apiToken = req.body['2'];
  var codeWord = req.body['Jesus'];
  console.log(req.body);
  
  try {
    // events from CT
    let events = await getEvents(id, apiToken);
    // remove duplicate events caused my multiple family memebers attending same event

    // map to get arrau of just event id's
    let eventIds = events.map(event => {return event.EventID});
    
    let posts = await Post.findByEventArray(eventIds);
    
    let postbundle = []
    posts.forEach((post) => {
      // loop of each event the post is bound to
      // alternativly looping through each event the user is attending might make more sense logicly but its the same result.
      //I don't really know why I did it this way. 
      post.Events.forEach((evID) => {
        let postClone = post.toObject({ virtuals: true });
        // Removing Unwanted Properties
        delete postClone.id;
        delete postClone._id;
        delete postClone.__v;
        delete postClone.Events;
        // get event for this post
        let event = events.filter((item) => {return item.EventID == evID})[0];
        if(event){ // If no event it means user is not attending this event event
          postClone.Event_ID = event.EventID;
          postClone.Event_Name = event.EventsName;
          postClone.Location = event.LocationsName;
          postClone.Location_ID = event.LocationID;
          
          // Visible Date
          if(postClone.Date_Visable){
            let eventStartMoment = moment(event.BeginDateTime,'YYYY-M-DTHH:mm:ss');
            
            // add offset value to Date_Visable
            eventStartMoment.add(postClone.Date_Visable, 'days');
            postClone.Visable_Date = eventStartMoment.format('YYYY-M-DT00:06:00');
          }else{
            postClone.Date_Visable = '0';
            postClone.Visable_Date = moment(postClone.Timestamp).format('YYYY-M-DT00:06:00');
          }
          postbundle.push(postClone);
        } // end if-event
      }); // end post-event forloop
    }); // end posts forloop

    let unBoundPosts = await Post.findAllWithZeroEvents();
    unBoundPosts.forEach(post => {
      let postClone = post.toObject({ virtuals: true });
      // Removing Unwanted Properties
      delete postClone.id;
      delete postClone._id;
      delete postClone.__v;
        // Visible Date
      if(postClone.Date_Visable){
        postClone.Visable_Date = moment(post.Expire_Date).format('YYYY-M-DT00:06:00');
      }else{
        postClone.Date_Visable="0";
        postClone.Visable_Date = moment(post.Timestamp).format('YYYY-M-DTHH:m:s');
      }
      postClone.Event_ID = null;
      postClone.Location = null;
      postClone.Location_ID = null;
      delete postClone.Events;
      postbundle.push(postClone);
    });

    postbundle.forEach(post => {
      if(post.Location_ID){
        post.Location_ID = post.Location_ID + "";
      }
      post.Date_Visable = post.Date_Visable + "";
      post.Event_ID = post.Event_ID;
      post.Timestamp = moment(post.Timestamp).format('YYYY-M-D 00:06:00');
      // Expire date
      if(post.Expire_Date){
        post.Expire_Date = moment(postClone.Expire_Date).format('YYYY-M-D');
      }else{
        post.Expire_Date = '0000-00-00'
      }
    });

    let retMsg = {
      StatusCode: 1,
      StatusMessage: 'Success',
      Posts: postbundle
    }
    res.send(retMsg);
  } catch (err) {
    res.status(400).send();
  }
});

// All Other Endpoints will be called by post creation website and should be Authenticated
// get all post
// Needs Authentication
//router.get('/api/posts',authenticate,(req, res) => {
router.get('/api/posts',authenticate, (req, res) => {
  try {
      Post.find((error, posts) => {
      if (error) {
        return res.send([]);
      }
      return res.send(posts);
    });
  } catch (err) {
    res.status(400).send();
  }
});
router.get('/api/posts/:id', (req, res) => {
  let id = req.params['id'];
  try {
      Post.findById(id, (error, post) => {
        if (error) {
          return res.send(null);
        }     
        return res.send(post);
    });
  } catch (err) {
    res.status(400).send();
  }
});

// create Post
// Needs Authentication
router.post('/api/posts/create',authenticate, async (req, res) => {
  try {
    let body = req.body;
    console.log(body.image);
    
    body.Timestamp = moment().valueOf();
    if(body.Expire_Date){
      body.Expire_Date = moment(body.Expire_Date, "YYYY-M-D").valueOf();
    }else{
      body.Expire_Date = null;
    }

    body.Timestamp = moment().valueOf();
    console.log(body);
    let post = new Post(body);
    await post.save();
    res.send(post);
  } catch (e) {
    console.log(e);
    
    res.status(400).send(e);
  }
});


// delete Post
// Needs Authentication
router.delete('/api/posts/:id', authenticate, async (req, res) => {
  
  let id = req.params['id'];
  console.log(id);
  try{
    await Post.findOneAndRemove({_id:id})
    //find post in mongo
    // if exists remove and return post
    // else return error
    res.send();
  }catch(error){
    console.log(error);

    res.status(400).send(error);
  }
});

// update post
// Needs Authentication
router.post('/api/posts/update/:id', authenticate,(req, res) => {
  
  let id = req.params['id'];
  let body = req.body;
  let np = body.newPost;
  let op = body.oldPost;
  let update = {};
  
  if (np.title != op.Title){
    update.Title = np.title;
  }
  if (np.subject != op.Excerpt){
    update.Excerpt = np.subject;
  }
  if (np.bodyType != op.Post_Type){
    update.Post_Type = np.bodyType;
  }
  if (np.body != op.Body){
    update.body = np.Body;
  }
  if(np.offset != op.Date_Visable){
    update.Date_Visable = np.offset
  }
  if(np.expireDate != op.Expire_Date){
    update.Expire_Date = np.expireDate; 
  }
  if(np.events != op.Events){
    update.Events = np.events; 
  }
  if(np.image != op.Thumnail_URL){
    update.Thumnail_URL = np.image ; 
  }
  //Event_Tags
  if(np.tags != op.Event_Tags){
    update.Event_Tags = np.tags ; 
  }
  
  Post.findOneAndUpdate({_id: op.Post_ID}, update, (err, doc, mongo_res)=> {
    if(err){
      return res.status(400).send();
    }else{
      return res.send(doc);
    }
  })
  
  
});

module.exports = router;