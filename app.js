var express    =require('express');
var fetch      =require('node-fetch');
var bodyparser =require('body-parser');
var app        =express();
app.set("port", process.env.PORT || 3000)

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

const countryList=require('./list');

let apiUrl="http://universities.hipolabs.com/search?country=";


//function to handle errors when calling api
function handleErrors(response) {
    if (!response.ok) {
        throw Error (response.statusText);
    }
    let data=response.json();
    return data;
}


//Routes 

app.get('/', function(req,res){

    //Rendering to the homepage Of the site
    res.render("index",{countryList: countryList});    
});

app.post('/show',function(req,res){
    let country=req.body.country;
    url=apiUrl+country.toLowerCase();
    console.log(url);

    fetch(url)
        .then(handleErrors)
        .then(function(response) {
            if(response.length==0)
            {
                //Redirecting to the homepage if entered city is wrong 
                res.redirect('/');
            }
            else
            {
                //Rendering to the University page if the entered Country is correct 
                res.render("show",{country:country,universityList:response});
            }
        }).catch(function(error) {
            //Displaying error if any
            console.log(error);
        });    

});

app.listen(app.get("port"));
