if (window.screen.availWidth < 420) {
    document.getElementById("content").style.width = "100%";
    document.getElementById("tcontent").style.width = "100%";
}

$(function() {

	PS.ajax.userLogout(logoutPassed);
	
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

function logoutPassed(json, textStatus, jqXHR) {
	console.log("Logout Passed");
}

function loginPassed(json, textStatus, jqXHR) {
	console.log("Login Passed");
					
	if( screen.width <= 720 ) {
		window.location = 'iphone.html';
	} else {
		window.location = "main.html";
	}
}

function loginFailed(json, textStatus, jqXHR) {
	console.log("Login Failed");
		
	var message = json.statusText.split(": ")[1];
	switch(json.status) {
		case 401:
			$("#error").text(message);
			break;
		case 406:
			$("#error").text(message);
			break;
		default:
			$("#error").text("Uncaught Error: " + json.statusText);
			break;
	}
	
	$("#error").css("display", "block");
	
	//console.log(json);
	//console.log(jqXHR);
	//console.log(document.cookie);
}