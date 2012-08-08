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
PS.ajax.userRetrieve = function(userId, callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
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
PS.ajax.userUpdate = function(userId, data, callback) {
	$.ajax({
		type: "PUT",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
		data: data,
	});
}

// Requires administrator powers
PS.ajax.userDelete = function(userId, callback) {
	$.ajax({
		type: "DELETE", 
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
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

PS.ajax.nodeUpdate = function(callback, errorCallback, id, data) {
	$.ajax({
		type: "PUT",
		url: PS.ajax.getServerPrefix() + "restfacet/node/" + id,
		dataType: "json",
		success: callback,
		error: error,
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
	$.ajax({
		type: "POST",
		url:  "tweetMessage.php?hashtag="+hashtag+"&location="+location+"&name="+name+"&type="+type+"&filename="+filename,
		success: function(){

		},
		error: function(){
			// code
			console.log("Twitter call failed!");
		}
    });
}



/***** PublicSquare Objects *****/
//NB: There is basically no type checking or validity checking on the server site. And as of this writing, next to none on the client either. Here be dragons.

//Technically, you can set relationships like any other attribute using the below defined update functions. This is not a good idea. Use the relationship functions instead. 

// Helper functions
PS.ajax.wrapNodeId(input) {
	return "[nid:" + input + "]" 
}



// Project
PS.ajax.projectIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/project",
		dataType: "json",
		success: callback,
		error: errorCallback,
	});	
}
// userNodeId: the userNode for a user who will own this project
PS.ajax.projectCreate = function(callback, errorCallback, name, userNodeId) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		type: 'project'
		data: {name: name, 'field_owners[und][0][nid]': PS.ajax.wrapNodeId(userNodeId)}
	});
}
PS.ajax.projectRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.projectUpdate = PS.ajax.nodeUpdate;
PS.ajax.projectDelete = PS.ajax.nodeDelete;



// Meeting
PS.ajax.meetingIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/meeting",
		dataType: "json",
		success: callback,
		error: errorCallback,
	});		
}
// userNodeId: the userNode for a user who will own this meeting
// projectId: id of the project node that owns the meeting
// date, startTime, endTime, hashTag: strings
PS.ajax.meetingCreate = function(callback, errorCallback, name, userNodeId, projectId, date, startTime, endTime, hashTag) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		type: 'meeting'
		data: {	name: name, 
				'field_meeting_owners[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
                'field_meeting_owning_project[und][0][nid]': PS.ajax.wrapNodeId(projectId),			
				'field_meeting_date[und][0][nid]': date,
				'field_meeting_start_time[und][0][nid]': startTime,
				'field_meeting_end_time[und][0][nid]': endTime,
				'field_meeting_hashtag[und][0][nid]': hashTag,
		}
	});	 
}
PS.ajax.meetingRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.meetingUpdate = PS.ajax.nodeUpdate;
PS.ajax.meetingDelete = PS.ajax.nodeDelete;


// Group
PS.ajax.groupIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/group",
		dataType: "json",
		success: callback,
		error: errorCallback,
	});		
}
PS.ajax.groupCreate = function(callback, errorCallback, name, userNodeId, projectId) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		type: 'group'
		data: {	name: name, 
				'field_group_owners[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
				'field_group_owning_project[und][0][nid]': PS.ajax.wrapNodeId(projectId),
		}
	});	
}
PS.ajax.groupRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.groupUpdate = PS.ajax.nodeUpdate;
PS.ajax.groupDelete = PS.ajax.nodeDelete;

// Item
PS.ajax.itemIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/item",
		dataType: "json",
		success: callback,
		error: errorCallback,
	});		
}
//userNodeId: node id for the user that created and initially owns the item
//createdTime: a string
//TODO: Add support for item type. item may need to have a new node reference field added to refer to arbitrary external nodes ... as well as additional fields for the text item types (comment, question, note/annotation)
PS.ajax.itemCreate = function(callback, errorCallback, name, userNodeId, createdTime) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		type: 'item'
		data: {	name: name, 
				'field_item_id_owner[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
				'field_item_id_creator[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
				'field_item_creation_timestamp[und][0][nid]': createdTime,
				'field_item_shared_timestamp[und][0][nid]': '',
				//'field_item_type[und][0][nid]': 'survey',
		}
	});		
}
PS.ajax.itemRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.itemUpdate = PS.ajax.nodeUpdate;
PS.ajax.itemDelete = PS.ajax.nodeDelete;


// User Node 
PS.ajax.userNodeIndex = function(callback, errorCallback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/user",
		dataType: "json",
		success: callback,
		error: errorCallback,
	});		
}

{userName:'stuff'}

//name: user's full name
//userName: must be the username of an existing user. 
PS.ajax.userNodeCreate = function(callback, errorCallback, name, userName) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
        error: errorCallback,
		type: 'user'
		data: {	name: name, 
				'field_user_name[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
				'field_user_username[und][0][nid]': PS.ajax.wrapNodeId(userNodeId),
				'field_user_logged_in[und][0][nid]': 'absent', // 4abyte specs say this should be 'present' or 'absent'. don't know if there is any logic hooked up to it on their end.
		}
	});			
}
PS.ajax.userNodeRetrieve = PS.ajax.nodeRetrieve;
//PS.ajax.userNodeUpdate = PS.ajax.nodeUpdate;
PS.ajax.userNodeDelete = PS.ajax.nodeDelete;







/***** PublicSquare Relationships *****/
// 'REST' methods available for each relationship: create, delete, one-way index.
// create/delete are implemented by an update to the object in the relation that 'owns' the relation: the an update to hte object having the field that refers to the other object.
// NB / TODO: Because relations are implemented as arrays, and creation/deletion is done with array indices, these operations are NOT safe for concurrent operations. 
// NB: services-xml calls are not handled by drupal services, they ignore dataType and return only xml

//TODO: Convenience function to decode relation members from objects

//user_project_member

PS.ajax.indexUserProjects = function(callback, errorCallback, userNodeId) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "services-xml/project/user/" + userNodeId,
		success: callback,
		error: errorCallback,
	});		
}
PS.ajax.addProjectUser = function(callback, errorCallback, projectId, userNodeId) {
	
	PS.ajax.nodeRetrieve(
		function(json, textStatus, jqXHR) {
		
			data = {};

			PS.ajax.nodeUpdate(callback, errorCallback, projectId, data)
		

		},
		errorCallback,
		projectId,
	);

	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "" + projectId,
		dataType: "json",
		success: callback,
		error: errorCallback,
	});	
}
PS.ajax.removeProjectUser = function(callback, errorCallback, projectId, userNodeId) {
	
}

//user_meeting_member
//user_group_member

//user_project_owner
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








