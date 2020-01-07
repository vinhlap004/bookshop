const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers = require('../model/publishers.model');
const comments = require('../model/comment.model')
const users = require('../model/user.model')
var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});


module.exports.post_comment = async function(req, res, next){
	//get info
	const content = req.body.content;
	const date = req.body.date;
	const name = req.body.name;

	//create new comment
	const newComment = await comments.createComment(name, date, content);
	const product = await products.getProductByID(req.query.id);
	const commentID = newComment._id;
	await comments.saveComment(product, commentID);
	res.status(200);
	res.send();
}

module.exports.get_comment = async function(req, res, next){
	const commentsPerPage = 3;
	const pageComment = req.query.pageComment,
			productID = req.query.productID;

	const product = await products.getProductByID(productID);
	const listComments = product.comments;
	const comment = await comments.getCommentAtPage(
		comments.getCommentByIDInArray(listComments), 
		pageComment, 
		commentsPerPage
	);
	res.render('comment', {comment: comment, layout: false});
}