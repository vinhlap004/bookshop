const products =require('../model/user.model');

var handlebars = require('hbs');
handlebars.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});

// module to render register or /
module.exports.index = async function(req, res, next) {


  
}
