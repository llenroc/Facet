"use strict";


PS.model = {};

PS.model.surveysList = {};
PS.model.userItems = {};
PS.model.meetingParticipants = {};
PS.model.meetingItems = {};
PS.model.queue = {};
PS.model.activeItem;
PS.model.hashtag;


PS.model.checkUserItems = function(nid) {
	

}

PS.model.checkQueue = function(data) {
	if(data.length != 0) {
		var items = data.split("; ");
		for(var i = 0; i < items.length; i++) {
			var data = items[i].split(", ");
			
			if(PS.model.queue[data[0]] === undefined) {	
				createQueueItem(data[1], data[3], data[2], data[0]);		
				PS.model.queue[data[0]] = items[i];
			}
		}
	}
}

PS.model.checkMeetingItems = function(data) {
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
}

PS.model.checkMeetingParticipants = function(data) {
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
	$(".surveyItems").nextUntil(".ui-li-divider").toggle();
	
}

