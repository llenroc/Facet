"use strict";

// setup

PS.ajax = {};

if(location.hostname === "facetsurvey.4abyte.com") {
	PS.useReverseProxy = false;
}
else {
	PS.useReverseProxy = true;
}

PS.ajax.getServerPrefix = function() {
	if(PS.useReverseProxy) {

		return "http://" + location.hostname + ":81/facet/";
	}
	else {
		return "http://" + location.hostname + "/";
	}

}


// ajax calls
/***** User *****/

//TODO: Local check that user is logged in before accessing secured methods
//Unsecured: login, create
//Secured: logout, index, update, everything else ... ?

PS.ajax.userLogin = function (username, password, callback , errorCallback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/login",
		dataType: "json",
		success: function(data, textStatus, jqXHR) { PS.ajax.setCookie(data, textStatus, jqXHR); PS.ajax.setCookieData("loggedIn","true",365); PS.ajax.setCookieData("id",data.user.uid,365); callback(data, textStatus, jqXHR); },
		error: errorCallback,
		data: {username: username, password: password}
		
	});
}

PS.ajax.userLogout = function (callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/logout/",
		dataType: "json",
		success: function (data, textStatus, jqXHR) {PS.ajax.clearCookies(); callback(data, textStatus, jqXHR);},
	});
}


//Not an ajax call, just a local utility function. 
//TODO: Only needs to be called when using reverse proxy for local development ... 
PS.ajax.setCookie = function (data, textStatus, jqXHR) {
		var session = data;
		var today = new Date();
		var expire = new Date();
		expire.setTime(today.getTime() + 3600000*24*30); // 30 days
		document.cookie = session.session_name+"="+escape(session.sessid)
			+ ";expires="+expire.toGMTString() + "; path=/";
}

// c_name is the name of the field. Example - "username"
// value is the value of the field. Example - "Daniel"
// exdays is the number of days from now for the cookie to expire. Example - 365
PS.ajax.setCookieData = function(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}


PS.ajax.clearCookies = function() {
	var cookies = document.cookie.split( ';' );
		for ( var i = 0; i < cookies.length; i++ ) {
			var cookieParts = cookies[i].split("=");
			document.cookie = cookieParts[0] + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}  
}


// Requires administrator powers, for accounts other than your own
PS.ajax.userRetrieve = function(userId, callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
		error:errorCallback,
	});
}


PS.ajax.userCreate = function(username, email, password, callback, errorCallback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/",
		dataType: "json",
		success: function(data, textStatus, jqXHR) { PS.ajax.setCookie(data, textStatus, jqXHR); callback(data, textStatus, jqXHR); },
        error: errorCallback,
		data: {name: username, mail:email, pass: password}, // all three required
	});
}


// data should be an object, with key/value pairs for each field to be updated
PS.ajax.userUpdate = function(userId, data, callback, errorCallback) {
	$.ajax({
		type: "PUT",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
		data: data,
		error: errorCallback,
	});
}

// Requires administrator powers
PS.ajax.userDelete = function(userId, callback, errorCallback) {
	$.ajax({
		type: "DELETE", 
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
		error: errorCallback,
	});
}

// Requires administrator powers
PS.ajax.userIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET", // or PUT or DELETE, oddly enough
		url: PS.ajax.getServerPrefix() + "restfacet/user/",
		dataType: "json",
		success: callback,
		error: errorCallback
	});
}




/***** Survey *****/

PS.ajax.surveyIndex = function(callback) { // getSurveys
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "json-services/",
		dataType: "json",
		success: callback
	});
};


PS.ajax.surveyRetrieve = function(surveyId, callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "json-services/" + surveyId,
		dataType: "json",
		success: callback
	});
};



/***** Node *****/
// Since the 4abyte objects are all nodes, we can use certain generic functions.

// Node index, generally not useful.
PS.ajax.nodeIndex = function(callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
	});
}

//PS.ajax.nodeCreate

PS.ajax.nodeRetrieve = function(callback, errorCallback, id) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/node/" + id,
		dataType: "json",
		success: callback,
		error: errorCallback,
	});
}


// NB : For one reason or another, this only works if you have the type field set in data
// and it must be the same as the type the node is (ie, you cannot change node type)
PS.ajax.nodeUpdate = function(callback, errorCallback, id, data) {
	$.ajax({
		type: "PUT",
		url: PS.ajax.getServerPrefix() + "restfacet/node/" + id,
		dataType: "json",
		success: callback,
		error: errorCallback,
		data: data,
	});
}

