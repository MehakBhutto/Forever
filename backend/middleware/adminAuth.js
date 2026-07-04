const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try{
        const { token } = req.headers;
        if(!token){
            return res.json({success:false, message: "No token provided"});
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(token_decoded.email !== process.env.ADMIN_EMAIL || token_decoded.password !== process.env.ADMIN_PASSWORD){
            return res.json({success:false, message: "Not Authorized Login Again"});
        }
        next();
    }catch(e){
        return res.json({success:false, message: "Error verifying token"});
    }
}

module.exports = adminAuth;
