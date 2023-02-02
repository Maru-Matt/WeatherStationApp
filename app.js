const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var _ = require('lodash');
const https = require('https');
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://cluster0:matt@cluster0.aqcg8oz.mongodb.net/weatherDataDB", {useNewUrlParser: true});

const dataSchema = {
    city: String,
    condition: String,
    temp: Number,
    hum: Number,
    pre: Number
}

const Data = mongoose.model("Data", dataSchema);
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get('/', function(req, res){
 res.render('home')
})


app.post('/', function(req, res){
    const cityName = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",US&units=imperial&appid=b305267cda331c2a895aa28567626dc6";
    https.get(url, function(response){
    response.on('data', function(data){
        if(response.statusCode == 200){
            const weatherData = JSON.parse(data);
            const newData = Data({
                city: cityName,
                condition: weatherData.weather[0].description,
                temp: weatherData.main.temp,
                hum: weatherData.main.humidity,
                pre: weatherData.main.pressure
            })
    
           newData.save();
            res.render('index', {
                city: cityName, 
                condition: weatherData.weather[0].description,
                temp: weatherData.main.temp,
                pre: weatherData.main.pressure,
                hum: weatherData.main.humidity,
                icon: "https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png"
            })
        } else{
            res.render('invalid')
        }
        
    });
});

})



app.listen(3003, function(){
    console.log("Server is up and running!");
})


