"use strict";


PS.model = {};

PS.model.surveysList = {};
PS.model.userItems = {};
PS.model.meetingParticipants = {};
PS.model.meetingItems = {};
PS.model.groupItems = {};
PS.model.queue = {};
PS.model.projectItems = {};
PS.model.groups = {};
PS.model.activeItem;
PS.model.hashtag;

PS.model.queueString;
PS.model.meetingItemsString;
PS.model.projectItemsString;
PS.model.meetingParticipantsString;


PS.model.checkProjectItems = function(data) {
	if(PS.model.projectItemsString != data) { 
		if(data.length != 0) {
			var items = data.split("; ");
			for(var i = 0; i < items.length; i++) {
				var data = items[i].split(", ");
				
				if(PS.model.projectItems[data[0]] === undefined) {			
					createItem(data[2], data[3], data[1], ".projectItems", data[0]);
					PS.model.projectItems[data[0]] = items[i];
				}
			}
		}
		
		PS.model.projectItemsString = data;
	}
}

PS.model.checkGroups = function(nids) {
	var groupSplit = nids.split(", ");
	for(var i = 0; i < groupSplit.length; i++) {
		if(groupSplit[i] != "") {		

			// Performs a retrieve to get information about the group			
			PS.ajax.retrieve("group", groupSplit[i], function(xml) {
				var nid = $(xml).find("Nid").text();
				var groupName = $(xml).find("Name").text();
				groupName = (groupName.length != 0) ? groupName : "Group";
			
				if(PS.model.groups[nid] === undefined) {
					newGroup1(groupName, nid);
				}
			
				var data = $(xml).find("User_data").text();
				var userData = data.split("; ");
				if(PS.model.groups[nid] != nid) {
					// There has been a change in the users for a group, detecting who got added and then add them to UI
					// If there are no users in the group, this will fail, otherwise it adds the users
					if (userData[0] != "") {
						for(var x = 0; x < userData.length; x++) {
							var split = userData[x].split(", ");
							
							if(PS.model.groups[nid] === undefined || PS.model.groups[nid].search(split[0]) == -1) {
								addUserToGroup(split[1],groupName, split[0]);
							}
						}
					}
					PS.model.registerGroup(nid,nid);
				}
			
			}, function() { console.log("Failed to Load Group") });					
		}		
	}
}

PS.model.registerGroup = function(nid, data) {
	PS.model.groups[nid] = data;
}

PS.model.checkUserItems = function(xml) {
	//-------------------------Adding Specific User Items----------------------------//
	// Iterates through each item that a user owns and adds them to the workspace
	$(xml).find("node").slice(1).each(function() {
		var nid = $(this).find("Nid").text();
		if(PS.model.userItems[nid] === undefined) {
			var type = $(this).find("Type").text();
			var url = $(this).find("Url").text();
			var name = $(this).find("Name").text();
						
			// if type == "", then type = "unknown", else, type == type
			type = (type == "") ? "unknown" : type;
			url = (url == "") ? "empty.html" : url;
			
			createItem(type, url, name, ".myItems", nid);
			
			PS.model.userItems[nid] = nid + ", " + name + ", " + type + ", " + url;
		}
	});
	//--------------------------------------------------------------------------------//
}

PS.model.checkGroupItems = function(xml) {
	// Iterates through each item that a user owns and adds them to the workspace
	$(xml).find("node").slice(1).each(function() {
		var nid = $(this).find("Nid").text();
		var cssName = makeSafeForCSS($(this).find("Name").text()+nid);
		var data = $(this).find("Items_data").text();
		
		// Group is not being displayed on UI, so we make it so
		if(PS.model.groupItems[nid] === undefined) {			
			createWorkspaceAccordion($(this).find("Name").text(), cssName);
			PS.model.groupItems[nid] = {};
		}
			
		// One or more items in this group has changed
		if(PS.model.groupItems[nid][0] != data) {			
			PS.model.groupItems[nid][0] = data;
			
			if(data.length != 0) {
				var items = data.split("; ");
				for(var i = 0; i < items.length; i++) {
					var data = items[i].split(", ");
					
					if(PS.model.groupItems[nid][data[0]] === undefined) {	
						createItem(data[2], data[3], data[1], "." + cssName, data[0]);
						PS.model.groupItems[nid][data[0]] = items[i];
					}
				}
			}	
		}
	});
}

