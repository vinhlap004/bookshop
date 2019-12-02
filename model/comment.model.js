const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    email: String,
    date: String,
    content: String
}, {colection: 'comments'});

module.exports = mongoose.model('comment', commentSchema);