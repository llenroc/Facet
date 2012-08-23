var emailError = false;
var pwError = false;

$(function () {
    // Detects if user presses enter.
    $(this).keypress(function (e) {
        if (e.which == 10 || e.which == 13) {
            signup();
        }
    });

    if (window.screen.availWidth < 420) {
        document.getElementById("SignUpContent").style.width = "100%";
        document.getElementById("tscontent").style.width = "100%";
        document.getElementById("eUsername").style.width = "95%";
        document.getElementById("username").style.width = "95%";
        document.getElementById("password").style.width = "95%";
        document.getElementById("cpassword").style.width = "95%";
        document.getElementById("pwrequired").style.width = "95%";
    }
});

function signup() {
    $("#pwError").css("display", "none");
    $("#emailError").css("display", "none");
    $("#emptyError").css("display", "none");
    $("#emailUsed").css("display", "none");
    $("#processing").css("display", "none");

    var username = $("#username").val();
    var pw = $("#password").val();
    var passed = checkCredentials(username, pw);

    if (passed) {
        $("#processing").css("display", "block");
        PS.ajax.userCreate("", username, pw, userCreated, userCreateFailed);
    }
    else {
        failedCreation("");
    }
};

function checkCredentials (email, pw) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var spaces = pw.split(" ");
    emailError = true;
    pwError = true;

    if (pw.valueOf() == $("#cpassword").val()) {
        if (pw.length > 5) {
            if (spaces.length == 1) {
                console.log("Password passed basic check");
                pwError = false;
                if (filter.test(email)) {
                    console.log("Email passed standard format check");
                    emailError = false;
                    if ($("#email").val() != "" && $("#username").val() != "") {
                        console.log("Credentials are not empty");
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

function failedCreation (jqXHR) {
    console.log("User not created");
    $("#processing").css("display", "none");

    if (pwError || jqXHR.indexOf("Not Acceptable: Password field is required") != -1) {
        $("#pwError").css("display", "block");
        pwError = false;
    }
    else if (jqXHR.indexOf("Not Acceptable: The e-mail address") != -1) {
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

	$("#processing").css("display", "none");
    $("#successful").css("display", "block");
    $("#submitButton").css("display", "none");
}

function passwordsMatch() {
    $("#pwwrong").css("display", "none");
    $("#pwcheck").css("display", "none");
    passwordStrength();
    if ($("#password").val() == $("#cpassword").val()) {
        $("#pwcheck").css("display", "block");
    }
    else {
        $("#pwwrong").css("display", "block");
    }
}

function passwordStrength() {
    $("#pwrequired").css("display", "none");
    var pw = $("#password").val();
    var spaces = pw.split(" ");

    if (pw.length < 6 || spaces.length > 1) {
        $("#pwrequired").css("display", "inline");
    }
}

function fillusername() {
    var email = $("#username").val();
    var i = email.indexOf("@");
    if (i != -1) {
        document.getElementById("eUsername").value = email.substring(0, i);
    }
    else {
        document.getElementById("eUsername").value = email;
    }
}
