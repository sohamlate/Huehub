const Ratings = require("../model/Ratings");
const Product = require("../model/Product");
const { getProductDetails } = require("./Product");



exports.createRating = async(req,res)=>{
    try{

      

        const {rating ,review,productId,userId} = req.body;
    
        const getProductDetails = await Product.findOne({_id:productId , customerPurchase:{$elemMatch:{$eq:userId}}, });
    
        if(!getProductDetails){
            return res.status(400).json({
                success:false,
                message:"product not found",
            });
        }
    
        const alreadyReviewed = await Ratings.findOne({user:userId,Product:productId});
    
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Already reviewd product",
            });
        }
    
        const ratingReview = await Ratings.create({user:userId,product:productId,rating,review});
    
        await Product.findByIdAndUpdate({_id:productId},
            {$push:
                {ratingAndReviews:ratingReview},
            },
            {new:true},
        );
    
        return res.status(200).json({
            success:true,
            message:"Rating created successfully",
        })
    }
    catch(err){
        console.log("error occured while creating the rating ",err);
        return res.status(500).json({
            success:false,
            message:"Already reviewd product",
        });

    }
}

exports.getAverageRating = async(req,res)=>{
    try{
        const productId = req.body.productId;

        const result = await Ratings.aggregate([
            {
                $match:{
                    product: new mongoose.Types.ObjectId(productId),
                },
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ]);

        if(result.length>0){
            return res.status(200).json({
                success:false,
                message:result[0].averageRating,
            });
        }

        return res.status(200).json({
            success:false,
            message:"NO rating given till now",
            averageRating:0,
        });


    }
    catch(err){
        console.log("error occured while creating the average rating ",err);
        return res.status(500).json({
            success:false,
            message:err,message,
        });
    }
}

exports.getAllRatings = async(req,res)=>{
    try{

        const allreviews = Ratings.find({}).sort({ratings:"desc"}).populate({path:"user",select:"firstName lastName email image" }).populate({path:"product", select:"productName"});

        return res.status(200).json({
            success:true,
            message:"All rating fetch successfully",
            data:allreviews,
        });


    }
    catch(err){
        console.log("error occured while getting all rating ",err);
        return res.status(500).json({
            success:false,
            message:err,message,
        });

    }
}
