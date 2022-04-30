let Model = require('../models/model');
let Brand = require('../models/brand')
let InventoryItem = require('../models/inventoryitem')
let async = require('async')
const {body, validationResult } = require('express-validator')

exports.index = function(req, res) {
    async.parallel({
        model_count:function(callback) {
            Model.countDocuments({}, callback)
        },
        brand_count:function(callback) {
            Brand.countDocuments({}, callback)
        },
        inventoryitems_count:function(callback) {
            InventoryItem.countDocuments({}, callback)
        }
    }, function(err, results) {
        res.render('index', {title:'Sneaker Tracker Home', error:err, data:results})
    })
}

//display list of all models.
exports.model_list = function(req, res, next) {
    Model.find({})
        .sort({name:1})
        .populate('brand')
        .exec(function (err, list_models) {
            if (err) { return next(err); }
            //Successfull, so render the page
            res.render('model_list', {title:'Model List', list_models:list_models})
        })
}

//Display detail page for a specific model.
exports.model_detail = function(req, res, next) {
    async.parallel({
        model:function(callback) {
            Model.findById(req.params.id)
                .populate('brand')
                .exec(callback);
        },
        inventoryitems:function(callback) {
            InventoryItem.find({
                'model':req.params.id
            }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.model==null) {
            //We have no results
            let err = new Error('Model not found');
            err.status = 404;
            return next(err);
        }

        //Successful, so we render the page.
        res.render('model_detail', {
            title:results.model.name, 
            model:results.model, 
            inventoryitems:results.inventoryitems
        })
    })
}

//Display model create form on GET
exports.model_create_get = function(req, res, next) {
    //Get all brand which can be used to add to the shoe model. 
    async.parallel({
        brands:function(callback) {
            Brand.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err) ;}
        //else, we are successful and can render the form.
        res.render('model_form', {title:'Add a model', brands:results.brands})
    })
}

//Display model create on POST
exports.model_create_post = [
    //title, brand, description, retail-price

    body('name', 'Title must not be empty.').trim().isLength({min:1}).escape(),
    body('brand', 'Brand name must not be empty.').trim().isLength({min:1}).escape(),
    body('retail_price', 'Must enter retail price').trim().isLength({min:1}).escape(),

    //We now proccess the request after validation and sanitisation.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validationResult(req);

        //We now create a new model object with the escaped and trimmed data.
        let model = new Model({
            name:req.body.name,
            brand:req.body.brand,
            description:req.body.description,
            retail_price:req.body.retail_price,
            thumbnail:req.body.thumbnail
        });
        if (!errors.isEmpty()) {
            //There are errors. The form will be re-renderd with the current values. 
            //Get all the Brands again:
            async.parallel({
                brands: function(callback) {
                    Brand.find(callback)
                }
            }, function(err, results) {
                if (err) { return next(err); }

                //Successful, so we render out form once again with the current information
                res.render('model_form', 
                {
                    title:'Add a model', 
                    brands:results.brands, 
                    model:model, 
                    errors:errors.array()
                })
            })
        }
        else {
            //The data from the form is valid. Save the model,
            //And redirect.

            model.save(function(err) {
                if (err) {return next(err); }
                //successful - redirect to new model url.
                res.redirect(model.url)
            })
        }
    }
]

//Display model delete on GET
exports.model_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL DELETE GET')
}

//Display model delete on POST
exports.model_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL DELETE POST')
}

//Display model delete on GET
exports.model_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL UPDATE GET')
}

//Display model delete on POST
exports.model_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL UPDATE POST')
}