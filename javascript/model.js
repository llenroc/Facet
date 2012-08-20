"use strict";


PS.model = {};

PS.model.surveysList = {};

PS.model.getSurveysCallback = function(json, textStatus, jqXHR) {

	for (var x in json.nodes) {
		var idsurvey = json.nodes[x].node.URL.split("/").pop();
	
		if (PS.model.surveysList[idsurvey] === undefined) {
			PS.model.surveysList[idsurvey] = json.nodes[x].node;
			
			createItem('survey', json.nodes[x].node.URL, json.nodes[x].node.Name, ".surveyItems");
			createItem('results', json.nodes[x].node.URL_report, json.nodes[x].node.Name + " " + "Results", ".surveyItems");
			
		}
	}
	
	$("#loadingWorkspace").remove();
	
}

