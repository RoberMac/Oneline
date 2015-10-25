var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
    // provider + userId
    id           : {
        type     : String,
        unique   : true,
        require  : true,
        index    : true
    },
    userId       : {
        type     : String,
        require  : true
    },
    name         : {
        type     : String,
        require  : true
    },
    screen_name  : {
        type     : String,
        require  : true
    },
    provider     : {
        type     : String,
        lowercase: true,
        require  : true
    },
    avatar       : {
        type     : String,
        require  : true
    },
    token        : {
        type     : String,
        require  : true
    },
    tokenSecret  : String,
    refreshToken : String
})

var replicantSchema = new Schema({
    id           : {
        type     : String,
        unique   : true,
        require  : true,
        index    : true
    },
    token        : {
        type     : String,
        require  : true
    },
    profile      : {
        type     : String,
        require  : true
    },
    msg          : {
        type     : String,
        require  : false
    },
    createdAt    : {
        type     : Date,
        expires  : 60
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Replicant: mongoose.model('Replicant', replicantSchema)
}