// Since the Queue has adding, removing, and reordering, when a new item is detected, it completely redraws all queue items
PS.model.checkQueue = function(data) {
	if(PS.model.queueString != data) {
		PS.model.queue = {};
		removeAllQueueItems();
		
		if(data.length != 0) {
			var items = data.split("; ");
			for(var i = 0; i < items.length; i++) {
				var data2 = items[i].split(", ");
				
				if(PS.model.queue[data2[0]] === undefined) {	
					createQueueItem(data2[1], data2[3], data2[2], data2[0]);		
					PS.model.queue[data2[0]] = items[i];
				}
			}
		}
		
		PS.model.queueString = data;
	}
}

PS.model.checkMeetingItems = function(data) {
	if(PS.model.meetingItemsString != data) { 
		if(data.length != 0) {
			var items = data.split("; ");
			for(var i = 0; i < items.length; i++) {
				var data = items[i].split(", ");
				
				if(PS.model.meetingItems[data[0]] === undefined) {			
					createItem(data[2], data[3], data[1], ".meetingItems", data[0]);
					PS.model.meetingItems[data[0]] = items[i];
				}
			}
		}
		
		PS.model.meetingItemsString = data;
	}
}

PS.model.checkMeetingParticipants = function(data) {
	if(PS.model.meetingParticipantsString != data) { 
		if(data.length != 0) {
			var items = data.split("; ");
			for(var i = 0; i < items.length; i++) {
				var data = items[i].split(", ");
				
				if(PS.model.meetingParticipants[data[0]] === undefined) {			
					
					createUser(data[1],data[0]);
					PS.model.meetingParticipants[data[0]] = items[i];
				}
			}
		}
		
		PS.model.meetingParticipantsString = data;
	}
}

PS.model.checkActiveItem = function(nid) {
	// If the server active item is different than the currently displayed one
	if(PS.model.activeItem != nid) {
		changeSharedScreenFromID(nid);
	}	
}

PS.model.checkHashTag = function(hashtag) {
	// Gets hashtag. If it isn't present, a default facetmeeting123 is set
	hashtag = (hashtag.length != 0) ? hashtag : "facetmeeting123";

	if(PS.model.hashtag != hashtag) {
		changeHashtag(hashtag);
	}
}

PS.model.getSurveysCallback = function(json, textStatus, jqXHR) {
	for (var x in json.nodes) {
		//var idsurvey = json.nodes[x].node.URL.split("/").pop();
		var idsurvey = json.nodes[x].node.nodeID;
		var url = "http://facetsurvey.4abyte.com/facetsurvey/" + idsurvey;
		var surveyURLType;
		var surveyType = json.nodes[x].node.Type;
		
		if(surveyType == "Map Poll") { surveyURLType = "surveymaps"; }
		else if(surveyType == "Location Poll") { surveyURLType = "surveymapswindowsl"; }
		else { surveyURLType = "surveyreport"; }
		
		var urlreport = "http://facetsurvey.4abyte.com/" + surveyURLType + "/" + idsurvey;
	
		if (PS.model.surveysList[idsurvey] === undefined) {
			PS.model.surveysList[idsurvey] = json.nodes[x].node;
			
			createItem('survey', url, json.nodes[x].node.Name, ".surveyItems", idsurvey);
			createItem('results', urlreport, json.nodes[x].node.Name + " " + "Results", ".surveyItems", idsurvey);
			
		}
	}
	
	$("#loadingWorkspace").remove();
	
	// Used in mobile to hide long survey lists because of small screen size
	// $(".surveyItems").nextUntil(".ui-li-divider").toggle();
	
}

