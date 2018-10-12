const express = require('express')
const router = express.Router();

const checkAuth = require('../middleware/check-auth')

const OrderController = require('../controllers/orders')
router.get('/' ,checkAuth,OrderController.order_get_alls)

router.post('/' ,checkAuth ,  OrderController.order_create)

router.get('/:orderId' ,OrderController.order_get_by_id)

router.delete('/:orderId' ,checkAuth, OrderController.order_delete)

module.exports = router;