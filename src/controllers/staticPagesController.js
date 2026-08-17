import {
    getFaqs,
    getHelpCenter,
    getPrivacyPolicy
} from "../services/staticPagesService.js";

//faqs fetching
export async function fetchFaqs(req,res){

    try{

        const faqs = await getFaqs();

        res.status(200).json({
            success:true,
            data:faqs
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch FAQs"
        });
    }
}

//help center data fetching
export async function fetchHelpCenter(req,res){

    try{

        const helpCenter = await getHelpCenter();

        res.status(200).json({
            success:true,
            data:helpCenter
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch help center content"
        });
    }
}

//privacy policy data fetching
export async function fetchPrivacyPolicy(req,res){

    try{

        const policy = await getPrivacyPolicy();

        res.status(200).json({
            success:true,
            data:policy
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch privacy policy"
        });
    }
}