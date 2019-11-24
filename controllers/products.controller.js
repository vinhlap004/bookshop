const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');

// module to render index or /
module.exports.index = function (req, res, next) {
	categories.find()
	.then(function (category) {
		publishers.find()
		.then(function (publisher) {
			products.find().sort('title')
			.then(function (product) {
				res.render('index', { categories: category, publish: publisher, items: product});
			});        
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
					Matched = "Các sách được tìm thấy theo tên \"" + temp + "\"";
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
      return res.sendStatus(500);
    } else if(dataProduct.length>0) {
      publishers.findOne({publisherID: dataProduct.publisherID}, function(err, dataPublisher){
        res.render('product-detail', {item: dataProduct, publisher: dataPublisher.publisher});
      })
    }else{
		return res.sendStatus(404);
	}
  })
};

//escape DDoS attack
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
