import Pool from '../config/db.js';
import {calculateCouponDiscount} from '../utils/CouponCalculator.js'

// Get Cart Items
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find cart for user
        const cartResult = await Pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
        if (cartResult.rows.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const cartId = cartResult.rows[0].id;

        const query = `
    SELECT ci.id as cart_item_id, ci.quantity, p.id as product_id, p.product_name, p.price, p.image 
    FROM cart_items ci
    JOIN products p ON ci.items_id = p.id
    WHERE ci.cart_id = $1;
`;
        const result = await Pool.query(query, [cartId]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add Item to Cart
export const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;
        

        // Check if cart exists for user, if not create one
        let cartResult = await Pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
        let cartId;

        if (cartResult.rows.length === 0) {
            const newCart = await Pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId]);
            cartId = newCart.rows[0].id;
        } else {
            cartId = cartResult.rows[0].id;
        }

        const query = `
            INSERT INTO cart_items (cart_id, items_id, quantity) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const result = await Pool.query(query, [cartId, productId, quantity]);
        res.status(201).json({ success: true, item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove Cart Item
export const removeCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const result = await Pool.query(
      `DELETE FROM cart_items 
       WHERE items_id = $1 
       AND cart_id IN (SELECT id FROM cart WHERE user_id = $2)
       RETURNING *`,
      [itemId, userId]
    );
ం
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in user cart'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      deletedItem: result.rows[0]
    });
}
     catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Checkout (Create Order from Cart)
export const checkoutCart = async (req, res) => {
    const client = await Pool.connect();
    try {
        const { userId,shipping_address,couponCode} = req.body;
        
        await client.query('BEGIN');

        // Get user cart
        const cartResult = await client.query(`SELECT * FROM cart WHERE user_id = $1`, [userId]);
        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        const cartId = cartResult.rows[0].id;

        // Get cart items with product 
        const cartItemsQuery = `
            SELECT ci.items_id as product_id, ci.quantity, p.price ,COALESCE(p.tax,0) as tax , p.category_id
            FROM cart_items ci
            JOIN products p ON ci.items_id = p.id
            WHERE ci.cart_id = $1;
        `;
        const cartItemsResult = await client.query(cartItemsQuery, [cartId]);

        if (cartItemsResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        let totalAmount = 0;
        let totalItemsCount = 0;
        cartItemsResult.rows.forEach(item => {
            totalAmount += Number(item.price) * item.quantity;
            totalItemsCount += item.quantity;
        });
        let finalTotal = totalAmount;
        let discountAmount =0;

        if(couponCode){
            const couponRes = await client.query(`SELECT * FROM coupons WHERE UPPER(coupon_code) = UPPER($1) AND status =$2`,[couponCode,'Active']);

            if (couponRes.rows.length>0){
                const coupon = couponRes.rows[0];
                const calculation = calculateCouponDiscount(coupon, totalAmount);
                finalTotal = calculation.finalTotal;
                discountAmount = calculation.discountAmount;
            }
        }

        // Insert into orders table matching new columns
        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, items, status, priority, payment_status,shipping_address) 
            VALUES ($1, $2, $3, 'received', 'normal', 'pending',$4) 
            RETURNING *;
        `;
        const orderResult = await client.query(orderQuery, [userId, finalTotal, totalItemsCount,shipping_address]);
        const orderId = orderResult.rows[0].id;

        // Insert into order_items
        for (let item of cartItemsResult.rows) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price,tax,category_id) VALUES ($1, $2, $3, $4,$5,$6)`,
                [orderId, item.product_id, item.quantity, item.price,item.tax,item.category_id]
            );
        }

        // Clear cart items
        await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'Order created successfully', order: orderResult.rows[0],checkoutSummary: { cartTotal: totalAmount, discountAmount: discountAmount, finalTotal: finalTotal } });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

export default { getCart, addToCart, removeCartItem, checkoutCart };









