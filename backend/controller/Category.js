const Category = require("../model/Category");
const {uploadImageToCloudinary} = require("../utils/ImageUploader");
const mongoose = require("mongoose");
const Product = require("../model/Product");

exports.createCategory = async(req,res)=>{
    try{
        const {name , description} = req.body;
        const thumbnail = req.files.image;


        if(!name || !description || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const categoryDetail = await Category.create({
            name,description,image:thumbnailImage.url
        });

        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            categoryDetail,
        });
    }
    catch(err){
        console.log("error occured while creating Category",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.showAllCategory = async(req,res) =>{
    try{
        const allCategory = await Category.find({},{name:true , description:true,image:true});
        
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            allCategory,
        });
        
    }
    catch(err){
        console.log("error occured while showing all Category",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.getid = async(req,res)=>{
    try{
        const {name} = req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const category = await Category.findOne({name});

        if(!category){
            return res.status(403).json({
                success:false,
                message:"category not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            catid:category._id,
        });
    }
    catch(err){
        console.log("error occured while fetching Category ig",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.categoryDetails = async(req,res)=>{
    try{
        const {itemID} = req.body;
        const categoryId =itemID;
        
       

        const selectedCategory = await Category.findById(categoryId).populate("products").exec();

        if(!selectedCategory){
            return res.status(400).json({
                success:false,
                message:"Category not found",
            });
        }

        const differentCategory = await Category.find({_id:{$ne:categoryId}}).populate("products").exec();

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
            }
        })
    }
    catch(err){
        console.log("error occured while showing Category details",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


exports.categoryDetailsArray = async(req,res)=>{
    try{
        const {itemID} = req.body;
        const categoryIds =itemID;
        
    

        const selectedCategory = await Category.find({ _id: { $in: categoryIds } }).populate("products").exec();

        if(!selectedCategory){
            return res.status(400).json({
                success:false,
                message:"Category not found",
            });
        }


        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
            }
        })
    }
    catch(err){
        console.log("error occured while showing Category details",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

