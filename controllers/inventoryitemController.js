let Inventoryitem = require('../models/inventoryitem');
let Model = require('../models/model')
let Brand = require('../models/brand')
let async = require('async');
const { body, validationResult } = require('express-validator');


//display list of all inventoryitems.
exports.inventoryitem_list = function(req, res, next) {
    Inventoryitem.find({})
    .sort({name:1})
    .populate({
        path:'model',
        populate:{
            path:'brand',
            model:'Brand'
        }
    })
    .exec(function (err, list_inventoryitem) {
        if (err) { return next(err); }
        //Successfull, so render the page
        res.render('inventory_list', {title:'Items currrently in stock', list_inventoryitem:list_inventoryitem})
    })
}

//Display detail page for a specific inventoryitem.
exports.inventoryitem_detail = function(req, res) {
    async.parallel({
        inv_item:function(callback) {
            Inventoryitem.findById(req.params.id)
                .populate('model')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.inv_item==null) {
            //We have no results
            let err = new Error('Model not found');
            err.status = 404;
            return next(err);
        }

        //Successful, so we render the page.
        res.render('inventoryitem_detail', {
            title:results.inv_item.model.name, 
            inv_item:results.inv_item, 
        })
    })
}

//Display inventoryitem create form on GET
exports.inventoryitem_create_get = function(req, res, next) {
    //Get all brands and models for use in selectors for the forms.
    async.parallel({
        brands: function(callback) {
            Brand.find(callback);
        },
        models: function(callback) {
            Model.find(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        //else, we are successful and can render the form. 
        res.render('inventoryitem_form', {
            title:'Add to inventory',
            brands:results.brands,
            models:results.models,
        })
    })
}

//Display inventoryitem create on POST
exports.inventoryitem_create_post = [
    //model size purchase price
    body('model', 'Model must not be empty').trim().isLength({min:1}).escape(),
    body('size', 'Size must not be empty').trim().isLength({min:1}).escape(),
    body('purchase_price').trim().isLength({min:1}).escape(),


    //We now process the request after validation and sanitisation.
    (req, res, next) => {

        //Extract the validation errors from a request.
        const errors = validationResult(req);
        
        //We now create a new inventory item object with the escaped and trimmed data.
        let inventoryitem = new Inventoryitem({
            model:req.body.model,
            size:req.body.size,
            purchase_price:req.body.purchase_price
        });
        
        if(!errors.isEmpty()) {
            //There are errors, and we need to re-render the form with the
            //current vales.
            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                models: function(callback) {
                    Model.find(callback)
                }
            }, function(err, results) {
                if (err) {return next(err); }
                //else, we are successful and can render the form. 
                res.render('inventoryitem_form', {
                    title:'Add to inventory',
                    models:results.models,
                    size:size,
                    purchase_price:purchase_price,
                    inventoryitem:inventoryitem,
                    errors:errors.array(),
                })
            })
        }
        else {
            //The data from the form is valid. Save the item, 
            //and redirect.
            inventoryitem.save(function(err) {
                if (err) {return next(err); }
                //successful - redirect to new model url
                res.redirect(inventoryitem.url)
            })
        }
    }
]

//Display inventoryitem delete on GET
exports.inventoryitem_delete_get = function(req, res, next) {
    //Need to get the inventory item
    async.parallel({
        inv_item:function(callback) {
            Inventoryitem.findById(req.params.id)
            .populate('model')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        if (results.inv_item == null) {
            //No models found
            res.redirect('/catalog/inventoryitems')
        }
        //successful, so render the delete page
        res.render('inventoryitem_delete.pug', {
            title:'Remove from inventory',
            inv_item:inv_item,
        })

    })
}

//Display inventoryitem delete on POST
exports.inventoryitem_delete_post = function(req, res, next) {
    async.parallel({
        inv_item:function(callback) {
            Inventoryitem.findById(req.params.id)
            .populate('model')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        //successful, so delete the item
        Inventoryitem.findByIdAndRemove(req.body.inv_itemid, function deleteInvItem(err) {
            if (err) {return next(err); }
            //success, go back to inventory list. 
        })
    })
}

//Display inventoryitem delete on GET
exports.inventoryitem_update_get = function(req, res) {
    async.parallel({
        inv_item:function(callback) {
            Inventoryitem.findById(req.params.id)
            .exec(callback)
        },
        models:function(callback) {
            Model.find({})
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err); }
        if (results.inv_item == null) {
            //No results.
            let err = new Error('Model not found')
            err.status = 404
            return next(err) ; 
        }
        //Else, we are successful
        //render the form.
        res.render('inventoryitem_form', {
            title:'Update stock item',
            inv_item:results.inv_item,
            models:results.models
        })
    })

}

//Display inventoryitem delete on POST
exports.inventoryitem_update_post = [

    body('model', 'Model must not be empty').trim().isLength({min:1}).escape(),
    body('size', 'Size must not be empty').trim().isLength({min:1}).escape(),
    body('purchase_price').trim().isLength({min:1}).escape(),


    (req, res, next) => {
        //Extract the validation errors from the request
        const errors = validationResult(req);
        //Create a model object with the escaped/trimmed data and update with old id.
        let inv_item = new Inventoryitem({
            model:req.body.model,
            size:req.body.size,
            purchase_price:req.body.purchase_price,
            _id:req.params.id
        })
        if (!errors.isEmpty()) {
            //There are errors. Render the form again with sanitized values/error messages.
            //Get all the model and brands for a form
            async.parallel({
                models:function(callback) {
                    Model.find({})
                    .exec(callback)
                }
            }, function(err, results) {
                if (err) {return next(err); }
                res.render('inventoryitem_form', {
                    title:'Update Stock item',
                    inv_item:inv_item,
                    models:results.models,
                    errors:errors.array()
                })
            })  
        } else {
            //Data from the form is valid. Update the record.
            Inventoryitem.findByIdAndUpdate(req.params.id, inv_item, function(err, theitem) {
                if (err) {return next(err); }
                //Successfull - redirect to the model detail page
                res.redirect(theitem.url)
            })
        }
    }
]