$(function() {
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
	alert(screen.width);
	if( screen.width <= 480 ) {
		window.location = '/iphone.html';
	} else {
		window.location = "main.html";
	}

}

function loginFailed() {
	$("#error").css("display", "block");
}