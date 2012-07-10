$(function() {

	// Detects if user presses enter in the password box.
	$("#password").keypress(function(e) {
		if(e.which == 10 || e.which == 13) {
            $(this).login();
        }
	});


});

$.fn.login = function() {
	$("#error").css("display", "none");
	var username = $("#username").val();
	var password = $("#password").val();
	PS.ajax.userLogin(username,password, loginPassed , loginFailed );
};

function loginPassed() {
	console.log("login passed");
	if( screen.width <= 720 ) {
		window.location = 'iphone.html';
	} else {
		window.location = "main.html";
	}

}

function loginFailed() {
	$("#error").css("display", "block");
}