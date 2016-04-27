const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    id: { // provider + uid
        type   : String,
        unique : true,
        require: true,
        index  : true,
    },
    provider: {
        type     : String,
        lowercase: true,
        require  : true,
    },
    screen_name: {
        type   : String,
        require: true,
    },
    token: {
        type   : String,
        require: true,
    },
    tokenSecret : String,
    refreshToken: String,
});
const replicantSchema = new Schema({
    id: {
        type   : String,
        unique : true,
        require: true,
        index  : true,
    },
    token: {
        type   : String,
        require: true,
    },
    profile: {
        type   : String,
        require: true,
    },
    msg: {
        type   : String,
        require: false,
    },
    createdAt: {
        type   : Date,
        expires: 60,
    },
});
const shareSchema = new Schema({
    id: {
        type   : String,
        unique : true,
        require: true,
        index  : true,
    },
    sharers: {
        type   : [Schema.Types.Mixed],
        require: true,
    },
    viewCount: {
        type   : Number,
        require: true,
    },
    data: {
        type   : Schema.Types.Mixed,
        require: true,
    },
});

module.exports = {
    User     : mongoose.model('User', userSchema),
    Replicant: mongoose.model('Replicant', replicantSchema),
    Share    : mongoose.model('Share', shareSchema),
};
