var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = mongoose.model('message', {
    title: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    user: {type: ObjectId, ref: 'user'}
});
