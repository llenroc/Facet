$(function () {
    PS.ajax.userLogout(logoutPassed);

    // Detects if user presses enter in the password box.
    $("#password").keypress(function (e) {
        if (e.which == 10 || e.which == 13) {
            login();
        }
    });

    if (window.screen.availWidth < 420) {
        document.getElementById("content").style.width = "100%";
        document.getElementById("tcontent").style.width = "100%";
        document.getElementById("username").style.width = "95%";
        document.getElementById("password").style.width = "95%";
    }
	
	$(".meeting").live("click" , function() {
		if( screen.width <= 720 ) {
			window.location = 'iphone.html';
		} else {
			window.location = "main.html";
		}
	});
	
	newProject("Project 1");
	newMeeting("Meeting 1",0);
	newProject("Project 2");
	newProject("Project 3");
	newMeeting("Meeting 2",0);
	newMeeting("Meeting 3",0);
	newMeeting("Meeting 2",1);
	newMeeting("Meeting 3",1);
	newMeeting("Meeting 2",2);
	newMeeting("Meeting 3",2);
});

function login() {
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
	
	$("#projectDiv").css("display","block");
	$("#projectDiv").css("width","80%");
	$(".hideMe").hide();
	$("#pageHeader").text("Welcome back " + json.user.name);
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

// Creates a new project with the given name in the UI
function newProject(name) {
	$("#projectList").append("<li class = 'icon project'><div onclick='$(this).next().toggle();'>" + name + "</div><ul style='display:none; padding-top:10px;' class='apple'></ul></li>");
}

// Creates a new meeting with the given name in the UI as a child of projectIndex, 0 based index
function newMeeting(name, projectIndex) {
	$("#projectList").children().eq(projectIndex).find("ul").append("<li class='icon meeting'>" + name + "</li>");
}