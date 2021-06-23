// global variables
var currentDate = moment().format('dddd, MMMM Do, YYYY');
var searchFormEl = document.querySelector("#search-form");
var searchTextInputEl = document.querySelector("#search-text");
var searchMealTypeEl = document.querySelector("#search-meal-type");
var searchCuisineTypeEl = document.querySelector("#search-cuisine-type");
var searchResultsEl = document.querySelector("#search-results");
var recipeSearchTerm = document.querySelector("#recipe-search-term");
var recipeObj = {};
var dayArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

$("#currentDay").text(currentDate);


var updateDayHighlight = function () {
  var currentDay = "";
  currentDay = moment().format('dddd');
  console.log("current day: " + currentDay.toUpperCase());

  for (var i = 0; i < dayArray.length; i++) {
    var dayContainer = $("#" + dayArray[i] + "-container");
    dayContainer.classList = "day-of-week";
    var dayHeader = dayContainer.children().first();
    dayHeader.removeClass("day-header-current");
    if(currentDay.toUpperCase() == dayArray[i].toUpperCase()) {
      dayHeader.addClass("day-header-current");
    }
  }
}

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
    recipeEl.classList = "search-list-item";
    recipeEl.setAttribute("href", "./single-recipe.html?recipeId=" + recipeId + "&recipeName=" + recipeName);

    var titleEl = document.createElement("span");
    titleEl.textContent = recipeName;

    recipeEl.appendChild(titleEl);
    searchResultsEl.appendChild(recipeEl);
  }
};

var renderRecipe = function (recipeName, recipeMealType, recipeUrl, calendarDay) {
  var dayLi = $("<li>").addClass("list-group-item");;
  var recipeSpan = $("<span>").text(recipeName);
  recipeSpan.addClass("recipe-name");
  var recipeP = $("<p>").text(recipeMealType);
  var recipeA = $("<a>").text("Instructions");
  recipeA.attr("href", recipeUrl);

  dayLi.append(recipeSpan, recipeP, recipeA);

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
      renderRecipe(recipe.name, recipe.mealType, recipe.url, list);
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
  recipeObj[day][index].text = text;
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
  deactivate: function(event, ui) {
    $(this).removeClass("dropover");
    $(".bottom-trash").removeClass("bottom-trash-drag");
  },
  over: function (event) {
    $(event.target).addClass("dropover-active");
  },
  out: function (event) {
    $(event.target).removeClass("dropover-active");
  },
  update: function () {
    // array to store the task data in
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this)
      .children()
      .each(function () {
        var meal = $(this).find("p").text().trim();

        var name = $(this).find("span").text().trim();

        var url = $(this).find("a").text().trim();

        // add task data to the temp array as an object
        tempArr.push({
          name: name,
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
    console.log(ui);
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

searchFormEl.addEventListener("submit", formSubmitHandler);
