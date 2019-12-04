'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const methodOverride = require('method-override');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true, }));
app.set('view engine','ejs');
client.on('error',err=> {throw err;});
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cors());
/********************** routes *************************/
app.get('/', mealForm);
app.post('/meals', mealsHandler);
app.post('/details', recipeHandler);
app.post('/saved', addToDataBase);
app.get('/saved',getFromDataBase);
app.post('/updatemeal/:id', getUpdateForm);
app.put('/updated/:id',updateMeal );
app.delete('/deletemeal/:id', deleteMeal );
/********************** functions *************************/
function deleteMeal(req, res){
  let values = [req.params.id];
  let SQL = `DELETE FROM recipe WHERE id=$1;`;
  client.query(SQL, values)
    .then(res.redirect('/saved'))
    .catch(error => errorHandler(error, res));
}
function getUpdateForm(req, res){
  let {mealsname, category, area, instruction, imageurl, youtube,} = req.body;
  res.render('pages/updatemeal', {meal:req.body,});
}
function updateMeal(req, res){
  let {mealsname, category, area, instruction, imageurl, youtube,} = req.body;
  const SQL = 'UPDATE recipe SET mealsname=$1, category=$2, area=$3, instruction=$4,  imageurl=$5, youtube=$6 WHERE id=$7';
  let values = [mealsname, category, area, instruction, imageurl, youtube, req.params.id];
  client.query(SQL, values)
    .then(res.redirect('/saved'))
    .catch(error => errorHandler(error, res));
}
function getFromDataBase(req, res){
  let sql = `SELECT * FROM recipe`;
  client.query(sql)
    .then(data => {
      res.render('pages/saved', { mealsArray: data.rows,});
    })
    .catch(error => errorHandler(error, res));
}
function addToDataBase(req, res){
  let {mealsname, category, area, instruction, imageurl, youtube,} = req.body;
  let SQL = 'INSERT INTO recipe (mealsname, category, area, instruction, imageurl, youtube) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [mealsname, category, area, instruction, imageurl, youtube];
  client.query(SQL, values)
    .then(()=>{
      getFromDataBase(req, res);
    })
    .catch(error => errorHandler(error, res));
}
function mealForm(req,res) {
  res.render('pages/index');
}
function mealsHandler(req, res){
  getMeal(req.body.meal, res)
    .then( (mealData) => res.status(200).json(mealData) )
    .catch(error => errorHandler(error, res));
}
function getMeal(meal, res) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${meal}`;
  return superagent.get(url)
    .then( data => {
      return data.body.meals.map(result=>{
        return new Meal(meal, result);
      });
    })
    .then(results => {
      res.render('pages/meals', { mealsArray: results, });
    })
    .catch(error => errorHandler(error, res));
}
function Meal(meal, data) {
  this.search_query = meal;
  this.mealsname = data.strMeal;
  this.imageurl = data.strMealThumb;
  this.id = data.idMeal;
}
function recipeHandler(req,res) {
  getRecipe(req.body.id,res)
    .then( (recipeData) => res.status(200).json(recipeData) )
    .catch(error => errorHandler(error, res));
}
function getRecipe(recipe,res) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`;
  return superagent.get(url)
    .then( data => {
      return new Recipe(recipe, data);
    })
    .then(results => {
      res.render('pages/details', { meal: results, });
    })
    .catch(error => errorHandler(error, res));
}
function Recipe(recipe, data) {
  this.search_query = recipe;
  this.mealsname = data.body.meals[0].strMeal;
  this.category = data.body.meals[0].strCategory;
  this.area = data.body.meals[0].strArea;
  this.instruction = data.body.meals[0].strInstructions;
  this.imageurl = data.body.meals[0].strMealThumb;
  this.youtube = data.body.meals[0].strYoutube;
}
function errorHandler(err, res){
  console.log(err);
  res.status(500).render('pages/error');
}
/********************** Error *************************/
app.use('*', (request, response) => {
  response.status(404).send('something gone wrong');
});
app.use((error,request,response) => {
  if (response) response.status(500).render('pages/error');
});
client.connect()
  .then (()=>{
    app.listen(PORT, () => console.log(`Up on port${PORT}`)
    );
  });
