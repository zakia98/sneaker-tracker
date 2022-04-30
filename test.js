let SneaksAPI = require('sneaks-api');
const sneaksRoutes = require('sneaks-api/routes/sneaks.routes');
const sneaks = new SneaksAPI();


sneaks.getMostPopular(100, function(err, products) {
    const brands = []

    products.forEach(product => {
        if (!brands.includes(product._doc.brand.toString())) {
            brands.push(product._doc.brand.toString())
        }
    })

    console.log(brands)
})

sneaks.getMostPopular(100, function(err, products) {
    
    for (product of products) {
        console.log(product._doc.brand.toString())
    }
})
