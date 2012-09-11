"use strict";


PS.model = {};

PS.model.surveysList = {};

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

