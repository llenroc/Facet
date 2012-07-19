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

//TODO: Account creation works, but there are two issues. 1) Users are created 'blocked' and 2) the password field seems to be ignored.
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



/***** Nodes *****/
//TODO: Drupal rest also supports node functions... do we need these?


PS.ajax.nodeIndex = function(callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "restfacet/node/",
		dataType: "json",
		success: callback,
	});
}


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