PS.ajax.nodeDelete = function(callback, errorCallback, id) {
	$.ajax({
		type: "DELETE",
		url: PS.ajax.getServerPrefix() + "restfacet/node/" + id,
		dataType: "json",
		success: callback,
		error: errorCallback,
	});
}


/***** Twitter *****/

PS.ajax.tweet = function(hashtag,location,name,type,filename) {
	
	switch(type) {
		case 'youtube':
			type = "a YouTube video";
			break;
		case 'googlemap':
			type = "a Google Map";
			break;
		case 'image':
			type = "an image";
			break;
		case 'pdf':
			type = "a PDF file";
			break;
		case 'audio':
			type = "an audio file";
			break;
		case 'image':
			type = "an image";
			break;
		case 'results':
			type = "survey results";
			break;
		default:
			type = "a " + type;
	}
	
	$.ajax({
		type: "POST",
		url:  "tweetMessage.php?hashtag="+hashtag+"&location="+location+"&name="+name+"&type="+type+"&filename="+filename,
		success: function(){

		},
		error: function(){
			alert("Twitter Call Failed!");
		}
    });
}



/***** PublicSquare Objects *****/
//NB: There is basically no type checking or validity checking on the server site. And as of this writing, next to none on the client either. Here be dragons.

//Technically, you can set relationships like any other attribute using the below defined update functions. This is not a good idea. Use the relationship functions instead. 

// Helper functions
PS.ajax.wrapNodeId = function (input) {
	return "[nid:" + input + "]";
}

PS.ajax.wrapUserId = function (input) {
	return "[uid:" + input + "]";
}


// Since many functions use essentially the same ajax call, this is used and tiny bits of the URL are replaced
PS.ajax.index = function(indexType, callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/" + indexType,
		success: callback,
		error: errorCallback,
	});	
}

PS.ajax.retrieve = function(retrieveType, nid, callback, errorCallback) {
	$.ajax({
	type: "GET",
	url: PS.ajax.getServerPrefix() + "services-xml/" + retrieveType + "/" + nid,
	success: callback,
	error: errorCallback,
	});
}

// Project
PS.ajax.projectIndex = function(callback, errorCallback) {
	PS.ajax.index("project", callback, errorCallback);
}

// name	: The name of the project
// userNodeId: 	the userNode for a user who will own this project
PS.ajax.projectCreate = function(callback, errorCallback, name, userNodeId) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,	
		data: {	title: name, 
				type: 'project', 
				'field_project_name[und][0][value]': name ,
				'field_project_owners[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
				'field_project_users[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
			}
	});
}
PS.ajax.projectRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.projectUpdate = PS.ajax.nodeUpdate;
PS.ajax.projectDelete = PS.ajax.nodeDelete;

// Meeting

PS.ajax.meetingIndex = function(callback, errorCallback) {
	PS.ajax.index("meeting", callback, errorCallback);
}


// userNodeId: the userNode for a user who will own this meeting
// projectId: id of the project node that owns the meeting
// date, startTime, endTime, hashTag: strings
PS.ajax.meetingCreate = function(callback, errorCallback, name, userNodeId, projectId, hashTag) {
	var date = new Date();	
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		data: { title: name, 
				type: 'meeting',
				'field_meeting_name[und][0][value]': name ,
				'field_meeting_owners[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
				'field_meeting_users[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
                'field_meeting_owning_project[und][0][nid]': PS.ajax.wrapNodeId(projectId),			
				'field_meeting_date[und][0][value]': date.toDateString(),
				'field_meeting_start_time[und][0][value]': date.getTime(),
				'field_meeting_hashtag[und][0][value]': hashTag,
		}
	});	 
}
PS.ajax.meetingRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.meetingUpdate = PS.ajax.nodeUpdate;
PS.ajax.meetingDelete = PS.ajax.nodeDelete;


// Group

PS.ajax.groupIndex = function(callback, errorCallback) {
	PS.ajax.index("group", callback, errorCallback);
}

