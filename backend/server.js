const express = require("express"); 
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const connectCloudinary = require("./config/cloudinaryConfig");

//App config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors());

//api endpoints
app.get("/",(req,res)=>{
    res.status(200).send("API Working");
});
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/product", require("./routes/productRoute"));
app.use('/api/cart', require('./routes/cartRoute'))
app.use('/api/order', require('./routes/orderRoute'))

app.listen( PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
})