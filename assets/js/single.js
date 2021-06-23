var currentDate = moment().format('dddd, MMMM Do, YYYY')
var recipeNameEl = document.querySelector("#single-recipe");
var recipeContainerEl = document.querySelector("#single-recipe-container");
var limitWarningEl = document.querySelector("#limit-warning");
var recipeObj = {
        sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
};
  console.log(recipeObj);
var singleRecipe = {};

$("#currentDay").text(currentDate);

var getRecipeName = function() {
    var queryString = document.location.search;
    var recipeId = queryString.split("=")[1];
    recipeId = recipeId.split("&")[0];
    console.log("recipe ID: " + recipeId);
    var recipeName = queryString.split("=")[2];
    console.log("recipe name: " + recipeName);

    if(recipeName && recipeId) {

        getRecipe(recipeId);
    }
    else {
        console.log("get Recipe Name error");
        //document.location.replace("./index.html");
    }
}

var getRecipe = function(recipeId) {
    var apiId = "91e2da9b";
    var apiKey = "d56ab70c91a98e462f1a95f47179d8a1";
    
    var apiUrl = 
    "https://api.edamam.com/api/recipes/v2/" + recipeId + "?app_id=" +
    apiId +
    "&app_key=" +
    apiKey +
    "&type=public";

    console.log(apiUrl);

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                singleRecipe = data.recipe;
                displayRecipe(data.recipe);

                if(response.headers.get("Link")) {
                    displayWarning(recipeId);
                }
            });
        }
        else {
            console.log("get Recipe error");
            //document.location.replace("./index.html");
        }
    });
};

var displayRecipe = function(recipe) {
    var recipeName = recipe.label;
    recipeNameEl.textContent = recipeName;
    if(recipe.length === 0) {
        alert("error");
    }

    var recipeImg = document.createElement("img");
    recipeImg.setAttribute("src",recipe.image);
    recipeContainerEl.appendChild(recipeImg);

    var ingredientsList = document.createElement("ul");
    ingredientsList.textContent = "Ingredients:";

    console.log("ingredient length: " + recipe.ingredients.length);

    for (var i = 0; i < recipe.ingredients.length; i++) {
        var ingredientsItem = document.createElement("li");
        ingredientsItem.textContent = recipe.ingredients[i].text;
        ingredientsList.appendChild(ingredientsItem);
    }
    
    recipeContainerEl.appendChild(ingredientsList);

    var instructionsButton = document.createElement("a");
    instructionsButton.setAttribute("href",recipe.url);
    instructionsButton.setAttribute("target", "_blank");
    instructionsButton.textContent = "Preparation Instructions";

    recipeContainerEl.appendChild(instructionsButton);
};
  
  var loadRecipeLocalStorage = function () {
      console.log("load local storage");
      recipeObj = JSON.parse(localStorage.getItem("recipes"));
    
      // if nothing in localStorage, create a new object to track all day arrays
      if (!recipeObj) {
          console.log("local storage empty");
        recipeObj = {
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
        };
        console.log("recipe object: " + recipeObj);
      }
    };
  
  var saveRecipeLocalStorage = function () {
    localStorage.setItem("recipes",JSON.stringify(recipeObj));
  }

  $("#modal-form #modal-save-button").click(function () {
    var day = $("#day-input").val().toLowerCase();
    var mealType = $("#meal-input").val().toLowerCase();
    var recipeName = singleRecipe.label;
    var recipeUrl = singleRecipe.url;
    console.log("recipe URL: " + recipeUrl);
    console.log("day: " + day);
    console.log("recipe object: " + recipeObj);
    console.log("day object: " + recipeObj[day]);

    if(!day || !mealType) {
        alert("You must provide input for both Day of the Week and Meal Type");
    }
    else {
        
            // close modal
            //$("#modal-form").modal("hide");
        
            // save in tasks array
            recipeObj[day].push({
              name: recipeName,
              mealType: mealType,
              url: recipeUrl,
            });
        
            saveRecipeLocalStorage();
    }
});

loadRecipeLocalStorage();

getRecipeName();