// name : Name of group
// userNodeId : uid of the user owner
// projectId : nid of the owning project
PS.ajax.groupCreate = function(callback, errorCallback, name, userNodeId, projectId) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: function(json, textStatus, jqXHR) { 
			// After creating the group, we must also update the project as well
			PS.ajax.addGroupToProject(callback, errorCallback, json.nid, projectId, json);
		},
        error: errorCallback,
		data: {	title: name, 
				type: 'group',
				'field_group_name[und][0][value]': name ,
				'field_group_owners[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
				'field_group_owning_project[und][0][nid]': PS.ajax.wrapNodeId(projectId),
		}
	});	
}
PS.ajax.groupRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.groupUpdate = PS.ajax.nodeUpdate;
PS.ajax.groupDelete = function(callback, errorCallback, groupId, projectId) {
	$.ajax({
		type: "DELETE",
		url: PS.ajax.getServerPrefix() + "restfacet/node/" + groupId,
		dataType: "json",
		success: function(json, textStatus, jqXHR) {
			PS.ajax.removeGroupFromProject(callback, errorCallback, groupId, projectId);
		},
		error: errorCallback,
	});

}

// Item

PS.ajax.itemIndex = function(callback, errorCallback) {
	PS.ajax.index("item", callback, errorCallback);
}

//userNodeId: node id for the user that created and initially owns the item
//TODO: Add support for item type. item may need to have a new node reference field added to refer to arbitrary external nodes ... as well as additional fields for the text item types (comment, question, note/annotation)
PS.ajax.itemCreate = function(callback, errorCallback, name, type ,userNodeId, url) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		data: {	title: name, 
				type: 'item',
				'field_item_name[und][0][value]': name ,
				'field_item_id_owner[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
				'field_item_id_creator[und][0][uid]': PS.ajax.wrapUserId(userNodeId),
				'field_item_creation_timestamp[und][0][value]': new Date().getTime(),
				'field_item_shared_timestamp[und][0][value]': '',
				'field_item_type[und][0][value]': type,
				'field_item_url[und][0][value]': url,
				
		}
	});		
}
PS.ajax.itemRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.itemUpdate = PS.ajax.nodeUpdate;
PS.ajax.itemDelete = PS.ajax.nodeDelete;


/***** PublicSquare Relationships *****/
// 'REST' methods available for each relationship: create, delete, one-way index.
// create/delete are implemented by an update to the object in the relation that 'owns' the relation: the update to the object having the field that refers to the other object.
// NB / TODO: Because relations are implemented as arrays, and creation/deletion is done with array indices, these operations are NOT safe for concurrent operations. 
// NB: services-xml calls are not handled by drupal services, they ignore dataType and return only xml

//TODO: Convenience function to decode relation members from objects



//user_project_member
// Given a userNodeId, returns an xml document containing the projects the user is a member of
PS.ajax.indexUserProjects = function(callback, errorCallback, userNodeId) {
	PS.ajax.index("project/user/" + userNodeId, callback, errorCallback);
}
PS.ajax.addProjectUser = function(callback, errorCallback, userNodeId, projectId) {	
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {					
			var data = {};
			data.type = "project";
			if (json.field_project_users.und.length === undefined) {
				data['field_project_users[und][0][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
			else {
				data['field_project_users[und][' + String(json.field_project_users.und.length) + '][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
	
			PS.ajax.nodeUpdate(callback, errorCallback, projectId, data);	
		},
		errorCallback,
		projectId
	);
}
PS.ajax.removeProjectUser = function(callback, errorCallback, userNodeId, projectId) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {			
			//get the list of userNodeIds, buried in the response object
			var users = json.field_project_users.und;
		
			//search for one matching the userNodeId to be removed
			for(var i = 0; i < users.length; i += 1) { 
				if(Number(users[i].uid) === userNodeId) {
					var data = {};
					data.type = "project";
					data['field_project_users[und][' + String(i) + '][uid]'] = "";
					PS.ajax.nodeUpdate(callback, errorCallback, projectId, data);
					break;
				}
			}
			//TODO: we tried to remove a user that wasn't a member to begin with. We should throw an error of some sort here.
		},
		errorCallback,
		projectId
	);	
}

// Given a uid, returns xml of all items the user has
PS.ajax.indexUserItems = function(callback, errorCallback, userNodeId) {
	PS.ajax.index("item/owner/" + userNodeId, callback, errorCallback);
}

//user_meeting_member
PS.ajax.indexUserMeetings = function(callback, errorCallback, userNodeId) {
	PS.ajax.index("meeting/user/" + userNodeId, callback, errorCallback);
}

PS.ajax.indexUserGroups = function(callback, errorCallback, userNodeId) {
	PS.ajax.index("group/user/" + userNodeId, callback, errorCallback);
}

PS.ajax.addMeetingUser = function(callback, errorCallback, userNodeId, meetingId) {	
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {					
			var data = {};
			data.type = "meeting";
			
			
			if (json.field_meeting_users.und === undefined) {
				data['field_meeting_users[und][0][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
			else {
				data['field_meeting_users[und][' + String(json.field_meeting_users.und.length) + '][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
			
			PS.ajax.nodeUpdate(callback, errorCallback, meetingId, data);	
		},
		errorCallback,
		meetingId
	);
}
PS.ajax.removeMeetingUser = function(callback, errorCallback, userNodeId, meetingId) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {			
			//get the list of userNodeIds, buried in the response object
			var users = json.field_meeting_users.und;
		
			//search for one matching the userNodeId to be removed
			for(var i = 0; i < users.length; i += 1) { 
				if(Number(users[i].uid) === userNodeId) {
					var data = {};
					data.type = "meeting";
					data['field_meeting_users[und][' + String(i) + '][uid]'] = "";
					PS.ajax.nodeUpdate(callback, errorCallback, meetingId, data);
					break;
				}
			}
			//TODO: we tried to remove a user that wasn't a member to begin with. We should throw an error of some sort here.
		},
		errorCallback,
		meetingId
	);	
}

PS.ajax.addGroupToProject = function(callback, errorCallback, groupNodeId, projectNodeId, json2) {
	PS.ajax.nodeRetrieve( function(json) {
		var data = {};
		data.type = "project";
		
		
		if (json.field_project_groups.und === undefined) {
			data['field_project_groups[und][0][nid]'] = PS.ajax.wrapNodeId(groupNodeId);
		}
		else {
			data['field_project_groups[und][' + String(json.field_project_groups.und.length) + '][nid]'] = PS.ajax.wrapNodeId(groupNodeId);
		}
			
		PS.ajax.nodeUpdate(callback(json2), errorCallback, projectNodeId, data);	
	
	}, errorCallback, projectNodeId);
}

PS.ajax.removeGroupFromProject = function(callback, errorCallback, groupNodeId, projectNodeId) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {			
			//get the list of groupNodeIds, buried in the response object
			var groups = json.field_project_groups.und;
		
			//search for one matching the userNodeId to be removed
			for(var i = 0; i < groups.length; i += 1) { 
				if(Number(groups[i].nid) == groupNodeId) {
					var data = {};
					data.type = "project";
					data['field_project_groups[und][' + String(i) + '][nid]'] = "";
					PS.ajax.nodeUpdate(callback, errorCallback, projectNodeId, data);
					break;
				}
			}
		},
		errorCallback,
		projectNodeId
	);	
}

