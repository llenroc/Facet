var projectNID;

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
	
	$("#newProject").click(function() {
		var name = prompt("Please enter the new project name: ","New Project");
		var nid = getCookie("id");
	
		if (name != null && name != "") {
		
			PS.ajax.projectCreate(function() {
				$("#projectList").children().remove();
				refreshItems(nid);		
			}, function(json, textStatus, jqXHR) { alert(jqXHR); }, name, nid)
		}
	
	});
});

function joinMeeting(element) {
	PS.ajax.setCookieData("meetingID", $(element).attr("meetingID"), 365);
	PS.ajax.setCookieData("projectID", $(element).parent().parent().attr("projectID"), 365);
	if( screen.width <= 720 ) {
		window.location = 'iphone.html';
	} else {
		window.location = "main.html";
	}
}

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
	
	$("#projectDiv").show();
	$(".hideMe").hide();
	$("#pageHeader").text("Welcome back " + json.user.name);
	
	refreshItems(json.user.uid);
}

function refreshItems(nid) {
	$("#projectList").append("<li class='icon loading' id='loadingProjects'>Loading Projects...</li>");
	
	// Returns all projects from the current user id
	// I slice out the first element because the first element of find("node") is the node will all other nodes
	// We don't want that, we want the individual nodes (projects)
	PS.ajax.indexUserProjects(function(xml, textStatus, jqXHR) {
		$(xml).find("node").slice(1).each(function() {

			var projectName;
			if($(this).find("Name").text() == "") {
				projectName = "Project #" + $(this).find("Nid").text();
			} else {
				projectName = $(this).find("Name").text();
			}
			newProject(projectName, $(this).find("Nid").text());
			
			var meetings = $(this).find("Meetings").text().split(", ");	
			
		});
		
		PS.ajax.indexUserMeetings(function(xml) {
			$(xml).find("node").slice(1).each(function() {
				newMeetingByProjectID($(this).find("Name").text(), $(this).find("Nid").text(), $(this).find("Owning_project").text());
			});
		}, function(json, textStatus, jqXHR) { alert(jqXHR); }, nid);
		
		// Removes loading animation item
		$("#loadingProjects").remove();
		}, function(json, textStatus, jqXHR) { alert(jqXHR); }, nid);
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
function newProject(name, id) {
	$("#projectList").append("<li projectID='" + id + "' class = 'icon project'><div onclick='$(this).nextAll().toggle();'>" + name + "</div><ul style='display:none; padding-top:0px;' class='apple appleProj'><li onclick='newMeetingBlock(" + id + ")'; class='icon new'>New Meeting</li></ul></li>");
}

function newMeetingByProjectID(name, meetingID, projectID) {
	$("[projectid='"+projectID+"']").find(".appleProj").prepend("<li onclick='joinMeeting(this)' meetingID='" + meetingID + "' class='icon meeting'>" + name + "</li>");
}

function newMeetingBlock(id) {
	projectNID = id;
	
	$.blockUI({ 
	message: $('#createMeetingPrompt'),
	css: { 
		border: 'none', 
		padding: '15px',
		'font-size': '15px',
		backgroundColor: '#222', 
		'-webkit-border-radius': '10px', 
		'-moz-border-radius': '10px', 
		'border-radius': '10px',
		'font-family': '"Trebuchet MS", "Helvetica", "Arial", "Verdana", "sans-serif"',
		'min-width' : '475px',
		'margin-top' : '-200px',
		'margin-left' : '-50px',
		'cursor': 'auto',
	//	opacity: .5, 
		color: '#fff' },
	}); 
}

function createMeetingAjax() {
	var uid = getCookie("id");
	
	var name = $("#meetingName").val();
	var hashTag = $("#hashtag").val();
	
	PS.ajax.meetingCreate(function() {
		$("#projectList").children().remove();
		refreshItems(uid);
		$.unblockUI();
	
	}, function(json, textStatus, jqXHR) { alert(jqXHR); }, name, uid , projectNID, hashTag);
}


function joinMeetingFromCode(code) {
	var split = code.split("-");
	
	if(split.length != 2) { 
		// Codes must be in the form x-y , where x and y are integers
		$("#joincodeerror").show();
	} else if(!isNumeric(split[0]) || !isNumeric(split[1])) {
		$("#joincodeerror").show();
	} else {
	
		$("#joincodeerror").hide();
		$("#projectList").children().remove();
		$("#projectList").append("<li class='icon loading' id='loadingProjects'>Adding Project...</li>");
			
		PS.ajax.addProjectUser(function(json) {
			PS.ajax.addMeetingUser(function(json) {
				$("#loadingProjects").remove();
				console.log("Add successful");
				refreshItems(getCookie("id"));
				$("#joincode").val("");
				
			}, function(json, textStatus, jqXHR) { alert(jqXHR); $("#loadingProjects").remove(); } , getCookie("id"), split[1])
		} , function(json, textStatus, jqXHR) { alert(jqXHR); $("#loadingProjects").remove(); } , getCookie("id"), split[0])
	}
	

}

// http://stackoverflow.com/a/5778071
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
