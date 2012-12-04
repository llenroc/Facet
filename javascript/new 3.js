$(function() {
	displayRecievedItemPrompt(1169);
	
});

function displayRecievedItemPrompt(nid) {
	$("#recievedItemList").children().remove();
	$("#recievedItemList").append("<li id = 'itemRecievedLoading' class = 'icon loading'>Loading...</li>");
	
	$.blockUI({ 
	message: $('#recievedItemPrompt'),
	css: { 
		border: 'none', 
		padding: '15px',
		'font-size': '15px',
		backgroundColor: '#222', 
		'-webkit-border-radius': '10px', 
		'-moz-border-radius': '10px', 
		'border-radius': '10px',
		'min-width' : '475px',
		'margin-top' : '-200px',
		'margin-left' : '-50px',
		'cursor': 'auto',
		color: '#fff' },
	}); 
	
	PS.ajax.retrieve("item", nid, function(xml) {
	
		$("#itemRecievedLoading").remove();
	
		$(xml).find("node").slice(1).each(function() {
			var type = $(this).find("Type").text();
			var url = $(this).find("Url").text();
			var name = $(this).find("Name").text();
			
			$("#recievedItemList").append("<li nid='" + nid + "' type=" + type + " title = '" + name + "' class = 'icon "+ type +"'>" +name + "</li>");
		});
	}, function() {
	
	});
}
