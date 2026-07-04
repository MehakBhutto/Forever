const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "24h" });
}

//route for user login
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });
    }catch(e){
        console.error(e);
        return res.json({ success: false, message: "Internal server error" });
    }
}

//route for user register
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if(exists){
            return res.json({ success: false, message: "User already exists" });
        }

        //validatng emal format & strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: "Invalid email format" });
        }

        if(password.length < 8){
            return res.json({ success: false, message: "Please enter a stronger password" });
        }

        if(!name || !email || !password){
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        return res.json({ success: true, token });

    }catch(e){
        console.error(e);
        return res.json({ success: false, message: "Internal server error" });
    }
}

//route for admin login
const loginAdmin = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email, password}, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.json({ success: true, token });
        }else{
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
    }catch(e){
        console.error(e);
        return res.json({ success: false, message: "Internal server error" });
    }
}

module.exports = { loginUser, registerUser, loginAdmin }