"use strict";

// setup

PS.ajax = {};

if( typeof phpServer === 'undefined') {
	PS.useReverseProxy = true;
}
else {
	PS.useReverseProxy = false;
}

PS.ajax.getServerPrefix = function() {
	if(PS.useReverseProxy) {

		return "http://localhost:81/facet/";
	}
	else {
		return phpServer;
	}
}


// ajax calls
/***** User *****/

//TODO: Local check that user is logged in before accessing secured methods
//Unsecured: login, create
//Secured: logout, index, update, everything else ... ?

PS.ajax.userLogin = function (username, password, callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/login",
		dataType: "json",
		success: function(data, textStatus, jqXHR) { PS.ajax.setCookie(data, textStatus, jqXHR); callback(data, textStatus, jqXHR); },
		data: {username: username, password: password}
		
	});
}

PS.ajax.userLogout = function (callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/logout/",
		dataType: "json",
		success: callback, // TODO: Delete cookie after logging out.
	});
}

//Not an ajax call, just a local utility function. 
//TODO: Only needs to be called when using reverse proxy for local development ... 
PS.ajax.setCookie = function (data, textStatus, jqXHR) {
		session = data;
		var today = new Date();
		var expire = new Date();
		expire.setTime(today.getTime() + 3600000*24*30); // 30 days
		document.cookie = session.session_name+"="+escape(session.sessid)
			+ ";expires="+expire.toGMTString();
}
    
PS.ajax.userRetrieve = function(userId, callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
	});
}

PS.ajax.userCreate = function(username, email, password, callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "restfacet/user/",
		dataType: "json",
		success: callback,
		data: {name: username, mail:email, pass: password}, // all three required
	});
}


PS.ajax.userUpdate = function(userId, data, callback) {
	$.ajax({
		type: "PUT",
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
		data: data,
	});
}


PS.ajax.userDelete = function(userId, callback) {
	$.ajax({
		type: "DELETE", 
		url: PS.ajax.getServerPrefix() + "restfacet/user/" + userId,
		dataType: "json",
		success: callback,
	});
}


PS.ajax.userIndex(event, callback) {
	$.ajax({
		type: "GET", // or PUT or DELETE, oddly enough
		url: PS.ajax.getServerPrefix() + "restfacet/user/",
		dataType: "json",
		success: callback,
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



/***** Nodes *****/
//TODO: Drupal rest also supports node functions... do we need these?


PS.ajax.nodeIndex(callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
	});
}










