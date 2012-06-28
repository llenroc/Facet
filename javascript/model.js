"use strict";


PS.model = {};

PS.model.surveysList = {};

PS.model.getSurveysCallback = function(json, textStatus, jqXHR) {
	for (var x in json.nodes) {
		//console.log(x + " " + json.nodes[x].node.question);
		
		if (PS.model.surveysList[json.nodes[x].node.idsurvey] === undefined) {
			PS.model.surveysList[json.nodes[x].node.idsurvey] = json.nodes[x].node;
			$(this).createItem('survey', json.nodes[x].node.urlResponse, json.nodes[x].node.question);
			$(this).createItem('results', "http://facetsurvey.4abyte.com/surveymaps/" + json.nodes[x].node.idsurvey, json.nodes[x].node.question + " " + "Results");
			
		}
		

	}
}

