let Model = require('../models/model');


exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page')
}

//display list of all models.
exports.model_list = function(req, res) {
    res.send('NOT IMPLEMENTED YET: model list')
}

//Display detail page for a specific model.
exports.model_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Model detail: ' + req.params.id)
}

//Display model create form on GET
exports.model_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL CREATE GET')
}

//Display model create on POST
exports.model_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: MODEL CREATE POST')
}

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