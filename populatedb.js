// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
}

let async = require('async');
let Model = require('./models/model');
let Brand = require('./models/brand');
let InventoryItem = require('./models/inventoryitem');
let SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

let mongoose = require('mongoose')
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



function CreateBrand(name, callback) {
    let brand = new Brand({
        name:name
    });
    brand.save(function(err) {
        if (err) {
            callback(err, null)
            return
        }
        console.log('New Brand: ' + brand)
        callback(null, brand)
    })
    return brand
};

function CreateModel(name, brand, description, retail_price, thumbnail, callback) {
    async.series({
        brand:function(callback) {
            Brand.find({name:brand}).exec(callback)
        }
    }, function(err, results) {
        if (err) {console.log(error)}
        console.log(brand)
        console.log(results.brand)
        let brandData = results.brand[0]
        
        
        console.log(`branddata : ${brandData}`)
        let model = new Model({
            name:name, 
            brand:brandData,
            description:description, 
            retail_price:retail_price,
            thumbnail:thumbnail
        })
        model.save(function(err) {
            if (err) {
                callback(err, null)
                return
            }
        })
        console.log('New Model: ' + model)
        callback(null, brand)
    })
}

//CreateBrand('Nike', function(err) {
//    if (err) {console.log(err)}
//})


function createBrands() {
    sneaks.getMostPopular(100, function(err, products) {
        const brands = []
    
        for (product of products) {
            if (!brands.includes(product._doc.brand)) {
                brands.push(product._doc.brand)
            }
        }
    
        brands.forEach(brand => {
            CreateBrand(brand, function(error) {
                console.log(error)
            })
        })
    })    
}



sneaks.getMostPopular(100, function(err, products) {
    if (err) {console.log(err)}

    for (let i=0; i < products.length; i++) {
        CreateModel(
            products[i]._doc.make,
            products[i]._doc.brand,
            products[i]._doc.description,
            products[i]._doc.retailPrice, 
            products[i]._doc.thumbnail,
            function(err) {
                console.log(err)
            }
        )
    }
})
/*
CreateModel('cool shoes', 'primrose', 'very cool', 170, null, function(err) {console.log(err)})

Brand.find({name:'primrose'}).exec(function(err, results) {
    if (err) {console.log(error)}
    console.log(results)
})*/

