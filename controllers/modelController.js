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
exports.model_delete_get = function(req, res, next) {
    //need to check there are no related inventory items
    //prior to deleting
    async.parallel({
        model:function(callback) {
            Model.findById(req.params.id).exec(callback)
        },
        inv_items: function(callback) {
            InventoryItem.find({
                'model':req.params.id
            })
            .populate('model')
            .exec(callback)
        }
    }, function(err, results) {
        if(err) {return next(err); }
        if (results.model == null) {
            res.redirect('/catalog/models')
        }
        //successful, so render the delete page
        res.render('model_delete', {
            title:'Delete Model',
            model:results.model,
            inv_items:results.inv_items
        })
    })
}

//Display model delete on POST
exports.model_delete_post = function(req, res, next) {
    async.parallel({
        model:function(callback) {
            Model.findById(req.body.modelid).exec(callback)
        },
        inv_items:function(callback) {
            InventoryItem.find({
                'model':req.body.modelid,
            })
            .populate('model')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        //Success
        if (results.inv_items.length > 0) {
            //There are still inventory itmes, render in
            // the same way as the GET route. 

            res.render('model_delete', {
                title:'Delete Model',
                model:results.model,
                inv_items:results.inv_items
            })
            return
        } else {
            //Model has no inventory instances.
            Model.findByIdAndRemove(req.body.modelid, function deleteModel(err) {
                if (err) { return next(err); }
                //Success - go back to models list

                res.redirect('/catalog/models')
            })
        }
    })
}

//Display model delete on GET
exports.model_update_get = function(req, res, next) {
    async.parallel({
        model:function(callback) {
            Model.findById(req.params.id)
            .exec(callback)
        },
        brands:function(callback) {
            Brand.find({})
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        if (results.model == null) {
            //No results.
            let err = new Error('Model not found')
            err.status = 404
            return next(err) ; 
        }
        //Else, we are successful
        //render the form.
        res.render('model_form', {
            title:'Update model',
            model:results.model,
            brands:results.brands
        })
    })

}

//Display model delete on POST
exports.model_update_post = [
    //Validate and sanitize fields
    body('name', 'Title must not be empty.').trim().isLength({min:1}).escape(),
    body('brand', 'Brand name must not be empty.').trim().isLength({min:1}).escape(),
    body('retail_price', 'Must enter retail price').trim().isLength({min:1}).escape(),


    (req, res, next) => {
        //Extract the validation errors from the request
        const errors = validationResult(req);

        //Create a model object with the escaped/trimmed data and update with old id.
        let model = new Model({
            name:req.body.name,
            brand:req.body.brand,
            description:req.body.description,
            retail_price:req.body.retail_price,
            thumbnail:req.body.thumbnail,
            _id:req.params.id
        })
        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            //Get all the model and brands for a form
            async.parallel({
                brands:function(callback) {
                    Brand.find({})
                    .exec(callback)
                }
            }, function(err, results) {
                if (err) {return next(err); }
                res.render('model_form', {
                    title:'Update Model',
                    model:model,
                    brands:results.brands,
                    errors:errors.array()
                })
            })  
        } else {
            //Data from the form is valid. Update the record.
            Model.findByIdAndUpdate(req.params.id, model, function(err, themodel) {
                if (err) {return next(err); }
                //Successfull - redirect to the model detail page
                res.redirect(themodel.url)
            })
        }
    }
]