PS.ajax.removeUserFromGroup = function(callback, errorCallback, groupNodeId, userID) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {			
			//get the list of userIds, buried in the response object
			var users = json.field_group_users.und;
		
			//search for one matching the userNodeId to be removed
			for(var i = 0; i < users.length; i += 1) { 
				if(Number(users[i].uid) == userID) {
					var data = {};
					data.type = "group";
					data['field_group_users[und][' + String(i) + '][uid]'] = "";
					PS.ajax.nodeUpdate(callback, errorCallback, groupNodeId, data);
					break;
				}
			}
		},
		errorCallback,
		groupNodeId
	);	
}

PS.ajax.addUserToGroup = function(callback, errorCallback, userNodeId, groupID) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {					
			var data = {};
			data.type = "group";
			
			if (json.field_group_users.und === undefined) {
				data['field_group_users[und][0][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
			else {
				data['field_group_users[und][' + String(json.field_group_users.und.length) + '][uid]'] = PS.ajax.wrapUserId(userNodeId);
			}
			
						
			PS.ajax.nodeUpdate(function() {PS.model.groups[json.nid] = json.nid; callback(json,textStatus, jqXHR)}, errorCallback, groupID, data);
		},
		errorCallback,
		groupID
	);
}

PS.ajax.updateSharedScreen = function(callback, errorCallback, meetingID, SSnid) {
	var data = {};
	data.type = "meeting";
	data['field_meeting_active_item[und][0][nid]'] = PS.ajax.wrapNodeId(SSnid);
	PS.ajax.nodeUpdate(callback, errorCallback, meetingID, data);
}

PS.ajax.shareWith = function(callback, errorCallback, itemID, shareToID, shareToType) {
	PS.ajax.nodeRetrieve(function(json, textStatus, jqXHR) {

		var data = {};
		data.type = shareToType;
		
		var items;
		var s = "s";
		
		switch(shareToType) {
			case 'group': items = json.field_group_items.und; break;
			case 'project': items = json.field_project_item.und; s = ""; break; // Called item instead of items in project, so we must account for it later
			case 'meeting': items = json.field_meeting_items.und; break;			
		}
		
		if (items === undefined) {
			data['field_' + shareToType + '_item' + s + '[und][0][nid]'] = PS.ajax.wrapNodeId(itemID);
		}
		else {
			data['field_' + shareToType + '_item' + s + '[und][' + String(items.length) + '][nid]'] = PS.ajax.wrapNodeId(itemID);
		}	
		PS.ajax.nodeUpdate(callback, errorCallback, shareToID, data);
			
		},
	errorCallback,
	shareToID
	);	

}

