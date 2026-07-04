const jwt = require('jsonwebtoken')

const authUser = async (req, res, next) => {
    const { token } = req.headers
    if(!token){
        return res.json({success:false, message: 'Not Authorized, Login Again'});
    }

    try{
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decoded.id;
        next();
    }catch(e){
        console.log(e.message)
        res.json({success:false, message: e.message})
    }
}

module.exports = authUser;