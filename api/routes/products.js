const express = require('express')
const router = express.Router();

const mongoose = require('mongoose')
const multer = require('multer') // library for upload
const checkAuth = require('../middleware/check-auth')
const ProductController = require('../controllers/products')
const storage = multer.diskStorage({
    destination : function(req,file ,cb){
        cb(null , /* path u want to store */ './uploads/')
    },
    filename:function(req,file,cb){
        cb(null,Date.now() + file.originalname /*filename */)
    }
})

const fileFilter = (req,file,cb)=>{
    // reject a file
    if(file.mimetype =="image/jpeg" || file.mimetype == "image/png")
        cb(null , true)
    else
        cb(null,false)
}
const upload = multer({
    storage : storage , 
    limits : {
        fileSize : 1024*1024*5
    },
    fileFilter : fileFilter
}) // store i*ncoming file to dest will create folder uploads
router.get('/' ,checkAuth, ProductController.product_get_all)
                    // upload one file from form productImage
router.post('/' ,checkAuth ,upload.single('productImage'),ProductController.product_create)

router.get('/:productId' ,ProductController.product_get_by_id)

router.patch('/:productId', checkAuth ,ProductController.product_update)
router.delete('/:productId' , checkAuth ,ProductController.product_delete)

module.exports = router;