var pwNotSame = false;

$.fn.signup = function () {
    $("#pwError").css("display", "none");
    $("#emptyError").css("display", "none");
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    var passed = $(this).checkCredentials();
    console.log(passed.valueOf());

    if (passed) {
        PS.ajax.userCreate(username, email, password, userCreated);
    }
    else {
        $(this).userCreateFailed();
        console.log("User not created");
    }
};

$.fn.checkCredentials = function () {
    var pw = $("#password").val();
    var spaces = pw.split(" ");
    pwNotSame = true;

    if (pw.valueOf() == $("#cpassword").val()) {
        if (pw.valueOf() != "") {
            if (spaces.length == 1) {
                if (pw.length > 5) {
                    console.log("Passwords matched");
                    if ($("#email").val() != "" && $("#username").val() != "") {
                        console.log("Credentials are not empty");
                        pwNotSame = false;
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

$.fn.userCreateFailed = function () {
    if (pwNotSame) {
        $("#pwError").css("display", "block");
        pwSame = false;
    }
    else {
        $("#emptyError").css("display", "block");
    }
}

function userCreated (json, textStatus, jqXHR) {
    console.log("User created successfully");

    if (screen.width <= 720) {
        window.location = 'iphone.html';
    }
    else {
        window.location = "main.html";
    }
}