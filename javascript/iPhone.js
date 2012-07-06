var selectedItem;
var selectedGroup;

$(function() {
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('image', "empty.html", "Image");


	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	
	
	$("#participantList li, #workspaceList li").live("click", function() {
		selectedItem = $(this);
		$(".dialogHeader").text(selectedItem.text());
	});
	
	$(".groupListPop li:not([data-role='list-divider'])").live("click", function() {
		selectedGroup = $(this);
		var text = selectedGroup.text();
		var text2 = text.substring(0,text.length-1);
		$(this).addUserToGroup(selectedItem.text(),text2);
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
		if($(this).hasClass("hidden")) {
			$(this).removeClass("hidden");
		} else {
			$(this).addClass("hidden");
		}
		$(this).nextUntil(".ui-li-divider").toggle();
	});
			
});
 
$.fn.newGroup = function() {
	var name = $("#createGroupLabel").val();
	if(name != "") {
		$("#groupList").append("<li class='group' data-role='list-divider'><div class='name'>"+ name + "</div><div class='ui-li-count'>0</div></li>");
		$(".groupListPop").append("<li><a>"+ name + "</a></li>");
		$('#groupList').listview('refresh', true);
		$('#newgroupDialog').dialog('close');
		$("#createGroupLabel").val("");
	}
};

$.fn.deleteUser = function() {
	$("#participantList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
	$('.ui-dialog').dialog('close');
};

$.fn.deleteItem = function() {
	$("#workspaceList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
	$('.ui-dialog').dialog('close');
};

$.fn.addUserToGroup = function(name, groupName) {

	$("#groupList li .name").each(function(index) {
		if(groupName == $(this).text()) {
			var style="";
			if($(this).parent().hasClass("hidden")) {
				style = "style='display:none;'";
			}
			$(this).parent().after("<li " + style +">"+name+"</li>");
			var count = parseInt($(this).parent().find(".ui-li-count").text()) + 1;
			$(this).parent().find(".ui-li-count").text(count);
			$('#groupList').listview('refresh', true);
		}
	});	

};

$.fn.createItem = function(type, link, name) {
    $("#workspaceList").append("<li data-filtertext='"+ name + " " + type + "' type=" + type + " title = '" + name + "'><a data-rel='dialog' data-transition='pop' href='#workspaceDialog' linkURL='" + link + "'>" + name + "</a></li>");
	$('#workspaceList').listview('refresh');
};

