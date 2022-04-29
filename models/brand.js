let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BrandSchema = new Schema({
    name:{type:String, required:true, maxLength:100}
})

BrandSchema
    .virtual('url')
    .get(function() {
        return '/catalog/brand/' + this._id
});

module.exports = mongoose.model('Brand', BrandSchema)