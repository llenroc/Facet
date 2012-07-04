$(function() {
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	
});

$.fn.newGroup = function() {
	var name = $("#createGroupLabel").val();
	$("#createGroupLabel").val("");
	if(name != "") {
		$("#groupList").append("<li><a>"+ name + "</a><ul data-role='listview' data-inset='true'></ul></li>");
		$('#groupList').listview('refresh');
		$('#newgroupDialog').dialog('close');
	}
};