import {
    createCouponService,
    getCouponsService,
    updateCouponService,
    deleteCouponService,
    validateCouponService
} from "../services/Coupons.service.js";

// post create a coupon

export const createCoupon = async(req,res)=>{
    try{
        const coupon = await createCouponService(req.body);
        res.status(201).json({
            success:true,
            message:"Coupon created successfully.",
            data:coupon
        });
    }catch (error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }

};

// get all the coupons

export const getCoupons = async(req,res)=>{
    try{
        const coupons = await getCouponsService();
        res.status(200).json({
            success:true,
            data:coupons
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
//updating the coupon

export const updateCoupon = async (req,res)=>{
    try{
        const {id} = req.params;
        const coupon = await updateCouponService(
            id,
            req.body
        );
        res.status(200).json({
            success:true,
            message:"Coupon updated successfully.",
            data:coupon
        });

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }

};

// delete coupon

export const deleteCoupon = async(req,res)=>{
    try{
        const {id} = req.params;
        const coupon = await deleteCouponService(id);
        res.status(200).json({
            success:true,
            message:"Coupon deactivated successfully.",
            data:coupon
        });

    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }

};

// Validate Coupon at checkout

export const validateCoupon = async(req,res)=>{
    try{
        const{
            couponCode,
            orderId
        }=req.body;

        const result = await validateCouponService(
            couponCode,
            orderId
        );
        res.status(200).json({
            success:true,
            message:"Coupon is valid.",
            data:result
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};
