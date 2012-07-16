var emailError = false;

function signup() {
    $('#emailError').css("display", "none");
    $("#emptyError").css("display", "none");
    $("#emailUsed").css("display", "none");
    $("#processing").css("display", "none");
    $(document).ready(function () {
        $(".errormsg").each(function () {
            $(this).load("mydiv");
        });
    });

    var username = $("#username").val();
    var email = $("#email").val();
    var passed = checkCredentials(email);

    if (passed) {
        $("#processing").css("display", "block");
        PS.ajax.userCreate(username, email, "", userCreated, userCreateFailed);
    }
    else {
        failedCreation("");
    }
};

function checkCredentials (email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    emailError = true;

    if (filter.test(email)) {
        console.log("Email passed standard format check");
        emailError = false;
        if ($("#email").val() != "" && $("#username").val() != "" && $("#fname").val() != "") {
            console.log("Credentials are not empty");
            return true;
        }
    }
    return false;
};

function failedCreation (jqXHR) {
    console.log("User not created");
    $("#processing").css("display", "none");
    if (jqXHR != "") {
        $("#emailUsed").css("display", "block");
    }
    else if (emailError) {
        $("#emailError").css("display", "block");
        emailError = false;
    }
    else {
        $("#emptyError").css("display", "block");
    }
}

function userCreateFailed(json, textStatus, jqXHR) {
    /*check for "Not Acceptable" for email already in use error*/
    failedCreation(jqXHR);
}

function userCreated (json, textStatus, jqXHR) {
    console.log("User created successfully");

    $("#successful").css("display", "block");
    $("#submitButton").css("display", "none");
}