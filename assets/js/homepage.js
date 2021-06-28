// global variables
var currentDate = moment().format('dddd, MMMM Do, YYYY');
var searchFormEl = document.querySelector("#search-form");
var searchTextInputEl = document.querySelector("#search-text");
var searchMealTypeEl = document.querySelector("#search-meal-type");
var searchCuisineTypeEl = document.querySelector("#search-cuisine-type");
var searchResultsEl = document.querySelector("#search-results");
var recipeSearchTerm = document.querySelector("#recipe-search-term");
var recipeObj = {};
var drinkFormEl = document.querySelector("#search-form-drink");
var drinkTextInputEl = document.querySelector("#search-text-drink");
var drinkResultsEl = document.querySelector("#drink-results");
var drinkSearchTerm = document.querySelector("#drink-search-term");
var drinkObj = {};
var dayArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

$("#currentDay").text(currentDate);


var updateDayHighlight = function () {
  var currentDay = "";
  currentDay = moment().format('dddd');

  for (var i = 0; i < dayArray.length; i++) {
    var dayContainer = $("#" + dayArray[i] + "-container");
    dayContainer.classList = "day-of-week";
    var dayHeader = dayContainer.children().first();
    dayHeader.removeClass("day-header-current");
    if (currentDay.toUpperCase() == dayArray[i].toUpperCase()) {
      dayHeader.addClass("day-header-current");
    }
  }
}

var recipeSubmitHandler = function (event) {
  event.preventDefault();

  var searchText = searchTextInputEl.value.trim();
  var mealType = searchMealTypeEl.value;
  var cuisineType = searchCuisineTypeEl.value;

  if (!searchText && !mealType && !cuisineType) {
    searchResultsEl.textContent = "";
    searchResultsEl.textContent = "Please enter at least one search criteria.";
  } else {
    searchResultsEl.textContent = "";
    getRecipes(searchText, mealType, cuisineType);
    searchTextInputEl.value = "";
    searchMealTypeEl.value = "";
    searchCuisineTypeEl.value = "";
  }
};

var drinkSubmitHandler = function (event) {
  event.preventDefault();

  var drinkText = drinkTextInputEl.value.trim().toLowerCase();

  if (!drinkText) {
    drinkResultsEl.textContent = "";
    drinkResultsEl.textContent = "Please enter a search criteria.";
  } else {
    drinkResultsEl.textContent = "";
    getDrinks(drinkText);
    drinkTextInputEl.value = "";
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
          displayRecipes(data.hits, searchText, mealType, cuisineType);
        });
      } else {
        searchResultsEl.textContent = "There was an error processing your request.";
      }
    })
    .catch(function (error) {
      searchResultsEl.textContent = "Unable to connect to the server.";
    });
};

var getDrinks = function (drinkText) {
  var apiKey = "1";
  var apiUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?"

  if (drinkText) {
    apiUrl =
      apiUrl +
      "s=" +
      drinkText
  }
  else { 
    return; 
  }

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayDrinks(data.drinks, drinkText);
        });
      } else {
        drinkResultsEl.textContent = "There was an error processing your request.";
      }
    })
    .catch(function (error) {
      drinkResultsEl.textContent = "Unable to connect to the server.";
    });
};

