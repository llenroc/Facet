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
	
	$(".group").live("click", function() {
		$(this).nextUntil(".ui-li-divider").toggle();
	});
			
});
 
$.fn.newGroup = function() {
	var name = $("#createGroupLabel").val();
	if(name != "") {
		$("#groupList").append("<li class='group' data-role='list-divider'><div class='name'>"+ name + "</div><div class='ui-li-count'>0</div></li>");
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

	$("#groupList li .name").each(function(index) {
		if(groupName == $(this).text()) {
			$(this).parent().after("<li>"+name+"</li>");
			var count = parseInt($(this).parent().find(".ui-li-count").text()) + 1;
			$(this).parent().find(".ui-li-count").text(count);
			$('#groupList').listview('refresh');
		}
	});	

};

$.fn.createItem = function(type, link, name) {
    $("#workspaceList").append("<li type=" + type + " title = '" + name + "'><a href='" + link + "'>" + name + "</a></li>");
	$('#workspaceList').listview('refresh');
};

