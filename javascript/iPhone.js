// When clicking on a li from #participantList or #workspaceList, this is updated with the li itself. Later on it is used to provide information about what was originally clicked on
var selectedItem;
var selectedGroup;

//var accountJSON;

/*
	pageinit is fired the FIRST time the page is brought into view
	pagebeforeshow is fied EVERY time the page is brought into view
*/

$(function() {

	// Checks if the user is logged in. If the user is not logged in, it redirects the user to the login page
	checkLogIn();
		
	// AJAX call to first get user id from cookie, and then to retrieve the json object from server
	// Once AJAX call is completed then accountJSON will be the user account of the person currently logged in
	getUser();
	
	// Performs a node retrieve on the meeting. After it is retrieved, it populates the UI with all meeting related fields (users, meeting items)
	getMeeting();
	
	// Performs a node retrieve on the project. After it is retrieved, it populates the UI with all project related fields (groups, group users)
	getProject();
	
	// Performs a node retrieve on the user items. After it is retrieved, it populates the UI with all the user items
	getUserItems();
	
		// Performs a node retrieve on the user items. After it is retrieved, it populates the UI with all the user items
	getGroupItems();
	
	
	$(".logout").fastClick(function() {
		window.location = "default.html";
	});
			
	$("#editGroupButton").fastClick(function() {
		$("#groupList").children().not("#groupsHeader").each(function() {
			console.log($(this).html());
		
		});
	});
	
	// Detects if user presses enter in the new group group box.
    $("#createGroupLabel").keypress(function (e) {
        if (e.which == 10 || e.which == 13) {
            newGroup($('#createGroupLabel').val());
        }
    });

});


// Everything to do with elements in the workspace goes here
$("#workspace").live('pageinit', function() {
	console.log("Workspace");
		
	refreshListview('#workspaceList');
	
});

// Will ensure the surveys are refreshed everytime the workspace page
$("#workspace").live('pagebeforeshow', function() {

	// Adds the Loading item and refreshes it so we can see it while loading
	//$("#workspaceList").append("<li id='loadingWorkspace'><a>Loading Items...</a></li>");
	refreshListview('#workspaceList');
	
	PS.ajax.surveyIndex(refreshSurveys);
});


// Everything to do with elements in the workspace goes here
$("#queue").live('pageinit', function() {
	console.log("Queue");
	populateSampleQueue();
	refreshListview('#queueList');
	
});


//Swiping to change pages code. Could be coded cleaner

$("#participants").live("swiperight", function () {
	$.mobile.changePage($("#sharedScreen"), {transition: "slide",reverse:true});
});
$("#participants").live("swipeleft", function () {
	$.mobile.changePage($("#workspace") , {transition: "slide"});
});

$("#workspace").live("swiperight", function () {
	$.mobile.changePage($("#participants"), {transition: "slide",reverse:true});
});
$("#workspace").live("swipeleft", function () {
	$.mobile.changePage($("#queue") , {transition: "slide"});
});

$("#queue").live("swiperight", function () {
	$.mobile.changePage($("#workspace"), {transition: "slide",reverse:true});
});
$("#queue").live("swipeleft", function () {
	$.mobile.changePage($("#map") , {transition: "slide"});
});

$("#map").live("swiperight", function () {
	$.mobile.changePage($("#queue"), {transition: "slide",reverse:true});
});
$("#map").live("swipeleft", function () {
	$.mobile.changePage($("#sharedScreen") , {transition: "slide"});
});

$("#sharedScreen").live("swiperight", function () {
	$.mobile.changePage($("#map"), {transition: "slide",reverse:true});
});
$("#sharedScreen").live("swipeleft", function () {
	$.mobile.changePage($("#participants") , {transition: "slide"});
});





$("#queue").live("pageshow", function() {
	refreshListview('#queueList');
});
	
// Everything to do with elements in the workspace goes here
$("#map").live('pageinit', initializeGoogleMap);

// Everything to do with elements in the workspace goes here
$("#sharedScreen").live('pageinit', function() {
	console.log("Shared Screen");
});
	
// Everything to do with elements in the workspace goes here
$("#participants").live('pageinit', function() {
	console.log("Participants");
	refreshListview('#participantList');
});

