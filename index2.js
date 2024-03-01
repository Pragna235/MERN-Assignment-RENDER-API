const express=require('express');
const cors = require('cors');
const users=require('./sunglasses');
const path=require('path');
const app=express();
const idFilter = req => member => member.id === parseInt(req.params.id);

// Body Parser Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is Running ${PORT}`));


//GET All USERS

app.get('/api/sunglasses',(req,res)=>res.json(users));

// GET All Users in table format
app.get('/api/sunglasses/table',(req,res) => {
  const tableHtml = `
  <style>
  table{
  border-collapse: collapse;
  width: 100%;
  }
  th, td{
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  }
  th{
  background-color: #f2f2f2;
  }
  </style>
  <table>
  <thead>
  <tr>
     <th> ID </th>
     <th> Title </th>
     <th> Price </th>
     <th> Discount Percentage </th>
     <th> Rating </th>
     <th> Stock </th>
  </tr>
  
  `).join('')}
</tbody>
  </table>;

res.send(tableHtml);
});
//GET Specific USER Based on ID
app.get('/api/sunglasses/:id', (req, res) => {

const found = sunglasses.some(idFilter(req));

if (found) {
res.json(sunglasses.filter(idFilter(req)));
} else {
res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
}

});


//CREATE A NEW USER

app.post('/api/sunglasses',(req,res)=>{

const newMember={

id: sunglasses.length + 1,
title: req.body.title,
price: req.body.price,
discountPercentage: req.body.discountPercentage,
rating: req.body.rating,
stock: req.body.stock

};

if(!newMember.title || !newMember.price){
return res.status(400).json({msg:'TITLE and PRICe must be provided'});
}

sunglasses.push(newMember);
res.json(sunglasses);
}

);

//DELETE Specific USER Based on ID

app.delete('/api/sunglasses/:id', (req, res) => {

const found = sunglasses.some(idFilter(req));

if (found) {
res.json({msg:'Deleted',
members:sunglasses.filter(
member=>member.id!==parseInt(req.params.id))})
} else {
res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
}

});

//UPDATE Specific USER Based on ID

app.put('/api/sunglasses/:id',(req,res)=>

{
const found = sunglasses.some(member=>member.id===parseInt(req.params.id));

if(found)
{
const updMember=req.body;
sunglasses.forEach(
member=>{
if(member.id===parseInt(req.params.id))
{
member.title=updMember ? updMember.title : member.title;
member.price=updMember.price ? updMember.price : member.price;
member.stock=updMember.stock ? updMember.stock : member.stock;
res.json({msg:'Updated Details',member})
}
}

);

}
else{
res.status(400).json({msg:'No User found with ${req.params.id}'});
}

});
