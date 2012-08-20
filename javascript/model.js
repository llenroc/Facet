"use strict";


PS.model = {};

PS.model.surveysList = {};

PS.model.getSurveysCallback = function(json, textStatus, jqXHR) {
	for (var x in json.nodes) {	
	
		if (PS.model.surveysList[json.nodes[x].node.idsurvey] === undefined) {
			PS.model.surveysList[json.nodes[x].node.idsurvey] = json.nodes[x].node;
			
			createItem('survey', json.nodes[x].node.urlResponse, json.nodes[x].node.question);
			createItem('results', "http://facetsurvey.4abyte.com/surveymaps/" + json.nodes[x].node.idsurvey, json.nodes[x].node.question + " " + "Results");
			
		}
		

	}
	
	$("#loadingWorkspace").remove();
	
}

