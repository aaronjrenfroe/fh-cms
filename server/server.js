

// Aaron Renfroe 2017
require('./config/config');
// External Libraries
const cors = require('cors');
const express = require('express');
const parser = require('body-parser');

// Local imports

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Post} = require('./models/post');

const { authenticate } = require('./middleware/authenticate');


// Globals 
const port = process.env.PORT || 3000;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const app = express();

// Config
app.use(parser.json()); 
app.use(cors({origin: '*', exposedHeaders: 'x-auth'}));
app.use(express.static(__dirname + './../dist'));

//cors
app.options('*', cors())

// front end
app.all('/', (req, res) => {
  res.status(200).sendFile(__dirname + './../dist/index.html');
});

// api routes
app.use(require('./router/route-posts'));
app.use(require('./router/route-users'));
app.use(require('./router/route-events'));
app.use(require('./router/route-upload'));
app.use(require('./router/router-info'));


app.get('/api/info', (req, res)=>{
    // send static html file with table listing endpoints, what they do, how to use them. 
    res.send(`<p> send static html file with table listing endpoints, what they do, how to use them </p>`);
});


app.listen(port, () => {
    console.log('MongoPort: ' + process.env.MONGO_URI);
    console.log(`Serving on port:   ${port}`);
    
});

module.exports = {app};