var hashtag = "";

// This function gets called once when the main page is loading. If the user is not logged in, it will redirect the user to the login page
function checkLogIn() {
	var status = getCookie("loggedIn");
	if(status == null || status == "") {
		console.log("User not logged in...redirecting!");	
		window.location = "default.html";
	}
}

// c_name - key that you want to retrieve from the cookie
// Used to retrieve uid for user, and nid for meeting/project
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

// 
function loadParticipants(json) {
	$(json).each(function() {
		PS.ajax.userRetrieve(this.uid, function(json,textStatus, jqXHR) { 
			createUser(json.name, this.uid); 			
		}, function() { console.log("Error loading uid: "+ this.uid );		
		
		});
	});
}

// This function is called only once at login time to store the current user's information in a JSON object.
function getUser() {
	// Then performs a ajax call to get the JSON object from the server
	PS.ajax.userRetrieve(getCookie("id"), function(json, textStatus, jqXHR) {
		console.log("User: " + json.name); 
		accountJSON = json; 
		getUserCallback();
	}, function() { console.log("Error getting current user account"); } );
}

// This function is called only once at login time to store the meeting information in a JSON object.
// It then populates users based on the participants of the meeting.
function getMeeting() {
	PS.ajax.nodeRetrieve(function(json) {
	
		// populateParticipants is present in iphone.js or site.js . It allows for some custom behavior between iPhone and the main version
		populateParticipants(json.field_meeting_users.und);
		
		
		//------------------------Hashtag Updating---------------------------//
		// If there is no hashtag, set it to default 'facetmeeting123'
		if(json.field_meeting_hashtag.length == 0) {
			hashtag = "facetmeeting123";
		} else {	
			// Else, set it to what the server has
			hashtag = json.field_meeting_hashtag.und[0].value;
		}
		
		// Update the monitor to search for that hashtag
		$(".monitter").attr("title", hashtag);
		console.log("Hashtag: " + hashtag);
		//-------------------------------------------------------------------//
		
		
		//-----------------------Updating Meeting Items----------------------//
		// Populate the meeting items. If there are none, do nothing, else, add them
		if(json.field_meeting_items.length == 0) { }
		else {
			var nid = json.field_meeting_items.und[0].nid;
			
			// Retrieve the node to get the name and type of the item
			PS.ajax.nodeRetrieve(function(json2) {
				var type, name;
				if(json2.field_item_name.length == 0) { name = "Unknown Name"; }
				else { name = json2.field_item_name.und[0].value; }
				
				if(json2.field_item_type.length == 0) { type = "unknown"; }
				else { type = json2.field_item_type.und[0].value; }
			
				createItem(type, "empty.html", name);
			
			}, function() { console.log("Failed to Load Meeting Item with nid " + nid);}, nid);		
		}
		//-------------------------------------------------------------------------//
		
		meetingJSON = json;
		getMeetingCallback();
		}, populateFailed, getCookie("meetingID"));
}

// This function is called only once at login time to store the project information in a JSON object.
function getProject() {
	PS.ajax.nodeRetrieve(function(json) {
		
		//-------------------Adding Groups and their Users-----------------------//
		// If there are no groups, do nothing...else add them to the groupList
		if(json.field_project_groups.length == 0) { } 
		else {	
			for(var x = 0; x < json.field_project_groups.und.length; x++) {
				// Performs a retrieve to get information about the group
				PS.ajax.nodeRetrieve(function (json2) {
					var groupName;
					if(json2.field_group_name.length == 0) {
						groupName = "Unknown Group";
					} else {
						groupName = json2.field_group_name.und[0].value;
					}
					
					var index = newGroup1(groupName);
								
					if(json2.field_group_users.length == 0) {
					} else {
						for(var i = 0; i<json2.field_group_users.und.length; i++) {
							
							// Perform a retrieve to get the name of each user in the group
							PS.ajax.userRetrieve(json2.field_group_users.und[i].uid, function (json3) {
								addUserToGroup(json3.name,groupName);
								
							
							}, function() { });
						}
					}
		
					// Failed Callback
					}, function () {
					
					}, json.field_project_groups.und[x].nid);	
			}
		}
		//-----------------------------------------------------------------------//
	
		projectJSON = json;
		getProjectCallback();
	
	}, function() { console.log("Failed to Load Project"); }, getCookie("projectID"));

}

// This function is called only once at login time to get the items belonging to a user. 
function getUserItems() {
	PS.ajax.indexUserItems( function (xml) {
	
		//-------------------------Adding Specific User Items----------------------------//
		// Iterates through each item that a user owns and adds them to the workspace
		$(xml).find("node").slice(1).each(function() {
			var type = $(this).find("Type").text();
			
			// if type == "", then type = "unknown", else, type == type
			type = (type == "") ? "unknown" : type;
			createItem(type, "empty.html", $(this).find("Name").text());
		});
		//--------------------------------------------------------------------------------//
		
		getUserItemsCallback(xml);	
	}, function () { 
		console.log("Failed to Load User Items"); 
	}, getCookie("id"));
}





// Temporary function that populates workspace with sample items
function populateSampleWorkspace() {
	createItem('audio', "empty.html", "Audio");
	createItem('file', "empty.html", "File");
	createItem('image', "empty.html", "Image");
	createItem('document', "empty.html", "Document");
	createItem('file', "empty.html", "File");
	createItem('file', "empty.html", "File");
	createItem('audio', "empty.html", "Audio");
	createItem('image', "empty.html", "Image");
}

// Temporary function that populates page with sample users
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

// Temporary function that populates queue with sample items
function populateSampleQueue() {
	createQueueItem("Comment","empty.html", "comment");
	createQueueItem("Comment","empty.html", "comment");
	createQueueItem("Survey","empty.html", "survey");
	createQueueItem("Question","empty.html", "question");
	createQueueItem("Video","empty.html", "video");
}