const Products = require('../models/product')
const mongoose = require('mongoose')
exports.product_get_all = (req, res,next)=>{
    Products.find()
        .select('name price _id productImage') // select Column
        .exec()
        .then(docs=>{
            const response = {
                count : docs.length ,
                listProduct: docs.map(doc=>{
                    return {
                        name : doc.name,
                        price : doc.price,
                        productImage : doc.productImage,
                        _id : doc._id
                    }
                })
            }
            // if(docs.length >= 0){ // default return empty array
                res.status(200).json(response)
            // } else
            // res.status(404).json({
            //     message:"No entries found"
            // })
            
        })
        .catch(err=>{
            
            res.status(500).json({
                error:err
            })
        })
}

exports.product_create = (req, res,next)=>{
    console.log(req.file)
    const Product = new Products({
        _id : new mongoose.Types.ObjectId(), 
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    })  
    
    Product
        .save()
        .then(result => {
            
            res.status(201).json({
                message : "Created Product Successfully",
                createProduct : {
                    name : result.name,
                    price : result.price,
                    _id : result._id,
                    productImage : result.productImage
                }
            })
        })
        .catch(err=> {
            
            res.status(500).json({
                error: err
            })
        })
    
}

exports.product_get_by_id = (req,res,next)=>{
    const id = req.params.productId
    Products.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc=>{
            
            if(doc) {
                res.status(200).json({
                    product : doc
                })
            }else {
                res.status(404).json({
                    message :"Id not found"
                })
            }
            
        })
        .catch(err=>{
            
            res.status(500).json({error : err})
        })
}

exports.product_update = (req,res,next)=>{
    const id = req.params.productId
    const updateOps = {}
    // You need to Pass [{'propName' : smth , value : smth}]
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Products.update({_id : id} , {$set : updateOps })
        .exec()
        .then(result =>{
          
            res.status(200).json({
                message : "Product Updated"
            })
        })
        .catch(err=>{
           
            res.status(500).json({
                error : err
            })
        })
   
}

exports.product_delete = (req,res,next)=>{
    const id = req.params.productId
    Products.remove({_id : id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message : 'Product deleted'
            })
        })
        .catch(err=>{
            
            res.status(500).json({
                error : err
            })
        })
   
}