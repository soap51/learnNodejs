const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required :true}, // ref mean reference to some Schema = foreign key
    quantity : {type : Number, default : 1}
})

module.exports = mongoose.model('Order' , orderSchema)