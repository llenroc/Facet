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
function loadParticipants(xml) {
	
	var split = xml.split("; ");
	
	if(split[0] != "") {
		for(var i = 0; i < split.length; i ++) {
			var split2 = split[i].split(", ");
			createUser(split2[1],split2[0]);
		}
	}
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

	// TODO - transition everything from nodeRetrieve to retrieve
	PS.ajax.retrieve("meeting", getCookie("meetingID"), function(xml) {
		$(xml).find("node").slice(1).each(function() {
			
			// populateParticipants is present in iphone.js or site.js . It allows for some custom behavior between iPhone and the main version
			populateParticipants($(this).find("Users_data").text());
			
			//------------------------Hashtag Updating---------------------------//
			// Gets hashtag. If it isn't present, a default facetmeeting123 is set
			hashtag = $(this).find("Hashtag").text();
			hashtag = (hashtag.length != 0) ? hashtag : "facetmeeting123";
			
			// Update the monitor to search for that hashtag
			$(".twitterfeed").append("<div class='monitter' id='tweets' title='" + hashtag + "' lang='en'></div>");
			
			// Taken from monitter.min.js to update dynamically added twitter hashtags.
			window.monitter={};
			$('.monitter').each(function(e){rrp=6;fetch_tweets(this);});
			
			console.log("Hashtag: " + hashtag);
			//-------------------------------------------------------------------//
						
		});
	
	}, function() { console.log("Meeting Retrieve Failed");});
	
	PS.ajax.nodeRetrieve(function(json) {
		
		//-----------------------Updating Meeting Items----------------------//
		// Populate the meeting items. If there are none, do nothing, else, add them
		if(json.field_meeting_items.length == 0) { }
		else {
			for(var x = 0; x < json.field_meeting_items.und.length; x++) {
				var nid = json.field_meeting_items.und[x].nid;
				PS.ajax.nodeRetrieve(function(json2) {					
					var type, name;
					if(json2.field_item_name.length == 0) { name = "Unknown Name"; }
					else { name = json2.field_item_name.und[0].value; }
					
					if(json2.field_item_type.length == 0) { type = "unknown"; }
					else { type = json2.field_item_type.und[0].value; }
				
					createItem(type, "empty.html", name, ".meetingItems");
					
				
				}, function() { console.log("Failed to Load Meeting Items with nid " + nid); }, nid);
			}
		}
		//-------------------------------------------------------------------------//
		
		meetingJSON = json;
		getMeetingCallback();
		}, populateFailed, getCookie("meetingID"));
}

function getGroupItems() {
	PS.ajax.indexUserGroups( function (xml) { 
		//-------------------------Adding Specific Group Items----------------------------//
		// Iterates through each item that a user owns and adds them to the workspace
		$(xml).find("node").slice(1).each(function() {
			var cssName = makeSafeForCSS($(this).find("Name").text());
			createWorkspaceAccordion($(this).find("Name").text(), cssName);
			
			var items = $(this).find("Items").text().split(", ");
			for(var i = 0; i < items.length; i++) {
				var nid = items[i];
				if(nid != "") {
					PS.ajax.nodeRetrieve(function(json2) {					
						var type, name;
						if(json2.field_item_name.length == 0) { name = "Unknown Name"; }
						else { name = json2.field_item_name.und[0].value; }
						
						if(json2.field_item_type.length == 0) { type = "unknown"; }
						else { type = json2.field_item_type.und[0].value; }
						
						createItem(type, "empty.html", name, "."+cssName);
									
					}, function() { console.log("Failed to Load Project Items with nid " + nid); }, nid);
				}
			}
		});
		//--------------------------------------------------------------------------------// 
		
		getGroupItemsCallback();
	}, function() { console.log("Failed to load Group Items"); }, getCookie("id"));

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
				PS.ajax.retrieve("group", json.field_project_groups.und[x].nid, function(xml) {
					var nid = $(xml).find("Nid").text();
					var groupName = $(xml).find("Name").text();
					groupName = (groupName.length != 0) ? groupName : "Group";
					newGroup1(groupName, nid);
					
					var userData = $(xml).find("User_data").text().split("; ");
					
					// If there are no users in the group, this will fail, otherwise it adds the users
					if (userData[0] != "") {
						for(var i = 0; i < userData.length; i++) {
							var split = userData[i].split(", ");
							addUserToGroup(split[1],groupName, split[0]);
						}
					}
						
				}, function() { console.log("Failed to Load Group") });
			}
		}
		//-----------------------------------------------------------------------//
		
		
		//-------------------------Add Project Items-----------------------------//
		if(json.field_project_item.length == 0) { }
		else {
			for(var x = 0; x < json.field_project_item.und.length; x++) {
				var nid = json.field_project_item.und[x].nid;
				PS.ajax.nodeRetrieve(function(json2) {					
					var type, name;
					if(json2.field_item_name.length == 0) { name = "Unknown Name"; }
					else { name = json2.field_item_name.und[0].value; }
					
					if(json2.field_item_type.length == 0) { type = "unknown"; }
					else { type = json2.field_item_type.und[0].value; }
				
					createItem(type, "empty.html", name, ".projectItems");
					
				
				}, function() { console.log("Failed to Load Project Items with nid " + nid); }, nid);
			}
		}
		//----------------------------------------------------------------------//
	
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
			createItem(type, "empty.html", $(this).find("Name").text(), ".myItems");
		});
		//--------------------------------------------------------------------------------//
		
		getUserItemsCallback(xml);	
	}, function () { 
		console.log("Failed to Load User Items"); 
	}, getCookie("id"));
}

// http://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
function makeSafeForCSS(name) {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
}





// Temporary function that populates workspace with sample items
function populateSampleWorkspace() {
	createItem('audio', "empty.html", "Audio", ".myItems");
	createItem('file', "empty.html", "File", ".myItems");
	createItem('image', "empty.html", "Image", ".myItems");
	createItem('document', "empty.html", "Document", ".myItems");
	createItem('file', "empty.html", "File", ".myItems");
	createItem('file', "empty.html", "File", ".myItems");
	createItem('audio', "empty.html", "Audio", ".myItems");
	createItem('image', "empty.html", "Image", ".myItems");
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


function initializeGoogleMap() {

	// Initialize the Google Map to be zoomed in on the lat/long
	/*var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	*/
	
	googleMapFacetLegendSetup("map_canvas");
}



















