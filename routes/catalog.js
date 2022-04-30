let express = require('express');
const { router } = require('../app');
router = express.Router();

//Require controller modules
let brand_controller = require('../controllers/brandController');
let inventoryitem_controller = require('../controllers/inventoryitemController')
let model_controller = require('../controllers/modelController');

/// MODEL ROUTES ///

// Get catalog homepage.
router.get('/', model_controller.index);

//This GET and POST request must come before routes that display models
//as they use an id. 

//GET request for creating a model 
router.get('/model/create', model_controller.model_create_get);

//POST request for creating a model.
router.get('/model/create', model_controller.model_create_post);

//GET request to delete a model.
router.get('/model/:id/delete', model_controller.model_delete_get);

//POST request to delete a model.
router.get('/model/:id/delete', model_controller.model_delete_post);

//GET request to update a model.
router.get('/model/:id/update', model_controller.model_update_get);

//POST request to update a model.
router.get('/model/:id/update', model_controller.model_update_post);

//GET request for one model
router.get('/model/:id', model_controller.model_detail)

//GET request for a list of all models
router.get('/models', model_controller.model_list)

//BRAND ROUTES //
//This GET and POST request must come before routes that display brands
//as they use an id. 

//GET request for creating a brand
router.get('/brand/create', brand_controller.brand_create_get);

//POST request for creating a brand
router.get('/brand/create', brand_controller.brand_create_post);

//GET request to delete a brand
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

//POST request to delete a brand
router.get('/brand/:id/delete', brand_controller.brand_delete_post);

//GET request to update a brand
router.get('/brand/:id/update', brand_controller.brand_update_get);

//POST request to update a brand
router.get('/brand/:id/update', brand_controller.brand_update_post);

//GET request for one brand
router.get('/brand/:id', brand_controller.brand_detail)

//GET request for a list of all brand
router.get('/brands', brand_controller.brand_list)


//INVENTORY ROUTES //
//This GET and POST request must come before routes that display brands
//as they use an id. 

//GET request for creating a inventory item
router.get('/inventoryitem/create', inventoryitem_controller.inventoryitem_create_get);

//POST request for creating a inventory item
router.get('/inventoryitem/create', inventoryitem_controller.inventoryitem_create_post);

//GET request to delete a inventory item
router.get('/inventoryitem/:id/delete', inventoryitem_controller.inventoryitem_delete_get);

//POST request to delete a inventory item
router.get('/inventoryitem/:id/delete', inventoryitem_controller.inventoryitem_delete_post);

//GET request to update a inventory item
router.get('/inventoryitem/:id/update', inventoryitem_controller.inventoryitem_update_get);

//POST request to update a inventory item
router.get('/inventoryitem/:id/update', inventoryitem_controller.inventoryitem_update_post);

//GET request for one inventory item
router.get('/inventoryitem/:id', inventoryitem_controller.inventoryitem_detail)

//GET request for a list of all inventory item
router.get('/binventoryitems', inventoryitem_controller.inventoryitem_list)

