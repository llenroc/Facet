"use strict";

// setup

PS.ajax = {};

if( typeof phpServer === 'undefined') {
	PS.useCurlMirror = true;
}
else {
	PS.useCurlMirror = false;
}

PS.ajax.getServerPrefix = function() {
	if(PS.useCurlMirror) {
		return "http://localhost:81/curl.php?request="
	}
	else {
		return phpServer;
	}
}


// ajax calls

PS.ajax.userLogin = function (username, password, callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "http://localhost:81/drupal-7.14/page/user/login/", //replace with actual URL
		dataType: "json",
		success: callback,
		data: {username: username,
		password: password}
		
	});
}




PS.ajax.userLogout = function (callback) {
	$.ajax({
		type: "POST",
		url: PS.ajax.getServerPrefix() + "http://localhost:81/drupal-7.14/page/user/logout/", //replace with actual URL
		dataType: "json",
		success: callback,
	});
}



PS.ajax.getSurveys = function(callback) {
	$.ajax({
		type: "GET",
		url: PS.ajax.getServerPrefix() + "facetsurvey.4abyte.com/json-services/",
		dataType: "json",
		success: callback
	});
};



