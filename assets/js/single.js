var currentDate = moment().format('dddd, MMMM Do, YYYY')
var recipeNameEl = document.querySelector("#single-recipe");
var recipeContainerEl = document.querySelector("#single-recipe-container");
var limitWarningEl = document.querySelector("#limit-warning");
var modalErrorEl = document.querySelector("#modal-error");
var modalError2El = document.querySelector("#modal-error-2");
var recipeObj = {
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};
var queryString = document.location.search;
var singleRecipe = {};

$("#currentDay").text(currentDate);

var getRecipeName = function () {
  var recipeId = queryString.split("=")[1];
  recipeId = recipeId.split("&")[0];
  var recipeName = queryString.split("=")[2];

  if (recipeName && recipeId) {

    getRecipe(recipeId);
  }
  else {
    document.location.replace("./index.html");
  }
}

var getRecipe = function (recipeId) {
  if (queryString.includes("drinkId")) {
    var apiKey = "1";
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + recipeId;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          singleRecipe = data.drinks[0];
          displayRecipe(data.drinks[0]);

          if (response.headers.get("Link")) {
            displayWarning(recipeId);
          }
        });
      }
      else {
        document.location.replace("./index.html");
      }
    });
  }
  else if (queryString.includes("recipeId")) {
    var apiId = "91e2da9b";
    var apiKey = "d56ab70c91a98e462f1a95f47179d8a1";

    var apiUrl =
      "https://api.edamam.com/api/recipes/v2/" + recipeId + "?app_id=" +
      apiId +
      "&app_key=" +
      apiKey +
      "&type=public";

    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          singleRecipe = data.recipe;
          displayRecipe(data.recipe);

          if (response.headers.get("Link")) {
            displayWarning(recipeId);
          }
        });
      }
      else {
        document.location.replace("./index.html");
      }
    });
  }
};

var displayRecipe = function (recipe) {
  var recipeName = "";
  var imageUrl = "";
  var ingredientsArr = [];
  var instructions = "";
  if (queryString.includes("drinkId")) {
    recipeName = recipe.strDrink;
    imageUrl = recipe.strDrinkThumb;
    instructions= recipe.strInstructions;
    for (var i= 0; i < 15; i++) {
      var ingredient= recipe["strIngredient" + (i + 1)];
      if (ingredient) {
        ingredientsArr.push(ingredient);
      }
    }
  }
  else if (queryString.includes("recipeId")) {
    recipeName = recipe.label;
    imageUrl = recipe.image;
    for(var i = 0; i < recipe.ingredientLines.length; ++i) {
      var ingredient = recipe.ingredientLines[i];
      ingredientsArr.push(ingredient);
    }
  }
  
  recipeNameEl.textContent = recipeName;
  if (recipe.length === 0) {
    recipeContainerEl.textContent("Recipe name could not be loaded.");
  }

  var recipeImg = document.createElement("img");
  recipeImg.classList = "recipe-img";
  recipeImg.setAttribute("src", imageUrl);
  recipeContainerEl.appendChild(recipeImg);

  var ingredientsList = document.createElement("ul");
  ingredientsList.textContent = "Ingredients:";

  for (var i = 0; i < ingredientsArr.length; i++) {
    var ingredientsItem = document.createElement("li");
    ingredientsItem.textContent = ingredientsArr[i];
    ingredientsList.appendChild(ingredientsItem);
  }

  recipeContainerEl.appendChild(ingredientsList);

  if (queryString.includes("drinkId")) {
    var instructionsEl = document.createElement("p");
    instructionsEl.textContent = "Preparation Instructions: " + recipe.strInstructions;
    recipeContainerEl.appendChild(instructionsEl);
  }
  else if (queryString.includes("recipeId")) {
    var instructionsButton = document.createElement("a");
    instructionsButton.setAttribute("href", recipe.url);
    instructionsButton.setAttribute("target", "_blank");
    instructionsButton.textContent = "Preparation Instructions";
    recipeContainerEl.appendChild(instructionsButton);
  }
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
  }
};

var saveRecipeLocalStorage = function () {
  localStorage.setItem("recipes", JSON.stringify(recipeObj));
}

$("#modal-save, #modal-save-2").click(function () {
  var recipeName = "";
  var day = "";
  var recipeType = "";
  var mealType = "";
  var recipeUrl = "";

  if (queryString.includes("drinkId")) {
    day = $("#day-input-2").val();
    if(!day) {
      modalError2El.textContent = "Please select a day of the week.";
      return;
    } else {
      modalError2El.textContent = "";
      recipeName = singleRecipe.strDrink;
      day = day.toLowerCase();
      recipeType = "drink";
    }
  }
  else if (queryString.includes("recipeId")) {
    recipeName = singleRecipe.label;
    day = $("#day-input").val();
    mealType = $("#meal-input").val();

    if (!day || !mealType) {
      modalErrorEl.textContent = "Please select both a day of the week and a meal type.";
      return;
    }
    else {
      modalErrorEl.textContent = "";
      day = day.toLowerCase();
      mealType = mealType;
      recipeUrl = singleRecipe.url;
      recipeType = "food";
    }
  }

    // close modal
    $("#drink-modal").fadeOut();
    $("#food-modal").fadeOut();

    // save in tasks array
    recipeObj[day].push({
      name: recipeName,
      mealType: mealType,
      url: recipeUrl,
      recipeType: recipeType,
    });

    saveRecipeLocalStorage();
    $("#day-input-2").val = "";
    $("#day-input").val = "";
    $("#meal-input").val = "";
});

loadRecipeLocalStorage();

getRecipeName();

// opem and close modal
$("#open").click(function () {
  if (queryString.includes("recipeId")) {
  $("#food-modal").css("display", "block");
  }
  else if(queryString.includes("drinkId")) {
    $("#drink-modal").css("display", "block");
  }
});

$("#modal-close").click(function () {
  $("#drink-modal").fadeOut();
  $("#food-modal").fadeOut();
});

$("#modal-close-2").click(function () {
  $("#drink-modal").fadeOut();
  $("#food-modal").fadeOut();
});