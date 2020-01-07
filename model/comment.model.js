const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: String,
    date: String,
    content: String
}, {colection: 'comments'});

const comments = mongoose.model('comments', commentSchema);
module.exports.getCommentByIDInArray = function(commentArray){
    return comments.find({'_id': { $in: commentArray}});
}
module.exports.getCommentAtPage = function(commentObject, page, commentsPerPage){
    return commentObject.skip(page*commentsPerPage).limit(commentsPerPage);
}
module.exports.getTotalComment = function(commentArray){
    return comments.count({'_id': { $in: commentArray}});
}
module.exports.createComment = async function(name, date, content){
    const newComment = new comments({
		name: name,
		date: date,
		content: content
    });
    return await newComment.save();
}
module.exports.saveComment = async function(product, commentID){
    await product.comments.push(commentID);
    await product.save();
    return product;
}