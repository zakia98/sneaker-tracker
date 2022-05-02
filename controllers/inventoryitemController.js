let Inventoryitem = require('../models/inventoryitem');
let Model = require('../models/model')
let Brand = require('../models/brand')
let async = require('async');
const { body, validationResult } = require('express-validator');


//display list of all inventoryitems.
exports.inventoryitem_list = function(req, res) {
    Inventoryitem.find({})
    .sort({name:1})
    .populate('model')
    .exec(function (err, list_inventoryitem) {
        if (err) { return next(err); }
        //Successfull, so render the page
        res.render('inventory_list', {title:'Items currrently in stock', list_inventoryitem:list_inventoryitem})
    })
}

//Display detail page for a specific inventoryitem.
exports.inventoryitem_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem detail: ' + req.params.id)
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
exports.inventoryitem_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem DELETE GET')
}

//Display inventoryitem delete on POST
exports.inventoryitem_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem DELETE POST')
}

//Display inventoryitem delete on GET
exports.inventoryitem_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem UPDATE GET')
}

//Display inventoryitem delete on POST
exports.inventoryitem_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem UPDATE POST')
}