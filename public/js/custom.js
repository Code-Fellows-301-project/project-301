'use strict';

// let sample1 = "https://www.youtube.com/watch?v=QqdcCHQlOe0";
// let sample2 = "https://www.youtube.com/watch?v=bXKWu4GojNI";

//   let stringVideo = sample2.substring(32, sample2.length - 1);
// console.log('stringVideo : ', stringVideo);

// let jj = $('#mealVideo').data('id');////.attr("data-id")
// console.log("jj", jj);

let id = $('#mealVideo').data('id');
console.log("ID", id);
let value = $('#youtube').val();
console.log('value : ', value);
$('#savedVideo').attr('src',value);


$.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
.then(data=>{
  console.log('data : ', data);
  let str = data.meals[0].strYoutube;
  console.log('str : ', str);
  let stringVideo = str.substring(32, str.length);
console.log('stringVideo : ', stringVideo);

let videostring = `https://www.youtube.com/embed/${stringVideo}`;
console.log('videostring : ', videostring);
  $('#mealVideo').attr('src',videostring);
});

if(document.getElementById("textArea")){
  var textArea = document.getElementById("textArea");
  textArea.style.color = 'blue';
  textArea.style.fontSize = '20px';
  textArea.style.padding = '20px';
}