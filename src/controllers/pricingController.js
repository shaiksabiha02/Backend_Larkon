import {getPricingPlans} from "../services/pricingService.js";

export async function fetchPricingPlans(req,res){
    try{
        const plans=await getPricingPlans();

        res.status(200).json({
            success:true,
            data:plans
        });
    }catch(error){
        console.error("Error fetching pricing plans:",error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch pricing plans"

        });
    }
}