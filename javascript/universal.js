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
function loadParticipants(json) {
	$(json).each(function() {
		var name = this.name;
		if(name != "")
			createUser(name, this.uid);
	});
}

function getUser() {
	// Then performs a ajax call to get the JSON object from the server
	PS.ajax.userRetrieve( getCookie("id"), function(json, textStatus, jqXHR) {console.log("Welcome " + json.name); return json; });
}

function populateSampleWorkspace() {
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('images', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('images', "empty.html", "Image");
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
	createQueueItem("Comment","empty.html");
	createQueueItem("Comment","empty.html");
	createQueueItem("Survey","empty.html");
	createQueueItem("Question","empty.html");
	createQueueItem("Video","empty.html");
}