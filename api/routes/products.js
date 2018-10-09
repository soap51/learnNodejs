const express = require('express')
const router = express.Router();
const Products = require('../models/product')
const mongoose = require('mongoose')
router.get('/' , (req, res,next)=>{
    Products.find()
        .select('name price _id') // select Column
        .exec()
        .then(docs=>{
            const response = {
                count : docs.length ,
                listProduct: docs
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
})

router.post('/' , (req, res,next)=>{
    const Product = new Products({
        _id : new mongoose.Types.ObjectId(), 
        name : req.body.name,
        price : req.body.price
    })  
    
    Product
        .save()
        .then(result => {
            
            res.status(201).json({
                message : "Created Product Successfully",
                createProduct : {
                    name : result.name,
                    price : result.price,
                    _id : result._id
                }
            })
        })
        .catch(err=> {
            
            res.status(500).json({
                error: err
            })
        })
    
})

router.get('/:productId' ,(req,res,next)=>{
    const id = req.params.productId
    Products.findById(id)
        .select('name price _id')
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
})

router.patch('/:productId' ,(req,res,next)=>{
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
   
})
router.delete('/:productId' ,(req,res,next)=>{
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
   
})

module.exports = router;