const products =require('../model/product.model');
const categories =require('../model/category.model');
const publishers = require('../model/publisher.model');
const commentModel = require('../model/comment.model')
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
	const productID= req.body.productID;
	//create new comment
	await commentModel.createComment(productID, name, date, content);
	res.status(200);
	res.send();
}

module.exports.get_comment = async function(req, res, next){
	const commentsPerPage = 3;
	const pageComment = req.query.pageComment,
			productID = req.query.productID;
	const comment = await commentModel.getCommentAtPage(
		commentModel.getCommentByProductID(productID), 
		pageComment, 
		commentsPerPage
	);
	res.render('comment', {comment: comment, layout: false});
}