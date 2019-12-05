'use strict';

let sample1 = "https://www.youtube.com/watch?v=QqdcCHQlOe0";
let sample2 = "https://www.youtube.com/watch?v=bXKWu4GojNI";

  let stringVideo = sample2.substring(32, sample2.length - 1);
console.log('stringVideo : ', stringVideo);

let id = $('#mealVideo').attr("data-id");//.data('id');
console.log("ID", id);
$.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
.then(data=>{
  let str = data.body.meals[0].strYoutube;
  let stringVideo = str.substring(30, str.length - 1);
console.log('stringVideo : ', stringVideo);
  $('#mealVideo').attr('src',`https://www.youtube.com/embed/${stringVideo}`);
});

if(document.getElementById("textArea")){
  var textArea = document.getElementById("textArea");
  textArea.style.color = 'blue';
  textArea.style.fontSize = '20px';
  textArea.style.padding = '20px';
}