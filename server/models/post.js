const mongoose = require('mongoose');
const _ = require('lodash');

let PostSchema =  new mongoose.Schema({

    Title : {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    User_ID : {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    Excerpt: {
        type: String,
        required: false,
        maxlength: 200,
        trim: true
    },
    Thumnail_URL: {
        type: String,
        required: true,
        minlength: 3

    },
    Post_Type: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    Body: {
        type: String,
        required: true,
        maxlength: 10000,
        minlength: 1,
        trim: false
    },
    Date_Visable: {
        type: Number
    },
    Expire_Date: {
        type: Number
    },
    Timestamp: {
        type: Number
    },
    Events: [{
        type: Number
    }],
    Event_Tags: {
        type: String   
    }
});

PostSchema.statics.findByEventArray = function (eventIdArray) {
    let Post = this;
    return Post.find({Events:{$in:eventIdArray}});
}

PostSchema.statics.findAllWithZeroEvents = function (eventIdArray) {
    let Post = this;
    return Post.find({Events:[]});
}

PostSchema.statics.replacePostUserId = function(oldId, newId){
    let Post = this;
    return Post.update({User_ID:oldId},{User_ID:newId},{multi: true}, (err, raw) => {
        console.log(err, raw);
        
    });
}

PostSchema.virtual('Post_ID').get(function() { return this._id; });

PostSchema.methods.toJSON = function () {
    var post = this;

    var postObject = post.toObject({ virtuals: true });
    // Removing Unwanted Properties
    delete postObject.id;
    delete postObject._id;
    delete postObject.__v;
    return postObject;
};

const Post = mongoose.model('Post', PostSchema);

module.exports = {Post}; 