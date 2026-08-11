import{
    submitReview,
    getReviews,
    changeReviewStatus,
    removeReview
} from "../services/Review.Service.js";

// post reviews

export const createReview = async(req,res)=>{
    try{
        const review = await submitReview(req.body);
        res.status(201).json({
            success:true,
            message:"Review Submitted sucessfully.",
            data:review
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};
    // get reviews

    export const getAllReviews = async(req,res)=>{
        try{
            const reviews = await getReviews();
            res.status(200).json({
                success:true,
                data:reviews
            });
        }catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            });
        }
    };
    

    // patch reviews/:id/status

    export const updateReviewStatus = async(req,res)=>{
        try{
            const {id} = req.params;
            const {status} = req.body;
            const review = await changeReviewStatus(
                id,
                status
            );
           res.status(200).json({
            success:true,
            message:"Review status updated successfully.",
            data:review
           });

        }catch(error){
            res.status(400).json({
                success:false,
                message:error.message
            });
        }
    };

    // Delete/review/:id

    export const deleteReview = async(req,res)=>{
        try{
            const {id} = req.params;
            const review = await removeReview(id);
            res.status(200).json({
                success:true,
                message:"Review deleted successfully.",
                data:review
            });
        }catch(error){
            res.status(400).json({
                success:false,
                message:error.message
            });
        };
    }
    
