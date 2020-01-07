const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers = require('../model/publishers.model');
const comments = require('../model/comment.model')
const users = require('../model/user.model')
var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});

// module to render index or /
module.exports.index = async function(req, res, next) {
	const products_per_page = 8;
	let page, sortBy;
	//get page
	if(!req.query.page)
		page = 0;
	else
		page = req.query.page;

	//get order sort
	
	if(req.query.sort == "title" || req.query.sort == null)
		sortBy = {"title" : 1};
	else if(req.query.sort == "asc-price")
		sortBy = {"price" : 1};
	else
		sortBy = {"price" : -1};
	
	//get filter by price
	let minPrice = req.query.minPrice,
		maxPrice = req.query.maxPrice;
	if (minPrice==null){
		minPrice = 0;
		maxPrice = 1000000;
	}
	
	//get filer by publisher
	let publisherID = req.query.publisher;
	if (publisherID == null)
		publisherID = new RegExp("[a-z]","gi");
	
	
	//get filter by category
	let categoriesID = req.query.category;
	if (categoriesID == null)
		categoriesID = new RegExp("[a-z]", "gi");

	//query
	const [category, publisher, totalProduct, product] =
		await Promise.all([categories.getAllCategories(),
		publishers.getAllPublishers(),
		products.getTotalProduct(minPrice, maxPrice, publisherID, categoriesID),
		products.getProductAtPage(
			products.sortProduct(
				products.getProductByAttr(minPrice, maxPrice, publisherID, categoriesID),
				sortBy), page, products_per_page)]);

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
	
	//get filter by price
	let minPrice = req.query.minPrice,
		maxPrice = req.query.maxPrice;
	if (minPrice==null){
		minPrice = 0;
		maxPrice = 1000000;
	}
	

	//get filer by publisher
	let publisherID = req.query.publisher;
	if (publisherID == null)
		publisherID = new RegExp("[a-z]","gi");
	
	//get filter by category
	let categoriesID = req.query.category;
	if (categoriesID == null)
		categoriesID = new RegExp("[a-z]", "gi");

	//query
	
	const [category, publisher, totalProduct, product] =
		await Promise.all([categories.getAllCategories(),
		publishers.getAllPublishers(),
		products.getTotalProduct(minPrice, maxPrice, publisherID, categoriesID, regex),
		products.getProductAtPage(
			products.sortProduct(
				products.getProductByAttr(minPrice, maxPrice, publisherID, categoriesID, regex)
				, sortBy
			), page, products_per_page
		)
		]);

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

module.exports.show_quickly = async function(req, res, next){
	//need add try catch
	const product = await products.getProductByID(req.query.idValue);
	
	res.render('popup-page', {model: product, layout: false});
};

module.exports.product_detail = async function (req, res, next) {
  const commentsPerPage = 3;

  const dataProduct = await products.getProductByID(req.query.id);
  if (!dataProduct.countView){
	  dataProduct.countView = 1;
  }else{
	  dataProduct.countView++;
  }
  const [dataPublisher, dataComment, relatedProduct, totalComment, listCategories] = await Promise.all([
		publishers.getPublisherByName(dataProduct.publisherID),
		comments.getCommentAtPage(
			comments.getCommentByIDInArray(dataProduct.comments),
			0, commentsPerPage
		),
		products.getRelatedProduct(dataProduct),
		comments.getTotalComment(dataProduct.comments),
		categories.getListCategoriesByID(dataProduct.categoriesID),
		dataProduct.save()
  ]);
 
  res.render('product-detail', {
	item: dataProduct, 
	publisher: dataPublisher.publisher, 
	comment: dataComment, 
	totalComment: totalComment, 
	related_product: relatedProduct,
	listCategories: listCategories});
};



//escape DDoS attack
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