// When the new group dialog is shown, it automagically focuses the textbox
$("#newgroupDialog").live("pageshow", function() {
	$("#createGroupLabel")[0].focus();
});

// Saves the li to selectedItem to be used later on
$("#participantList li, #workspaceList li, #queueList li").live("click", function() {
	selectedItem = $(this);
	
	// Change header to be more approprate for the item that was clicked on
	$(".dialogHeader").text(selectedItem.text());
});

// When clicking on an item from the group dialog that isn't a header, this gets called. It formats the string to get rid of trailing spaces and then adds the user to the selected group.
$(".groupListPop li:not([data-role='list-divider'])").live("click", function() {
	selectedGroup = $(this);

	var userID = $(selectedItem).attr("uid")
	var groupID = $(selectedGroup).attr("nid")

	PS.ajax.addUserToGroup(function () {
		var text = selectedGroup.text();
		var text2 = text.substring(0,text.length-1);
		addUserToGroup(selectedItem.text(),text2);
	
	}, function() { console.log("Failed to Add User to Group"); }, userID, groupID);
	
	// Go back 2 dialog boxes (to the main screen)
	window.history.go(-2);
	
});

// A fix to an error I was having if I tried to refresh the dialog list
$('#addToGroupDialog').live('pagecreate pagebeforeshow', function (event) {

	var $the_ul = $('.groupListPop');
	if ($the_ul.hasClass('ui-listview')) {
		$the_ul.listview('refresh');
	} else {
		$the_ul.trigger('create');
	}
});

// A fix to an error I was having if I tried to refresh the dialog list
$('#addToGroupDialog').live('pageshow', function (event) {
	$('.groupListPop').listview("refresh");
	refreshListview('.groupListPop');
});

// Hiding function
$(".group").live("click", function() {
	// .hidden is used for when adding users to a group. If a user is added to a group that is hidden, the users is hidden
	if($(this).hasClass("hidden")) {
		$(this).removeClass("hidden");
	} else {
		$(this).addClass("hidden");
	}
	
});

$(".ui-li-divider").live("click", function() {
	// Goes from the item clicked up until the next divider and toggles visibility
	$(this).nextUntil(".ui-li-divider").toggle();
});

// Callback for when the account logged in has been retrieved. accountJSON stores this information
function getUserCallback() {	
	$(".htext").text(accountJSON.name +"'s Items");
}

// Callback for when the account that is logged in item's have been retrieved. xml stores this information
function getUserItemsCallback(xml) {

}

// Callback for when the project has been retrieved. projectJSON stores this information
function getProjectCallback() {

}

// Callback for when the meeting has been retrieved. meetingJSON stores this information
function getMeetingCallback() {

}

//Callback for when the group items have been retrieved and added
function getGroupItemsCallback() {

}

function createWorkspaceAccordion(name, className) {
	$("#workspaceList").append("<li data-role='list-divider' class='" + className + "'>" + name + "'s Items<div class='ui-li-count'>0</div></li>");
	refreshListview('#workspaceList');
}

function createUser(name, id) {
	$("#participantList").append("<li uid='" + id + "'><a data-rel='dialog' data-transition='pop' href='#participantDialog'>" + name + "</a></li>");
	refreshListview('#participantList');
}

// Ajax call passed and adding recieved users
function populateParticipants(json) {
	loadParticipants(json);
}

// Not administrator and so populating with default users
function populateFailed() {
	populateSampleUsers();
	
	// Removes loading animation item
	$("#loading").remove();
	refreshListview('#participantList');

}

function refreshListview(object) {
	if ($(object).hasClass('ui-listview')) {
		// This listview has already been initialized, so refresh it
		$(object).listview('refresh');
	}
}
 
function newGroupAjax(groupName) {

	// Does not add group if name is blank
	if(groupName != "") {
		PS.ajax.groupCreate(function (json) {
			newGroup1(groupName, json.nid);
		}, function() { console.log("Failed to create group '"+ groupName + "'"); }, groupName , accountJSON.uid, projectJSON.nid);
	}
}
 
