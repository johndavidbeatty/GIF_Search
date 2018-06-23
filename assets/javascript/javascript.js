
//   a couple of variables to support adding more than initial 10 queries.

var fetch = 10;
var lastSubject;

// Load array from local storage.  If not there, create initial array

var subjects = JSON.parse(localStorage.getItem("subjects"));
if (!Array.isArray(subjects)) {
    console.log("no local storage....yet");
    subjects = ["funny", "baby goat", "baby", "golden puppy", "animalsbeingbros", "baby elephant", "corgi", "kitten"];
};

// This draws subject buttons, it gets called a few times.  For this app, we will initially load 
// from local storage and then work with the array and then write it out to local storage occaisionally.  

function drawButtons() {

    $("#buttons-display").empty();

    // Looping through the array of subjects
    for (var i = 0; i < subjects.length; i++) {


        var but = $("<button>");
        // Adding a class of subject-btn to our button
        but.addClass("subject-btn");
        // Adding a data-attribute
        but.attr("data-name", subjects[i]);
        // Providing the initial button text
        but.text(subjects[i]);
        // Adding the button to the buttons-view div
        $("#buttons-display").append(but);
    }
    subjectButton()

    // Since drawButtons() gets called after changes, it is a good spot to write out to local storage.

    localStorage.setItem("subjects", JSON.stringify(subjects));


};

drawButtons();


// This is the button function for adding new subjects

$("#add-subject").on("click", function (event) {
    event.preventDefault();
    var newSubject = $("#subject-input").val().trim();
    // logic to check for no subject and reject.  Didn't worry about weird characters since user will just get no response.
    if (newSubject === "") {
        console.log("blank");
        return;
    };

    subjects.push(newSubject);

    // call drawbuttons to put up new buttons and write to local storage.

    drawButtons();
});

// This is the button function for removing subjects, drawbuttons writes to localstorage
$("#remove-subject").on("click", function (event) {
    event.preventDefault();
    var deadSubject = $("#subject-input").val().trim();
    // I got this code from StackOverflow but understand its operation - yoink!
    var index = $.inArray(deadSubject, subjects);
    if (index >= 0) subjects.splice(index, 1);
    // call drawbuttons to put up new buttons and write to local storage.
    drawButtons();
});



function subjectButton() {
    $(".subject-btn").on("click", function () {
        var subject = $(this).attr("data-name");

        // Logic to determine if a button is being pushed again and then include more results.  The fetch variable is used to change the number of returned objects.  If it isn't a repeat button, then clear the current GIFs and set retrieve number to 10.  lastSubject is used to track repeat subject pushes.

        if (subject === lastSubject) {
            console.log("adding more images");
            fetch = fetch + 10;
        } else {
            fetch = 10;
            $("#gifs-display").empty();
        }
        lastSubject = subject;

        // Moving on to grabing data from Giphy API.

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            subject + "&api_key=yCyV2ynWSh8G8J9AU8zCDfxSurChUHeL&limit=" + fetch;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {


            let results = response.data
            console.log(results);

            // this logic is to add the GIF displays to the page.  The fetch logic allows it to add the next ten results for repeat button pushes.

            for (var i = (fetch - 10); i < results.length; i++) {

                let displayDiv = $("<div>");

                // t for title, p for rating (prepended, appended)

                let t = $("<p>");
                let p = $("<p>");
                let title =
                    p.text("Rating: " + results[i].rating);
                // Remove word GIF and text after GIF to clean up titles"
                t.text(results[i].title.substr(0, (results[i].title.lastIndexOf("GIF"))));


                let imageDisplay = $("<img>");

                imageDisplay.attr("src", results[i].images.fixed_width_still.url);
                imageDisplay.attr("data-still", results[i].images.fixed_width_still.url);
                imageDisplay.attr("data-animate", results[i].images.fixed_width.url);
                imageDisplay.addClass("gif img-responsive");

                imageDisplay.attr("data-state", "still");

                console.log(results[i].images.fixed_width.url)

                displayDiv.prepend(t);
                displayDiv.append(imageDisplay);
                displayDiv.append(p);
                // prepended so most recently added GIFs at top of page.
                $("#gifs-display").prepend(displayDiv);

            }
            gifButton();
        });
    });
};

// This is the logic to animate or display a still of each GIF.

function gifButton() {
    $(".gif").on("click", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
};
