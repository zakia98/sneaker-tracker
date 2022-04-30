let Inventoryitem = require('../models/inventoryitem');


//display list of all inventoryitems.
exports.inventoryitem_list = function(req, res) {
    res.send('NOT IMPLEMENTED YET: inventoryitem list')
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