var displayRecipes = function (recipes, searchText, mealType, cuisineType) {
  if (recipes.length === 0) {
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

  for (var i = 0; i < recipes.length; i++) {
    var recipeName = recipes[i].recipe.label;
    var recipeUrlSplit = recipes[i].recipe.uri.split("_");
    var recipeId = recipeUrlSplit[1];

    var recipeEl = document.createElement("a");
    recipeEl.classList = "search-list-item";
    recipeEl.setAttribute("href", "./single-recipe.html?recipeId=" + recipeId + "&recipeName=" + recipeName);

    var titleEl = document.createElement("h4");
    titleEl.textContent = recipeName;

    recipeEl.appendChild(titleEl);
    searchResultsEl.appendChild(recipeEl);
  }
};

var displayDrinks = function (drinks, drinkText) {
  if (!drinks) {
    drinkResultsEl.textContent = "No drinks found.";
    return;
  }

  drinkResultsEl.textContent = "";

  drinkSearchTerm.textContent = drinkText;

  for (var i = 0; i < drinks.length; i++) {
    var drinkName = drinks[i].strDrink;
    var drinkId = drinks[i].idDrink;

    var drinkEl = document.createElement("a");
    drinkEl.classList = "search-list-item";
    drinkEl.setAttribute("href", "./single-recipe.html?drinkId=" + drinkId + "&drinkName=" + drinkName);

    var titleEl = document.createElement("h4");
    titleEl.textContent = drinkName;

    drinkEl.appendChild(titleEl);
    drinkResultsEl.appendChild(drinkEl);
  }
};

var renderRecipe = function (recipeName, recipeType, recipeMealType, recipeUrl, calendarDay) {
  var dayLi = $("<li>").addClass("list-group-item");
  var recipeSpan = $("<h4>").text(recipeName);
  recipeSpan.addClass("recipe-name");
  dayLi.append(recipeSpan);

  if(recipeType == "food") {
    var recipeP = $("<p>").text(recipeMealType);
    var recipeA = $("<a>").text("Instructions");
    recipeA.attr("href", recipeUrl);
  
    dayLi.append(recipeP, recipeA);
    dayLi.addClass("list-group-item-food");
  }
  else {
    dayLi.addClass("list-group-item-drink");
  }
  

  $("#list-" + calendarDay).append(dayLi);
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

  // loop over object properties and add event text to page
  $.each(recipeObj, function (list, arr) {
    arr.forEach(function (recipe) {
      renderRecipe(recipe.name, recipe.recipeType, recipe.mealType, recipe.url, list);
    });
  });
};

var saveRecipeLocalStorage = function () {
  localStorage.setItem("recipes", JSON.stringify(recipeObj));
}

$(".list-group").on("click", "p", function () {
  // get currnt text of p element
  var text = $(this).text().trim();

  // replace p element with new textarea
  var mealTypeSelect = $("<select>").addClass("form-control");
  mealTypeSelect.append(new Option("Breakfast", "Breakfast"));
  mealTypeSelect.append(new Option("Lunch", "Lunch"));
  mealTypeSelect.append(new Option("Dinner", "Dinner"));
  mealTypeSelect.append(new Option("Snack", "Snack"));
  mealTypeSelect.append(new Option("N/A", "N/A"));
  $(this).replaceWith(mealTypeSelect);

  // auto focus new element
  mealTypeSelect.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "select", function () {
  var text = $(this).val().trim();

  var day = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();

  // update task in array and re-save to localstorage
  recipeObj[day][index].mealType = text;
  saveRecipeLocalStorage();

  // recreate p element
  var taskP = $("<p>").text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);
});

$(".day-of-week .list-group").sortable({
  connectWith: $(".day-of-week .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function (event, ui) {
    $(this).addClass("dropover");
    $(".bottom-trash").addClass("bottom-trash-drag");
  },
  deactivate: function (event, ui) {
    $(this).removeClass("dropover");
    $(".bottom-trash").removeClass("bottom-trash-drag");
  },
  over: function (event) {
    $(event.target).closest(".day-of-week").addClass("dropover-active");
  },
  out: function (event) {
    $(event.target).closest(".day-of-week").removeClass("dropover-active");
  },
  update: function () {
    // array to store the task data in
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this)
      .children()
      .each(function () {
        var name = $(this).find("h4").text().trim();
        var recipeType = "";
        var meal = "";
        var url = "";

        if($(this)[0].classList[1] == "list-group-item-food") {
          meal = $(this).find("p").text().trim();
          url = $(this).find("a").text().trim();
          recipeType = "food";
        } else {
          recipeType = "drink";
        }

        // add task data to the temp array as an object
        tempArr.push({
          name: name,
          recipeType: recipeType,
          mealType: meal,
          url: url,
        });
      });

    // trim down list's ID to match object property
    var arrName = $(this).attr("id").replace("list-", "");

    // update array on tasks object and save
    recipeObj[arrName] = tempArr;
    saveRecipeLocalStorage();
  },
});

// trash icon can be dropped onto
$("#recipe-trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",

  drop: function (event, ui) {
    ui.draggable.remove();
    // remove dragged element from the dom    ui.draggable.remove();    
    $(".bottom-trash").removeClass("bottom-trash-active");
  },
  over: function (event, ui) {
    $(".bottom-trash").addClass("bottom-trash-active");
  },
  out: function (event, ui) {
    $(".bottom-trash").removeClass("bottom-trash-active");
  }
});

updateDayHighlight();

setInterval(function () {
  updateDayHighlight();
}, 1000 * 60 * 5);


loadRecipeLocalStorage();

searchFormEl.addEventListener("submit", recipeSubmitHandler);

drinkFormEl.addEventListener("submit", drinkSubmitHandler);
