var accountJSON;

function checkLogIn() {
	// Checks if the user is logged in. If the user is not logged in, it redirects the user to the login page
	var status = getCookie("loggedIn");
	if(status == null || status == "") {
		console.log("User not logged in...redirecting!");	
		window.location = "default.html";
	}
}

function getUser() {
	// Gets id from cookie
	var accountID = getCookie("id");
	
	// Then performs a ajax call to get the JSON object from the server
	PS.ajax.userRetrieve(accountID, function(json, textStatus, jqXHR) {console.log("Welcome " + json.name); return json; });
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