function newGroup1(groupName, id) { newGroup(groupName, id); }
function newGroup(groupName, id) {

		// Append new group to both the visible group list, as well as the dialog box when adding user to group
		$("#groupList").append("<li nid='" + id + "' class='group' data-role='list-divider'><div class='name'>"+ groupName + "</div><div class='ui-li-count'>0</div></li>");
		$(".groupListPop").append("<li nid='" + id + "' ><a>"+ groupName + "</a></li>");
		
		// jQuery Mobile - Added proper CSS to newly added item
		refreshListview('#groupList');
				
		// Clear text field
		$("#createGroupLabel").val("");
};

function deleteUser() {
	// Slice out selected item and remove it
	$("#participantList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
	
	// Close dialog
	$('.ui-dialog').dialog('close');
	
	// Refresh styling
	refreshListview('#participantList');
};

function deleteItem() {
	// Slice out selected item and remove it
	$("#workspaceList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
};

function deleteQueueItem() {
	// Slice out selected item and remove it
	$("#queueList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
};

function addUserToGroup(name, groupName, id) {
	// Goes through all the .name in #groupList and checks to see if it matches the groupName parameter. If it does, then it adds the user to the group
	$("#groupList li .name").each(function(index) {
		if(groupName == $(this).text()) {
			var style="";
			
			// If the group is hidden, then the user that is added is also hidden
			if($(this).parent().hasClass("hidden")) {
				style = "style='display:none;'";
			}
			
			// Appends the user after the header
			$(this).parent().after("<li uid='" + id + "'" + style +">"+name+"</li>");
			
			// Increases the count of the group by 1
			var count = parseInt($(this).parent().find(".ui-li-count").text()) + 1;
			
			// Updates html
			$(this).parent().find(".ui-li-count").text(count);
			
			// Refreshes list
			refreshListview('#groupList');
		}
	});	
};

// TODO, add items to different lists
function createItem(type, link, name, target) {

	// Increases the count of the group by 1
	var count = parseInt($(target).find(".ui-li-count").text()) + 1;
	
	// Updates html
	$(target).find(".ui-li-count").text(count);
	
	// data-filtertext = when using the filter bar, it filters by this text. Currently it filters by type (survey, image, document, etc ...) and the item name.
    $(target).after("<li data-filtertext='"+ name + " " + type + "' type=" + type + " title = '" + name + "'><a data-rel='dialog' data-transition='pop' href='#workspaceDialog' linkURL='" + link + "'>" + name + "</a></li>");
	refreshListview('#workspaceList');
};

function changeOpenFile(url) {
	$("#open_canvas").attr("data",url);
};

function refreshSurveys(json, textStatus, jqXHR) {
	
	// Does the callback in model.js and then refreshes
	PS.model.getSurveysCallback(json,textStatus,jqXHR);
	refreshListview('#workspaceList');
}

function addToQueue() {
	// Creates queue item based off the text and link
	createQueueItem(selectedItem.text(),$(selectedItem).find("a").attr("linkurl"), $(selectedItem).attr("type"));
	
	// Tweets
	PS.ajax.tweet("facetmeeting321","queue",accountJSON.name,$(selectedItem).attr("type"), selectedItem.text() );
	
	// Changes header of the shared screen page
	$("#sharedScreenHeader").text(selectedItem.text());
	
	// Closes Dialog box
	$('.ui-dialog').dialog('close');

}

function createQueueItem(name, link, type) {
	$("#queueList").append("<li linkurl='" + link + "' type='"+ type +"'><a data-rel='dialog' data-transition='pop' href='#queueDialog' linkURL='" + link + "'>" + name + "</a></li>");
}

function sendToSharedScreen() {
	// Grabs the linkURL from the selected item and sets it as the data of the shared_canvas object
	$("#shared_canvas").attr("data", $(selectedItem).attr("linkURL"));	
	
	// Deletes the item from the queue
	deleteQueueItem();
	
	// Changes page to the newly changed shared screen
	$.mobile.changePage($("#sharedScreen"));
	
	// Tweets
	PS.ajax.tweet("facetmeeting321","shared screen",accountJSON.name,$(selectedItem).attr("type"), selectedItem.text() );
	
}
