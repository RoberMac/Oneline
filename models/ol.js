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
    displayName  : {
        type     : String,
        require  : true,
    },
    provider     : {
        type     : String,
        lowercase: true,
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
    createdAt    : {
        type     : Date,
        expires  : 60
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Replicant: mongoose.model('Replicant', replicantSchema)
}