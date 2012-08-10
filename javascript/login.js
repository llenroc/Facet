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
	
	$("#projectList").append("<li class='icon' id='loading'>Loading Projects...</li>");
	
	$("#projectDiv").css("display","block");
	$("#projectDiv").css("width","80%");
	$(".hideMe").hide();
	$("#pageHeader").text("Welcome back " + json.user.name);
	
	// Returns all projects from the current user id
	// I slice out the first element because the first element of find("node") is the node will all other nodes
	// We don't want that, we want the individual nodes (projects)
	PS.ajax.indexUserProjects(function(xml, textStatus, jqXHR) {
		$(xml).find("node").slice(1).each(function() {
			newProject("Project #" + $(this).find("Nid").text());
			var meetings = $(this).find("Meetings").text();
			
			if(meetings == "") {
				noMeeting2();
			} else {
				newMeeting2(meetings);
			}
		});
		
		// Removes loading animation item
		$("#loading").remove();
		}, function() {
		
		console.log("failed");
		
		}, json.user.uid);
	

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

}

// Creates a new project with the given name in the UI
function newProject(name) {
	$("#projectList").append("<li class = 'icon project'><div onclick='$(this).next().toggle();'>" + name + "</div><ul style='display:none; padding-top:10px;' class='apple'></ul></li>");
}

// Creates a new meeting with the given name in the UI as a child of projectIndex, 0 based index
function newMeeting(name, projectIndex) {
	$("#projectList").children().eq(projectIndex).find("ul").append("<li class='icon meeting'>" + name + "</li>");
}

// Creates a new meeting with the given name in the UI as a child of the LAST project.
function newMeeting2(name) {
	newMeeting(name, $("#projectList").children().length -1);
}

function noMeeting(projectIndex) {
	$("#projectList").children().eq(projectIndex).find("ul").append("<li class='icon nomeeting'>No Meetings for this Project</li>");
}

function noMeeting2() {
	noMeeting($("#projectList").children().length -1);
}