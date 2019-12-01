'use strict';
// Dependecies (express, cors, dotenv)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true, }));
app.set('view engine','ejs');

client.on('error',err=> {throw err;});



app.use(cors());

/********************** routes *************************/
app.get('/', mealForm);
app.post('/meals', mealsHandler);
app.post('/details', recipeHandler);


/********************** functions *************************/
function mealForm(req,res) {
  // const SQL= 'SELECT * FROM recipe;'
  // client.query(SQL)
  //   .then(results => {
  //     res.render('pages/index',{data:results.rows})
  //   })
  res.render('pages/index');
}

function mealsHandler(req, res){
  // console.log('req: ',req.body.meal);
  
  getMeal(req.body.meal, res)
    .then( (mealData) => res.status(200).json(mealData) );
}

function getMeal(meal, res) { 
  
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${meal}`;//chicken_breast
  return superagent.get(url)
    .then( data => {
      return data.body.meals.map(result=>{
       return new Meal(meal, result);
      })
    })
    .then(results => {
      res.render('pages/meals', { booksArray: results, });
    });
    // .catch(err => errorHandler(err, res));
  }
function Meal(meal, data) {
  this.search_query = meal;
  this.mealsName = data.strMeal;
  this.imageUrl = data.strMealThumb;
  this.id = data.idMeal;
}
function recipeHandler(req,res) {
  // console.log("id: ",req.body.id);
  getRecipe(req.body.id,res)
    .then( (recipeData) => res.status(200).json(recipeData) );
}

function getRecipe(recipe,res) { 
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`;
  return superagent.get(url)
    .then( data => {
      // console.log('id of one recipe',data);
      return new Recipe(recipe, data);
      })
    
    .then(results => {
      console.log('result:',results);
      res.render('pages/details', { book: results, });
    });

}

function Recipe(recipe, data) {
  this.search_query = recipe;
  this.mealsName = data.body.meals[0].strMeal;
  this.category = data.body.meals[0].strCategory;
  this.area = data.body.meals[0].strArea;
  this.instruction=data.body.meals[0].strInstructions;
  this.imageUrl = data.body.meals[0].strMealThumb;
  this.youtube= data.body.meals[0].strYoutube;
}








/********************** Error *************************/
// app.use('*', (request, response) => {
//   response.status(404).send('not working');
// });
// app.use((error,request,response) => {
//   response.status(500).send(error);
// });

client.connect()
.then (()=>{
    app.listen(PORT, () => console.log(`Up on port${PORT}`)
    );
})