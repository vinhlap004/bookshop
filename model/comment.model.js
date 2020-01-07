const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    productID: String,
    name: String,
    date: String,
    content: String
}, {colection: 'comments'});

const commentModel = mongoose.model('comments', commentSchema);
module.exports.getCommentByProductID = function(productID){
    return commentModel.find({productID: productID});
}
module.exports.getCommentAtPage = function(commentObject, page, commentsPerPage){
    return commentObject.skip(page*commentsPerPage).limit(commentsPerPage);
}
module.exports.getTotalComment = function(productID){
    return commentModel.count({productID: productID});
}
module.exports.createComment = function(productID, name, date, content){
    const newComment = new commentModel({
        productID: productID,
		name: name,
		date: date,
		content: content
    });
    return newComment.save();
}
