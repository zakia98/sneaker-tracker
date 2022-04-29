let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let InventoryItemSchema = new Schema({
    model:{type:Schema.Types.ObjectId, ref:'Model', required:true},
    size:{type:Number, required:true},
    purchase_price:{type:Number, required:true}
})

InventoryItemSchema
    .virtual('url')
    .get(function() {
        return '/catalog/inventory/' + this._id
    });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema)