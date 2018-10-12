const Order = require('../models/orders')
const Product = require('../models/product') 
const mongoose = require('mongoose')
exports.order_get_alls =  (req,res,next)=>{
    Order
        .find()
        .select('product quantity _id')
        .populate('product' , '_id name')
        .exec()
        .then(docs=>{
            res.status(200).json({
                count : docs.length,
                orders : docs.map(doc=>{
                    return{
                        _id : doc._id,
                        product : doc.product,
                        quantity : doc.quantity
                    }
                })
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
}

exports.order_create = (req,res,next)=>{
    Product.findById(req.body.productId)
        .then(product=>{ // still get null you need to check
            if(product == null){
                return res.status(404).json({
                    message : "Product not found"
                })
            }
            const orders = new Order({
                _id : mongoose.Types.ObjectId(),
                quantity : req.body.quantity,
                product : req.body.productId
            })
            return orders
                .save()        
                
        }).then(result=>{
                    
            res.status(201).json({
                message : 'Order Created',
                createdOrder : {
                    _id : result._id,
                    product : result.product,
                    quantity : result.quantity
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
        
    
    
}

exports.order_get_by_id =  (req,res,next)=>{
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order=>{
            if(order == null){
                return res.status(404).json({
                    message : 'Order not found'
                })
            }
            res.status(200).json({
                order : order,
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
}

exports.order_delete= (req,res,next)=>{
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'Order deleted'
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
}