function checkLogIn() {
	// Checks if the user is logged in. If the user is not logged in, it redirects the user to the login page
	var status = getCookie("loggedIn");
	if(status == null || status == "") {
		console.log("User not logged in...redirecting!");	
		window.location = "default.html";
	}
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

// Goes through each user present in the json file and creates a user out of them
var hashtag = "";

function loadParticipants(json) {
	$(json).each(function() {
		var name = this.name;
		if(name != "")
			createUser(name, this.uid);
	});
}

function getUser() {
	// Then performs a ajax call to get the JSON object from the server
	PS.ajax.userRetrieve(getCookie("id"), function(json, textStatus, jqXHR) {
		console.log("User: " + json.name); 
		accountJSON = json; 
		getUserCallback();
	});
}

function getMeeting() {
	// New way of getting users. Gets all users from the particular meeting
	PS.ajax.nodeRetrieve(function(json) {
		populateParticipants2(json.field_meeting_users.und);
		meetingJSON = json;
		getMeetingCallback();
			}, populateFailed, getCookie("meetingID"));
}

function getProject() {
	PS.ajax.nodeRetrieve(function(json) {
		projectJSON = json;
		getProjectCallback();
	
	}, function() { }, getCookie("projectID"));

}

function populateSampleWorkspace() {
	createItem('audio', "empty.html", "Audio");
	createItem('file', "empty.html", "File");
	createItem('images', "empty.html", "Image");
	createItem('document', "empty.html", "Document");
	createItem('file', "empty.html", "File");
	createItem('file', "empty.html", "File");
	createItem('audio', "empty.html", "Audio");
	createItem('images', "empty.html", "Image");
}

function populateSampleUsers() {
	createUser("Byron",0);
	createUser("Charles",0);
	createUser("Christopher",0);
	createUser("Daniel",0);
	createUser("David",0);
	createUser("Patrick",0);
	createUser("Robert",0);
	createUser("Roseline",0);
	createUser("Yaser",0);
}

function populateSampleQueue() {
	//Placeholder to populate queue
	createQueueItem("Comment","empty.html", "comment");
	createQueueItem("Comment","empty.html", "comment");
	createQueueItem("Survey","empty.html", "survey");
	createQueueItem("Question","empty.html", "question");
	createQueueItem("Video","empty.html", "video");
}