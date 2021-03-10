var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/customerdb',{useNewUrlParser:true,useUnifiedTopology: true});
var conn=mongoose.connection;
var customerSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	Amount:{
		type:Number,
		required:true
	}
});


var customer=mongoose.model('customer',customerSchema);
module.exports=customer;