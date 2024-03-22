const express =  require('express');
const path  =  require('path');
const mongoose = require('mongoose');
const {exec} = require('child_process');
const childCommand = require('child-command');
const app = express();
const webSocket = require('ws');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
  res.render('homepage.ejs');
  // exec(`adb devices`)
})


//show connected devices
app.get('/connecteddevices',(req,res)=>{
    res.render('connecteddevices.ejs');
})



app.post('/connecteddevices',(req,res)=>{
    // res.send('post request successful!') 
    exec(`adb devices`,(error,stdout,stderr)=>{
      //error handling
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred');
      }
    
      //showing the devices
      const devices= stdout.split('\n').slice(1).filter(line => line.trim() !== '').map(line => {
        const [device, state] = line.trim().split('\t');
        return { device, state };
      });
      //get the list of deviceNames
      // let deviceName = [];
      // for (i of devices){
      //   // deviceName.push(exec(`adb -s ${i['device']} shell getprop ro.product.marketname`));
      //   deviceName.push(i['device']);
      // }
      // res.send(deviceName);
      // res.send(devices);
       res.render('connecteddevices',{devices});
    }) 
});






app.get('/pairdevice',(req,res)=>{
  res.render('pairdevice.ejs');
})

app.post('/pairdevice',(req,res)=>{
  
    const {ipaddress,pairingport,password,port} = req.body;
    //res.send(`Entered ip: ${ipaddress} Entered key: ${password}`);
    exec(`adb pair ${ipaddress}:${pairingport} ${password}`,(error, stdout,stderr)=>{
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred during pairing');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred during pairing');
      }
      console.log(`Pairing successful: ${stdout}`);
      console.log(ipaddress)
      res.send(`Pairing successful <a href='/connectDevice'>connect Device</a>`);
    })
    

app.get('/connectDevice',(req,res)=>{
    res.render('connectDevice');
})    
app.post('/connectDevice',(req,res)=>{
   const {port} = req.body; 
  exec(`adb connect ${ipaddress}:${port}`,(error, stdout,stderr)=>{
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred during pairing');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred during pairing');
      }
      console.log(`Connection successful: ${stdout}`);
      res.send(`Pairing & Connection successful <a href='/'>home</a>`);
    })
})



    // .then(res.redirect('/'))
    // .then(res.send('paired successfully!'))
    // .catch(err=>{console.log(err)})
});



//scrcpy
app.get('/scrcpy',(req,res)=>{
  res.send('get request scrcpy');
})
app.post('/scrcpy',(req,res)=>{
    // res.send(req.body);
    exec('scrcpy -s 192.168.0.247:37525',(error, stdout, stderr)=>{
      if(error){
        res.send(`Error: ${error.message}`);
      }
      if (stderr) {
        res.send(`scrcpy Error: ${stderr}`);
      }

      //output
      console.log(stdout);
    })
})



app.listen(3000,()=>{
    console.log('listening on port 3000');
})


