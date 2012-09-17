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

// This function is called only once at login time to store the current user's information in a JSON object.
function getUser() {
	// Then performs a ajax call to get the JSON object from the server
	PS.ajax.userRetrieve(getCookie("id"), function(json, textStatus, jqXHR) {
		console.log("User: " + json.name); 
		accountJSON = json; 
		
		$("#settingsUser").text(json.name);
		$("#myItemsHeader").text(json.name +"'s Items");
		
		getUserCallback();
	}, function() { console.log("Error getting current user account"); } );
}

// This function is called only once at login time to store the meeting information in a JSON object.
// It then populates users based on the participants of the meeting.+
function getMeeting() {
	PS.ajax.retrieve("meeting", getCookie("meetingID"), function(xml) {
		$(xml).find("node").slice(1).each(function() {
			// populateParticipants is present in iphone.js or site.js . It allows for some custom behavior between iPhone and the main version
			populateParticipants($(this).find("Users_data").text());
			
			PS.model.checkHashTag($(xml).find("Hashtag").text());
				
			meetingJSON = xml;
			
			getMeetingCallback();	
		});
	
	}, function() { console.log("Meeting Retrieve Failed");});
}


// data - string in the form of "<item1 nid>, <item1 Name>, <item1 type>, <item1 URL>; <item2 nid>, <item2 Name>, <item2 type>, <item2 URL>; ..."
// Adds all the items from this data string
// targetClass - The class of the item you want to add it to
function addItemFromItemData(data, targetClass) {
	var itemData = data.split("; ");
	for(var i = 0; i < itemData.length; i++) {
		if(itemData[i] != "") {
			split = itemData[i].split(", ");
			createItem(split[2], split[3], split[1], targetClass, split[0]);
		}			
	}
}

// Takes an item nid and performs a retrieve on it. It then updates the shared screen with the URL
function changeSharedScreenFromID(nid) {
	PS.model.activeItem = nid;
	PS.ajax.retrieve("item", nid, function(xml) {
		// First updates shared screen pretending it's a survey
		$("#shared_canvas").attr("src","http://facetsurvey.4abyte.com/facetsurvey/" + nid);
	
		// Then, if it finds a URL, it updates shared screen with the URL it finds
		$(xml).find("node").slice(1).each(function() {
			$("#shared_canvas").attr("src",$(this).find("Url").text());	
		});
			
	}, function() { console.log("Failed to Load Shared Screen Item"); });
}


//
function addQueueItemsFromString(string) {
	var itemData = string.split("; ");
	for(var i = 0; i < itemData.length; i++) {
		if(itemData[i] != "") {
			var split = itemData[i].split(", ");
			
			createQueueItem(split[1], split[3], split[2], split[0]);
		}			
	}
}

function getGroupItems() {
	PS.ajax.indexUserGroups( function (xml) { 
		//-------------------------Adding Specific Group Items----------------------------//
		// Iterates through each item that a user owns and adds them to the workspace
		$(xml).find("node").slice(1).each(function() {
			var cssName = makeSafeForCSS($(this).find("Name").text());
			createWorkspaceAccordion($(this).find("Name").text(), cssName);
			
			addItemFromItemData($(this).find("Items_data").text(), "." + cssName);
			
		});
		//--------------------------------------------------------------------------------// 
		
		getGroupItemsCallback();
	}, function() { console.log("Failed to load Group Items"); }, getCookie("id"));

}

