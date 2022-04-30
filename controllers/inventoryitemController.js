let Inventoryitem = require('../models/inventoryitem');


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
exports.inventoryitem_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem CREATE GET')
}

//Display inventoryitem create on POST
exports.inventoryitem_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: inventoryitem CREATE POST')
}

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