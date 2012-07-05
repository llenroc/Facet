var selectedName;
var selectedGroup;

$(function() {
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	
	
	$("#participantList li").click(function() {
		selectedName = $(this);
		$("#optionHeader").text(selectedName.text());
	});
	
	$(".groupListPop li").click(function() {
		selectedGroup = $(this);
		var index = selectedGroup.index();
		console.log(index);
		var asd = $("#groupList").get(index);
		$(asd).find("ul").append("<li>sup</li");
	});
	
	$('#addToGroupDialog').on('pagecreate pageshow', function (event) {
		var $the_ul = $('.groupListPop');
        if ($the_ul.hasClass('ui-listview')) {
            $the_ul.listview('refresh');
        } else {
            $the_ul.trigger('create');
        }
    });
	
});

$.fn.newGroup = function() {
	var name = $("#createGroupLabel").val();
	if(name != "") {
		$("#groupList").append("<li><a>"+ name + "</a><ul data-role='listview' data-inset='true'></ul></li>");
		$(".groupListPop").append("<li><a>"+ name + "</a></li>");
		$('#groupList').listview('refresh');
		$('#newgroupDialog').dialog('close');
		$("#createGroupLabel").val("");
	}
};

$.fn.deleteUser = function() {
	$("#participantList").children().slice(selectedName.index(),selectedName.index()+1).remove();
	$('#participantDialog').dialog('close');
};


$.fn.createItem = function(type, link, name) {
    $("#workspaceList").append("<li type=" + type + " title = '" + name + "'><a href='" + link + "'>" + name + "</a></li>");
	$('#workspaceList').listview('refresh');
};

