const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});

// module to render index or /
module.exports.index = function(req, res, next) {
	const products_per_page = 5;
	var page;
	if(!req.query.page){
		page = 0;
	}else{
		page = req.query.page;
	}
	let check = req.query.sort;
	categories.find()
	.then(function (category) {
		publishers.find()
		.then(function (publisher) {
			var query = products.find().sort('title');
			query.then(function(total){
				const totalProduct = total.length;
				query.skip(page*products_per_page)
				.limit(products_per_page)
				.then(function (product) {
					res.render('index', { categories: category, publish: publisher, items: product, total: totalProduct});
				});   
			})			     
			/*if (check === '1') {
				products.find().sort('price')
				.then(function (product) {
					res.render('index', { categories: category, publish: publisher, items: product});
				});      
			} else if (check === '-1') {
				products.find().sort([['price', -1]])
				.then(function (product) {
					res.render('index', { categories: category, publish: publisher, items: product});
				}); 
			} else {
				products.find().sort('title')
				.then(function (product) {
					res.render('index', { categories: category, publish: publisher, items: product});
				});        
			}*/
		});
	});
};

// module to search by title
module.exports.search_by_title = function (req, res) {
	const temp = req.query.search_title;
	//escape DDOS
	const regex = new RegExp(escapeRegex(req.query.search_title), 'gi');
	categories.find()
	.then(function (category) {
		publishers.find()
		.then(function (publisher) {
			products.find({title: regex}).sort('title')
			.then(function (product) {
				var noMatched, Matched;
				if(product.length < 1)
				{
					noMatched = "Rất tiếc chúng tôi không thể tìm thấy tên sách \"" + temp + "\" bạn đang tìm!!! :( :( :( ";
				}
				else{
					Matched = "Có " + product.length + " cuốn sách được tìm thấy theo tên \"" + temp + "\"";
				}
				res.render('search', { categories: category, publish: publisher, items: product, noMatched: noMatched, Matched: Matched});
			});        
		});
	});
};

// module to search by author
module.exports.search_by_author = function (req, res) {
	const temp = req.query.search_author;
	//escape DDOS
	const regex = new RegExp(escapeRegex(req.query.search_author), 'gi');
	categories.find()
	.then(function (category) {
		publishers.find()
		.then(function (publisher) {
			products.find({author: regex}).sort('author')
			.then(function (product) {
				var noMatched, Matched;
				if(product.length < 1)
				{
					noMatched = "Rất tiếc chúng tôi không thể tìm thấy sách theo tác giả \"" + temp + "\" bạn đang tìm!!! :( :( :( ";
				}
				else{
					Matched = "Các sách tìm thấy được theo tên tác giả \"" + temp + "\"";
				}
				res.render('search', { categories: category, publish: publisher, items: product, noMatched: noMatched, Matched: Matched});
			});        
		});
	});
};

module.exports.show_quickly = function(req, res, next){
  products.findById(req.query.idValue, function(err, doc){
    if(err){
      console.log("Can't find with this body\n");
      //return 404
    }else{
      res.render('popup-page', {model: doc, layout: false});
    }
  })
};

module.exports.product_detail =function (req, res, next) {
  products.findById(req.query.id, function (err, dataProduct) {
    if (err) {
      console.log("Can't show item\n");
      res.sendStatus(500);
    } else {
      publishers.findOne({publisherID: dataProduct.publisherID}, function(err, dataPublisher){
		res.render('product-detail', {item: dataProduct, publisher: dataPublisher.publisher});
      })
    }
  })
};

//escape DDoS attack
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
