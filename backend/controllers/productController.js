const cloudinary = require("cloudinary").v2;
const productModel = require("../models/productModel");

//function to get all products
const addProduct = async (req, res) => {
    try{
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        const imageUrl = await Promise.all(
            images.map(async(image)=>{
                let result = await cloudinary.uploader.upload(image.path, {resource_type: "image"});
                return result.secure_url;
            })
        )

        const productData ={
            name,
            description,
            category,
            price : Number(price),
            subcategory: subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();
        
        res.json({success: true, message: "Product added successfully", product});
    }catch(e){
         res.json({success: false, message: "Error while adding product", error: e.message})
    }
}

//function for list PRODUCTSs
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find();
        res.json({success: true, products});
    }catch(e){
        res.json({success: false, message: "Error while listing products", error: e.message});
    }
}

//function for removing product
const removeProduct = async (req, res) => {
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Product removed successfully"});
    }catch(e){
        res.json({success: false, message: "Error while removing product", error: e.message});
    }
}

//function for single product info
const singleProduct = async (req, res) => {
    try{
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({success: true, product});
    }catch(e){
        res.json({success: false, message: "Error while fetching product", error: e.message});
    }
}

module.exports = {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
}
