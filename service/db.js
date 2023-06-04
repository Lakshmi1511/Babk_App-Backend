//import mongoose
const mongoose=require('mongoose')

//connection string
mongoose.connect('mongodb://127.0.0.1:27017/bankServer',{useNewUrlParser:true})

//model (schema) creation-(model name must be singular word of collection name)
//schema means fields and values
const User=mongoose.model('User',
{
    acno:Number,
    uname:String,
    psw:String,
    balance:Number,
    transactions :[]
}
)

//export 
module.exports={
    User
}