PS.ajax.shareWithGroup = function(callback, errorCallback, itemID, groupID) {
	PS.ajax.shareWith(callback, errorCallback, itemID, groupID, "group");
}

PS.ajax.shareWithProject = function(callback, errorCallback, itemID, projectID) {
	PS.ajax.shareWith(callback, errorCallback, itemID, projectID, "project");
}

PS.ajax.shareWithMeeting = function(callback, errorCallback, itemID, meetingID) {
	PS.ajax.shareWith(callback, errorCallback, itemID, meetingID, "meeting");
}

PS.ajax.shareWithUser = function(callback, errorCallback, itemID, userID) {
	PS.ajax.nodeRetrieve(function(json, textStatus, jqXHR) {
		var data = {}; 
		data.type = "item";
		var users = json.field_item_id_owner.und;
		
		if (users === undefined) {
			data['field_item_id_owner[und][0][uid]'] = PS.ajax.wrapUserId(userID);
		}
		else {
			data['field_item_id_owner[und][' + String(users.length) + '][uid]'] = PS.ajax.wrapUserId(userID);
		}	
		
		PS.ajax.nodeUpdate(callback, errorCallback, itemID, data);
			
	}, errorCallback, itemID);
}

PS.ajax.addToQueue = function(callback, errorCallback, itemID, meetingID) {
	PS.ajax.nodeRetrieve(function(json,textStatus,jqXHR) {
		var data = {};
		data.type = "meeting";
		
		var queue = json.field_meeting_queue.und;
		
		if (queue === undefined) {
			data['field_meeting_queue[und][0][nid]'] = PS.ajax.wrapNodeId(itemID);
		}
		else {
			data['field_meeting_queue[und][' + String(queue.length) + '][nid]'] = PS.ajax.wrapNodeId(itemID);
		}	
		
		PS.ajax.nodeUpdate(callback, errorCallback, meetingID, data);
	}, errorCallback, meetingID);
}

PS.ajax.removeQueueItem = function(callback, errorCallback, itemID, meetingID) {
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {			
			//get the list of userIds, buried in the response object
			var queue = json.field_meeting_queue.und;
			var data = {};
			data.type = "meeting";
			PS.ajax.nodeUpdate(callback, errorCallback, meetingID, prepareQueueDataForRemoving(data,queue, itemID));
		},
		errorCallback,
		meetingID
	);	
}

PS.ajax.arrangeQueue = function(callback, errorCallback, meetingID, data2) {
	PS.ajax.nodeRetrieve(function(json,textStatus,jqXHR) {
		var queue = json.field_meeting_queue.und;
		var data = {};
		data.type = "meeting";
		
		if(queue === undefined) {
			data['field_meeting_queue[und][0][nid]'] = PS.ajax.wrapNodeId(data2[0]);
		} else {
			var x = queue.length;
			var i;
		
			for(i = 0; i < data2.length; i++) {
				data['field_meeting_queue[und][' + String(i) + '][nid]'] = PS.ajax.wrapNodeId(data2[i]);
			}
			
			for(i=i; i<x; i++) {
				data['field_meeting_queue[und][' + String(i) + '][nid]'] = "";		
			}
		}
	
		console.log(data);
		PS.ajax.nodeUpdate(callback, errorCallback, meetingID, data);
	
	}, errorCallback, meetingID);
}

// Error occured when updating shared screen. It was trying to both remove queue item and update active item in different calls
// This caused issues so we're doing it in one call now.
// Internal function
function prepareQueueDataForRemoving(data, queue, itemID) {
	//search for one matching the userNodeId to be removed
	for(var i = 0; i < queue.length; i += 1) { 
		if(Number(queue[i].nid) == itemID) {
			data['field_meeting_queue[und][' + String(i) + '][nid]'] = "";
			break;
		}
	}
	return data
}



//user_group_member

//user_project_owner // field_owners
//user_meeting_owner
//user_group_owner

//user_project_observer
//user_meeting_observer
//user_group_observer

//item_creator
//item_owner

//meeting_queue
//meeting_active_item
//item_payload
//project_group
//project_meeting








