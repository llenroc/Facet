$(function() {

	var status = getCookie("loggedIn");
	if(status != null || status != "") {
		console.log("User logged in...redirecting!");	
		window.location = "main.html";
	}

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

// Used to see if user is logged in
function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}