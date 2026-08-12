import express from 'express';
const router = express.Router();
import orderController from '../controllers/orderController.js';
import authenticateToken from '../middlewares/auth.js'



router.get('/', orderController.listOrders);
router.get('/received', orderController.getReceivedOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);
router.post('/:id/cancel', orderController.cancelOrder);
router.get('/:id/invoice', orderController.getInvoice);

export default router;