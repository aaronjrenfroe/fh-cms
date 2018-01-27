// methods for fetching events
const express = require('express');
const router = express.Router();

const parser = require('body-parser');

// local imports
const { authenticate } = require('./../middleware/authenticate');
const { getAllEvents } = require('./../utils/users-events');


router.get('/api/events', (req, res)=> {
  try{
      getAllEvents().then(events => {
          res.send(events)
      }, (err) => {
          res.send(error);
      });
  }catch(error){
      res.send(error);
  }
});

module.exports = router;
