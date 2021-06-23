// global variables
var currentDate = moment().format('dddd, MMMM Do, YYYY')
var searchFormEl = document.querySelector("#search-form");
var searchTextInputEl = document.querySelector("#search-text");
var searchMealTypeEl = document.querySelector("#search-meal-type");
var searchCuisineTypeEl = document.querySelector("#search-cuisine-type");
var searchResultsEl = document.querySelector("#search-results");
var recipeSearchTerm = document.querySelector("#recipe-search-term");
var recipeObj = {};

$("#currentDay").text(currentDate);

var formSubmitHandler = function (event) {
  event.preventDefault();

  var searchText = searchTextInputEl.value.trim();
  var mealType = searchMealTypeEl.value;
  var cuisineType = searchCuisineTypeEl.value;

  if (!searchText && !mealType && !cuisineType) {
    alert("Please enter at least one Search Criteria.");
  } else {
    getRecipes(searchText, mealType, cuisineType);
    searchTextInputEl.value = "";
    searchMealTypeEl.value = "";
    searchCuisineTypeEl.value = "";
  }
};

var getRecipes = function (searchText, mealType, cuisineType) {
  var apiId = "91e2da9b";
  var apiKey = "d56ab70c91a98e462f1a95f47179d8a1";
  var apiUrl =
    "https://api.edamam.com/api/recipes/v2?app_id=" +
    apiId +
    "&app_key=" +
    apiKey +
    "&type=public";

  if (searchText && mealType && cuisineType) {
    apiUrl =
      apiUrl +
      "&q=" +
      searchText +
      "&mealType=" +
      mealType +
      "&cuisineType=" +
      cuisineType;
  } else if (searchText && !mealType && cuisineType) {
    apiUrl = apiUrl + "&q=" + searchText + "&cuisineType=" + cuisineType;
  } else if (searchText && !mealType && !cuisineType) {
    apiUrl = apiUrl + "&q=" + searchText;
  } else if (!searchText && mealType && cuisineType) {
    apiUrl = apiUrl + "&mealType=" + mealType + "&cuisineType=" + cuisineType;
  } else if (!searchText && mealType && !cuisineType) {
    apiUrl = apiUrl + "&mealType=" + mealType;
  } else if (!searchText && !mealType && cuisineType) {
    apiUrl = apiUrl + "&cuisineType=" + cuisineType;
  }

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          console.log(data.hits[0].recipe.label);
          displayRecipes(data.hits, searchText, mealType, cuisineType);
        });
      } else {
        // will need to replace with modal
        alert("Error");
      }
    })
    .catch(function (error) {
     // will need to replace with modal
      alert("unable to connect");
    });
};

var displayRecipes = function (recipes, searchText, mealType, cuisineType) {
  if (recipes.length === 0) {
    console.log("no recipes found");
    searchResultsEl.textContent = "No recipes found.";
    return;
  }

  searchResultsEl.textContent = "";
  if (searchText && mealType && cuisineType) {
    recipeSearchTerm.textContent = searchText + " + " + mealType + " + " + cuisineType;
  } else if (searchText && !mealType && cuisineType) {
    recipeSearchTerm.textContent = searchText + " + " + cuisineType;
  } else if (searchText && !mealType && !cuisineType) {
    recipeSearchTerm.textContent = searchText;
  } else if (!searchText && mealType && cuisineType) {
    recipeSearchTerm.textContent = mealType + " + " + cuisineType;
  } else if (!searchText && mealType && !cuisineType) {
    recipeSearchTerm.textContent = mealType;
  } else if (!searchText && !mealType && cuisineType) {
    recipeSearchTerm.textContent = cuisineType;
  }
  console.log(recipeSearchTerm);

  for (var i = 0; i < recipes.length; i++) {
    var recipeName = recipes[i].recipe.label;
    var recipeUrlSplit = recipes[i].recipe.uri.split("_");
    var recipeId = recipeUrlSplit[1];
    console.log(recipeId);

    var recipeEl = document.createElement("a");
    //recipeEl.classList = "";
    recipeEl.setAttribute("href", "./single-recipe.html?recipeId=" + recipeId + "&recipeName=" + recipeName);

    var titleEl = document.createElement("span");
    titleEl.textContent = recipeName;

    recipeEl.appendChild(titleEl);
    searchResultsEl.appendChild(recipeEl);
  }
};

var renderRecipe = function (recipeName, recipeMealType, recipeUrl, calendarDay) {
    var dayLi = document.createElement("li");
    var recipeSpan = document.createElement("span");
    recipeSpan.textContent = recipeName;
    var recipeP = document.createElement("p");
    recipeP.textContent = recipeMealType;
    var recipeA = document.createElement("a");
    recipeA.textContent = "Instructions";
    recipeA.setAttribute("href",recipeUrl);
  
    dayLi.appendChild(recipeSpan, recipeP, recipeA);
  
    $("#list-"+ calendarDay).appendChild(dayLi);
};

var loadRecipeLocalStorage = function () {
    recipeObj = JSON.parse(localStorage.getItem("recipes"));
  
    // if nothing in localStorage, create a new object to track all day arrays
    if (!recipeObj) {
      recipeObj = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      };
      return false;
    }
  
    // loop over object properties and add event text to page
    $.each(recipeObj, function (day, arr) {
      arr.forEach(function (recipe) {
        renderRecipe(recipe.name, recipe.mealType, recipe.url, day);
      });
    });
  };

var saveRecipeLocalStorage = function () {
  localStorage.setItem("recipes",JSON.stringify(recipeObj));
}

loadRecipeLocalStorage();

searchFormEl.addEventListener("submit", formSubmitHandler);
