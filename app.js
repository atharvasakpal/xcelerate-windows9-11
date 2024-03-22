const express =  require('express');
const path  =  require('path');
const mongoose = require('mongoose');
const {exec} = require('child_process');
const childCommand = require('child-command');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
  res.render('homepage.ejs');
})

app.get('/pairdevice',(req,res)=>{
  res.render('pairdevice.ejs');
})

app.post('/pairdevice',(req,res)=>{
  
    const {ipaddress,password} = req.body;
    //res.send(`Entered ip: ${ipaddress} Entered key: ${password}`);
    exec(`adb pair ${ipaddress} ${password}`)
    .then(res.redirect('/'))
    .catch(err=>{console.log(err)})
});



app.listen(3000,()=>{
    console.log('listening on port 3000');
})


