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
  let {mealsname, category, area, instruction, imageurl, youtube,noin1,noin2,noin3,noin4,noin5,noin6,noin7,noin8,noin9,noin10,noin11,noin12,noin13,noin14,noin15,noin16,noin17,noin18,noin19,noin20,nome1,nome2,nome3,nome4,nome5,nome6,nome7,nome8,nome9,nome10,nome11,nome12,nome13,nome14,nome15,nome16,nome17,nome18,nome19,nome20,} = req.body;

    res.render('pages/updatemeal', {meal:req.body,});
}
function updateMeal(req, res){
  let {mealsname, category, area, instruction, imageurl, youtube,noin1,noin2,noin3,noin4,noin5,noin6,noin7,noin8,noin9,noin10,noin11,noin12,noin13,noin14,noin15,noin16,noin17,noin18,noin19,noin20,nome1,nome2,nome3,nome4,nome5,nome6,nome7,nome8,nome9,nome10,nome11,nome12,nome13,nome14,nome15,nome16,nome17,nome18,nome19,nome20,} = req.body;
    const SQL = 'UPDATE recipe SET mealsname=$1, category=$2, area=$3, instruction=$4,  imageurl=$5, youtube=$6, noin1=$7, noin2=$8, noin3=$9, noin4=$10, noin5=$11, noin6=$12, noin7=$13, noin8=$14, noin9=$15, noin10=$16, noin11=$17, noin12=$18, noin13=$19, noin14=$20, noin15=$21, noin16=$22, noin17=$23, noin18=$24, noin19=$25, noin20=$26, nome1=$27, nome2=$28, nome3=$29, nome4=$30, nome5=$31, nome6=$32, nome7=$33, nome8=$34, nome9=$35, nome10=$36, nome11=$37, nome12=$38, nome13=$39, nome14=$40, nome15=$41, nome16=$42, nome17=$43, nome18=$44, nome19=$45, nome20=$46 WHERE id=$47';
    let values = [mealsname, category, area, instruction, imageurl, youtube, noin1, noin2, noin3, noin4, noin5, noin6, noin7, noin8, noin9, noin10, noin11, noin12, noin13, noin14, noin15, noin16, noin17, noin18, noin19, noin20, nome1, nome2, nome3, nome4, nome5, nome6, nome7, nome8, nome9, nome10, nome11, nome12, nome13, nome14, nome15, nome16, nome17, nome18, nome19, nome20, req.params.id]; 
    // console.log('values,',values);
    
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
  let {mealsname, category, area, instruction, imageurl, youtube,noin1,noin2,noin3,noin4,noin5,noin6,noin7,noin8,noin9,noin10,noin11,noin12,noin13,noin14,noin15,noin16,noin17,noin18,noin19,noin20,nome1,nome2,nome3,nome4,nome5,nome6,nome7,nome8,nome9,nome10,nome11,nome12,nome13,nome14,nome15,nome16,nome17,nome18,nome19,nome20,} = req.body;
  let SQL = 'INSERT INTO recipe (mealsname, category, area, instruction, imageurl, youtube, noin1,noin2, noin3, noin4, noin5, noin6, noin7, noin8, noin9, noin10, noin11, noin12, noin13, noin14, noin15, noin16, noin17, noin18, noin19, noin20, nome1, nome2, nome3, nome4, nome5, nome6, nome7, nome8, nome9, nome10, nome11, nome12, nome13, nome14, nome15, nome16, nome17, nome18, nome19, nome20) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46);';
  let values = [mealsname, category, area, instruction, imageurl, youtube, noin1, noin2, noin3, noin4, noin5, noin6, noin7, noin8, noin9, noin10, noin11, noin12, noin13, noin14, noin15, noin16, noin17, noin18, noin19, noin20, nome1, nome2, nome3, nome4, nome5, nome6, nome7, nome8, nome9, nome10, nome11, nome12, nome13, nome14, nome15, nome16, nome17, nome18, nome19, nome20];
  
  
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
  console.log('recipe : ', recipe);
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
  this.noin1=data.body.meals[0].strIngredient1;
  this.noin2=data.body.meals[0].strIngredient2;
  this.noin3=data.body.meals[0].strIngredient3;
  this.noin4=data.body.meals[0].strIngredient4;
  this.noin5=data.body.meals[0].strIngredient5;
  this.noin6=data.body.meals[0].strIngredient6;
  this.noin7=data.body.meals[0].strIngredient7;
  this.noin8=data.body.meals[0].strIngredient8;
  this.noin9=data.body.meals[0].strIngredient9;
  this.noin10=data.body.meals[0].strIngredient10;
  this.noin11=data.body.meals[0].strIngredient11;
  this.noin12=data.body.meals[0].strIngredient12;
  this.noin13=data.body.meals[0].strIngredient13;
  this.noin14=data.body.meals[0].strIngredient14;
  this.noin15=data.body.meals[0].strIngredient15;
  this.noin16=data.body.meals[0].strIngredient16;
  this.noin17=data.body.meals[0].strIngredient17;
  this.noin18=data.body.meals[0].strIngredient18;
  this.noin19=data.body.meals[0].strIngredient19;
  this.noin20=data.body.meals[0].strIngredient20;
  this.nome1=data.body.meals[0].strMeasure1;
  this.nome2=data.body.meals[0].strMeasure2;
  this.nome3=data.body.meals[0].strMeasure3;
  this.nome4=data.body.meals[0].strMeasure4;
  this.nome5=data.body.meals[0].strMeasure5;
  this.nome6=data.body.meals[0].strMeasure6;
  this.nome7=data.body.meals[0].strMeasure7;
  this.nome8=data.body.meals[0].strMeasure8;
  this.nome9=data.body.meals[0].strMeasure9;
  this.nome10=data.body.meals[0].strMeasure10;
  this.nome11=data.body.meals[0].strMeasure11;
  this.nome12=data.body.meals[0].strMeasure12;
  this.nome13=data.body.meals[0].strMeasure13;
  this.nome14=data.body.meals[0].strMeasure14;
  this.nome15=data.body.meals[0].strMeasure15;
  this.nome16=data.body.meals[0].strMeasure16;
  this.nome17=data.body.meals[0].strMeasure17;
  this.nome18=data.body.meals[0].strMeasure18;
  this.nome19=data.body.meals[0].strMeasure19;
  this.nome20=data.body.meals[0].strMeasure20;

  

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
