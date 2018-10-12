const User  = require('../models/user')
const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const hashText = bcrypt.hashSync("bacon") // for extends input to hard to extract
exports.signup =  (req,res , next )=>{
    User.find({email : req.body.email})
        .exec()
        .then(user=>{
            if(user.length > 0) {
                return res.status(409).json({
                    message : 'Mail exists'
                })
            } else{
                bcrypt.hash(req.body.password, hashText ,null , (err , hash) =>{
      
                    if(err){
                        
                        return res.status(500).json({
                            error : err
                        })
                    }else {
                        const user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            email : req.body.email,
                            password : hash, 
                        })
                        
                        user
                            .save()
                            .then(result=>{
                                console.log(result)
                                res.status(201).json({
                                    message : 'User created'
                                })
                            })
                            .catch(saveError =>{
                                
                                res.status(500).json({
                                    error : saveError
                                })
                            })
                    }
                })
            }
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
  
}
exports.login = (req,res , next)=>{
    User.find({email : req.body.email})
        .exec()
        .then(user=>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Auth failed"
                })
            }
            bcrypt.compare(req.body.password , user[0].password ,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message : "Auth failed"
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email : user[0].email,
                        userId : user[0]._id
                    }, /*process.env.JWT_KEY*/ 'SCRETE_KEY',
                    {
                        expiresIn : "1h"
                    },
                    )
                    return res.status(401).json({
                        message : "Auth successful",
                        token : token
                    })
                }
                res.status(401).json({
                    message : "Auth failed"
                })
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
}
exports.delete = (req,res,next)=>{
    User.remove({_id : req.params.deleteId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message : "User deleted"
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
}