let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ModelSchema = new Schema({
    name:{type:String, required:true},
    brand:{type:Schema.Types.ObjectId, ref:'Brand', required:true},
    description:{type:String, required:false},
    retail_price:{type:Number, required:true},
    thumbnail:{type:String, required:false}
})

ModelSchema
    .virtual('url')
    .get(function() {
        return '/catalog/model/' + this._id
    });

module.exports = mongoose.model('Model', ModelSchema)