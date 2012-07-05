var selectedName;
var selectedGroup;

$(function() {
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	
	
	$("#participantList li").live("click", function() {
		selectedName = $(this);
		$("#optionHeader").text(selectedName.text());
	});
	
	$(".groupListPop li:not([data-role='list-divider'])").live("click", function() {
		selectedGroup = $(this);
		var text = selectedGroup.text();
		var text2 = text.substring(0,text.length-1);
		$(this).addUserToGroup(selectedName.text(),text2);
		window.history.go(-2);
		
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
		$("#groupList").append("<li data-role='list-divider'>"+ name + "</li>");
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

$.fn.addUserToGroup = function(name, groupName) {

	$("#groupList li").each(function(index) {
		if(groupName == $(this).text()) {
			$(this).after("<li>"+name+"</li>");
			$('#groupList').listview('refresh');
		}
	});	

};

$.fn.createItem = function(type, link, name) {
    $("#workspaceList").append("<li type=" + type + " title = '" + name + "'><a href='" + link + "'>" + name + "</a></li>");
	$('#workspaceList').listview('refresh');
};

$.fn.hideGroup = function() {
	//$(this).parent().parent().parent().find("li").css("background-color","red");
};
