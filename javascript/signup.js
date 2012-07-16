var emailError = false;

function signup() {
    $('#emailError').change(function () {
        $('#emailError').css("display", "none");
    });

    $("#emptyError").bind("DOMSubtreeModified", function () {
        $("#emptyError").css("display", "none");
    });

    var username = $("#username").val();
    var email = $("#email").val();
    var passed = checkCredentials(email);

    if (passed) {
        PS.ajax.userCreate(username, email, "", userCreated, userCreateFailed);
    }
    else {
        failedCreation();
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

function failedCreation () {
    console.log("User not created");
    if (emailError) {
        $("#emailError").css("display", "block");
        emailError = false;
    }
    else {
        $("#emptyError").css("display", "block");
    }
}

function userCreateFailed (json, textStatus, jqXHR) {
    failedCreation();
}

function userCreated (json, textStatus, jqXHR) {
    console.log("User created successfully");

    $("#successful").css("display", "block");
}