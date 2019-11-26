const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});

// module to render index or /
module.exports.index = async function(req, res, next) {
	const products_per_page = 8;
	let page;
	//get page
	if(!req.query.page)
		page = 0;
	else
		page = req.query.page;

	//get order sort
	let sortBy; 
	if(req.query.sort == "title" || req.query.sort == null)
		sortBy = {"title" : 1};
	else if(req.query.sort == "asc-price")
		sortBy = {"price" : 1};
	else
		sortBy = {"price" : -1};
	
	//query
	
	const [category, publisher, totalProduct, product] =
		await Promise.all([categories.find(),
		publishers.find(),
		products.find().sort(sortBy).count(),
		products.find().sort(sortBy).skip(page * products_per_page).limit(products_per_page)]);

	res.render('index', {
		categories: category,
		publish: publisher,
		items: product,
		total: totalProduct
	});
	     
};

// module to search by title
module.exports.search = async function (req, res) {
	const temp = req.query.keyword;
	//escape DDOS
	const regex = new RegExp(escapeRegex(temp), 'gi');
	let total = 0;
	
	const products_per_page = 8;
	let page;
	//get page
	if(!req.query.page)
		page = 0;
	else
		page = req.query.page;

	//get order sort
	let sortBy; 
	if(req.query.sort == "title" || req.query.sort == null)
		sortBy = {"title" : 1};
	else if(req.query.sort == "asc-price")
		sortBy = {"price" : 1};
	else
		sortBy = {"price" : -1};
	
	//query
	
	const [category, publisher, totalProduct, product] =
		await Promise.all([categories.find(),
		publishers.find(),
		products.find({ $or: [{title: regex}, {author: regex}]}).sort(sortBy).count(),
		products.find({ $or: [{title: regex}, {author: regex}]}).sort(sortBy)
				.skip(page * products_per_page)
				.limit(products_per_page)]);
	
	let noMatched, Matched;			
	if (product.length < 1) {
		noMatched = "Không tìm thấy sách nào. Hãy thử với từ khóa khác!";
	}
	else {
		Matched = totalProduct + " kết quả cho từ khóa: <b>" + temp + "</b>";
	}
	res.render('search', {
		categories: category,
		publish: publisher,
		items: product,
		noMatched: noMatched,
		Matched: Matched,
		total: totalProduct
	});

}


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
