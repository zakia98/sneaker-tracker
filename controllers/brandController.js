let Brand = require('../models/brand');


//display list of all brands.
exports.brand_list = function(req, res, next) {
    Brand.find({})
    .sort({name:1})
    .exec(function(err, list_brand) {
        if (err) { return next(err)}
        //Success, so render the page
        res.render('brand_list', {title:'List of Brands', list_brand:list_brand})
    })
}

//Display detail page for a specific brand.
exports.brand_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: brand detail: ' + req.params.id)
}

//Display brand create form on GET
exports.brand_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand CREATE GET')
}

//Display brand create on POST
exports.brand_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand CREATE POST')
}

//Display brand delete on GET
exports.brand_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand DELETE GET')
}

//Display brand delete on POST
exports.brand_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand DELETE POST')
}

//Display brand delete on GET
exports.brand_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand UPDATE GET')
}

//Display brand delete on POST
exports.brand_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand UPDATE POST')
}