// This function is called only once at login time to store the project information in a JSON object.
function getProject() {

	PS.ajax.retrieve("project", getCookie("projectID"), function(xml) {
		$(xml).find("node").slice(1).each(function() {
		
			addItemFromItemData($(this).find("Items_data").text(), ".projectItems");
			
			//----------------------Adding Groups and Users-------------------------------//
			var groupSplit = $(this).find("Groups").text().split(", ");
			for(var i = 0; i < groupSplit.length; i++) {
				if(groupSplit[i] != "") {
					// Performs a retrieve to get information about the group			
					PS.ajax.retrieve("group", groupSplit[i], function(xml) {
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
			//-------------------------------------------------------------------------//
			
			projectJSON = xml;
			$("#settingsProject").text($(xml).find("Name").text());
			getProjectCallback();
			
		});
	}, function() { console.log("Project Retrieve Failed"); });
		
}

//Based of regex found here http://stackoverflow.com/a/8260383
function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[1].length==11){
        return match[1];
    }else{
        return false;
    }
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

function createItemAjax() {	

	// Type is used for css styling
	// String is first made lowercase, and then remove all spaces
	var type = $("#filetype").val().toLowerCase().split(" ").join("");
	var name = $("#filename").val();
	var url = $("#url").val();
	
	if(name == "" || name == null || url == "" || url == null) {
		$("#itemCreateErrorMessage").text("Please Enter a item name and URL");
		$("#itemCreateErrorMessage").show();
	} else {
		
		var valid = true;
		var reason = "";
	
		// This is needed to embedd Google Maps
		if(type == "googlemap") {
			url = url + "&output=embed";	
		} else if(type == "youtube") {
			url = "http://www.youtube.com/embed/" + youtube_parser(url);
			
			if(youtube_parser(url) == false) { valid = false; reason = "Invalid YouTube Link"; }
		}
		
		if(valid) { 
			$("#itemCreateErrorMessage").hide();
		
			PS.ajax.itemCreate( function(json) { 
				createItem(type, url, name, ".myItems", json.nid);
				
				// Clear fields for next item
				$("#url").val("");
				$("#filename").val("");
				
				// Unblock UI on Desktop and mobile
				$.unblockUI();	
				$('.ui-dialog').dialog('close');
			
			} , function(json, textStatus, jqXHR) { 
				console.log("Error Creating Item: " + name); 
				reason = jqXHR.split('<em class="placeholder">').join("").split("</em>").join("");
				
				$("#itemCreateErrorMessage").text(reason);
				$("#itemCreateErrorMessage").show();
			}, name, type ,accountJSON.uid, url);
			

		} else {
			$("#itemCreateErrorMessage").text(reason);
			$("#itemCreateErrorMessage").show();
		}
	}
}

function changeHashtag(hashtag) {
	// Removes old monitter
	$(".monitter").remove();

	// Adds the monitor to search for that hashtag
	$(".twitterfeed").append("<div class='monitter' id='tweets' title='" + hashtag + "' lang='en'></div>");
	
	// Taken from monitter.min.js to update dynamically added twitter hashtags.
	window.monitter={};
	$('.monitter').each(function(e){rrp=6;fetch_tweets(this);});
	
	console.log("Hashtag: " + hashtag);
	PS.model.hashtag = hashtag;
}


function refresh() {
	PS.ajax.retrieve("meeting", getCookie("meetingID"), function(xml) {
		$(xml).find("node").slice(1).each(function() {
		
			PS.model.checkActiveItem($(xml).find("Active_item").text());
			PS.model.checkHashTag($(xml).find("Hashtag").text());			
			PS.model.checkMeetingItems($(this).find("Items_data").text());			
			PS.model.checkMeetingParticipants($(this).find("Users_data").text());
			PS.model.checkQueue($(xml).find("Queue_data").text());

			
			$("#settingsMeeting").text($(xml).find("Name").text());			
			meetingJSON = xml;		
		});
	
	}, function() { console.log("Meeting Retrieve Failed");});
	
	PS.ajax.indexUserItems( function (xml) {
		PS.model.checkUserItems(xml);
	}, function () { console.log("Failed to Load User Items"); }, getCookie("id"));	
	
	
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
	createQueueItem("Comment","empty.html", "comment",1464);
	createQueueItem("Comment","empty.html", "comment",1464);
	createQueueItem("Survey","empty.html", "survey",1464);
	createQueueItem("Question","empty.html", "question",1464);
	createQueueItem("Video","empty.html", "video",1464);
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



















