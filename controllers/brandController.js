let Brand = require('../models/brand');
let async = require('async')
let Model = require('../models/model');
const { validationResult, body } = require('express-validator');

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
    async.parallel({
        brand:function(callback) {
            Brand.findById(req.params.id)
                .exec(callback);
        },
        models:function(callback) {
            Model.find({
                'brand':req.params.id
            }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) {
            //We have no results
            let err = new Error('Model not found');
            err.status = 404;
            return next(err);
        }

        //Successful, so we render the page.
        res.render('brand_detail', {
            title:results.brand.name, 
            brand:results.brand, 
            models:results.models
        })
    })
}

//Display brand create form on GET
exports.brand_create_get = function(req, res, next) {
    res.render('brand_form', {
        title:'Add a new brand'
    });
}

//Display brand create on POST
exports.brand_create_post = [
    //model size purchase price
    body('name', 'name must not be empty').trim().isLength({min:1}).escape(),    

    //We now process the request after validation and sanitisation.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validationResult(req);
        
        //We now create a new inventory item object with the escaped and trimmed data.
        let brand = new Brand({
            name:req.body.name,
        });
        
        if(!errors.isEmpty()) {
            if (err) {return next(err); }
            //else we need to rerender the form
            res.render('inventoryitem_form', {
                title:'Add to inventory',
                brand:brand,
                errors:errors.array(),
            })
        }
        else {
            //The data from the form is valid. Save the item, 
            //and redirect.
            brand.save(function(err) {
                if (err) {return next(err); }
                //successful - redirect to new model url
                res.redirect(brand.url)
            })
        }
    }
]

//Display brand delete on GET
exports.brand_delete_get = function(req, res) {
    //need to check there are no related models
    //prior to deleting
    async.parallel({
        brand:function(callback) {
            Brand.findById(req.params.id).exec(callback)
        },
        models: function(callback) {
            Model.find({
                'brand':req.params.id
            })
            .populate('brand')
            .exec(callback)
        }
    }, function(err, results) {
        if(err) {return next(err); }
        if (results.brand == null) {
            res.redirect('/catalog/brands')
        }
        //successful, so render the delete page
        res.render('brand_delete', {
            title:'Delete Brand',
            brand:results.brand,
            models:results.models
        })
    })
}

//Display brand delete on POST
exports.brand_delete_post = function(req, res) {
    async.parallel({
        brand:function(callback) {
            Brand.findById(req.params.id).exec(callback)
        },
        models: function(callback) {
            Model.find({
                'brand':req.params.id
            })
            .populate('brand')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        //Success
        if (results.models.length > 0) {
            //There are still inventory itmes, render in
            // the same way as the GET route. 

            res.render('model_delete', {
                title:'Delete Model',
                brand:results.brand,
                models:results.models
            })
            return
        } else {
            //Model has no inventory instances.
            Brand.findByIdAndRemove(req.body.brandid, function deleteBrand(err) {
                if (err) { return next(err); }
                //Success - go back to models list

                res.redirect('/catalog/brands')
            })
        }
    })
}

//Display brand update on GET
exports.brand_update_get = function(req, res) {
    async.parallel({
        brand:function(callback) {
            Brand.findById(req.params.id)
            .exec(callback)
        },

    }, function(err, results) {
        if (err) {return next(err); }
        if (results.brand == null) {
            //No results.
            let err = new Error('Model not found')
            err.status = 404
            return next(err) ; 
        }
        //Else, we are successful
        //render the form.
        res.render('brand_form', {
            title:'Update model',
            brand:results.brand,
        })
    })

}

//Display brand update on POST
exports.brand_update_post = [

    body('name', 'name must not be empty').trim().isLength({min:1}).escape(),    

    (req, res, next) => {
        //Extract the validation errors from the request
        const errors = validationResult(req);

        //Create a model object with the escaped/trimmed data and update with old id.
        let brand = new Brand({
            name:req.body.name,
            _id:req.params.id
        })
        console.log(brand)
        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            //Get all the model and brands for a form
                res.render('inventoryitem_form', {
                    title:'Update Brand',
                    brand:brand,
                    errors:errors.array()
                })
        } else {
            console.log('success')
            //Data from the form is valid. Update the record.
            Brand.findByIdAndUpdate(req.params.id, brand, function(err, thebrand) {
                if (err) {return next(err); }
                //Successfull - redirect to the model detail page
                res.redirect(thebrand.url)
            })
        }
    }
]