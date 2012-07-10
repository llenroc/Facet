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

$.fn.logout = function() {
	PS.ajax.userLogout(logoutPassed);
};

function logoutPassed(json, textStatus, jqXHR) {
	console.log("Logout Passed");
	console.log(json);
	console.log(jqXHR);
	console.log(document.cookie);
}

function loginPassed(json, textStatus, jqXHR) {
	console.log("Login Passed");
	
	console.log(json);
	console.log(jqXHR);
	console.log(document.cookie);
				
	if( screen.width <= 720 ) {
		window.location = 'iphone.html';
	} else {
		window.location = "main.html";
	}
}

function loginFailed(json, textStatus, jqXHR) {
	$("#error").text(jqXHR);
	$("#error").css("display", "block");
	
	console.log("Login Failed");
		
	switch(json.status) {
		case 401:
			console.log("401");
			break;
		case 406:
			break;
		default:
		
			break;
	}
	
	//console.log(json);
	//console.log(jqXHR);
	//console.log(document.cookie);
	
	
}