let SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();


sneaks.getMostPopular(100, function(err, products) {
    console.log(products)
})