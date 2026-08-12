import express from 'express';
const router = express.Router();
import cartController from '../controllers/cartController.js'



router.get('/:userId',cartController.getCart);
router.post('/:userId/items',cartController.addToCart);
router.delete('/:userId/items/:itemId',cartController.removeCartItem);
router.post('/checkout',cartController.checkoutCart);

export default router;