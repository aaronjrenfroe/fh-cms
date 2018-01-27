var mongoose = require('mongoose').set('debug', true);

mongoose.Promise = global.Promise;
let url = process.env.MONGODB_URI || 'mongodb://localhost:27017/Posts'
let options = {
    useMongoClient: true
}
let callback = (err) => {
    console.log('Mongo: ' +process.env.MONGODB_URI);
    console.log('Mongoose Error : ' + err);
}
mongoose.connect( url, options,callback);

module.exports = {mongoose};