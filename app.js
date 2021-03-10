const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const ejs=require('ejs');
var app=express();
var mongoose=require('mongoose');

mongoose.connect('mongodb+srv://palak-admin:ganesha@cluster0.wfctc.mongodb.net/customerdb?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
/*var conn=mongoose.connection;*/
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


var Customer=mongoose.model('Customer',customerSchema);

const transactionSchema = mongoose.Schema({
    sendername:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    receivername:{
        type:String,
        required:true
    }
});
const Transaction = mongoose.model("Transaction",transactionSchema);




//app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static('public'));


app.get("/",function(req,res){
    res.render('home');
});
app.get("/transferhistory",function(req,res){
  Transaction.find({},function(err,transfers){

          res.render('transferhistory',
          {
                transferList:transfers

          });
  });
	
});

app.get("/customers",function(req,res){
	Customer.find({},function(err,customers){
		res.render('customers',{
			customersList:customers
		});
		
	});
       	
});
app.get("/customers/:customerId",function(req,res){
	const id=req.params.customerId;
	Customer.findOne({_id:id},(err,doc)=>{
		res.render('customer',{customer:doc});
	});
});

app.get("/transfer",function(req,res){
	Customer.find({},(err,docs)=>{
	
           res.render('transfer');

	});
	
});
app.post('/transfer',async (req , res) =>{
    try{
      myAccount = req.body.senderId;
      clientAccount = req.body.recieverId;
      transferBal = req.body.amount;
       const transferBalAmt=parseInt(transferBal);
      const firstUser = await Customer.findOne({name: myAccount});
      console.log(firstUser);
      const secondUser = await Customer.findOne({name: clientAccount});
      const thirdOne =  parseInt(secondUser.Amount) + parseInt(transferBal); //Updating Successfully
      const fourthOne = parseInt(firstUser.Amount) - parseInt(transferBal);
      console.log(thirdOne);
      console.log(fourthOne);
      await Customer.findOneAndUpdate( {name : clientAccount} , {Amount : thirdOne});
      await Customer.findOneAndUpdate( {name : myAccount} , {Amount : fourthOne});

    //   console.log(clientAccount);
      await Transaction.create({sendername:firstUser.name,amount:transferBalAmt,receivername:secondUser.name});
     res.redirect("/customers");
    }
    catch (error) {
        res.status(404).send(error);
     }
     
});

app.listen(process.env.PORT || 3000,(err)=>{
	console.log("server is running");
});