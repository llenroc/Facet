// When clicking on a li from #participantList or #workspaceList, this is updated with the li itself. Later on it is used to provide information about what was originally clicked on
var selectedItem;
var selectedGroup;

$(function() {

	// Populate the workspace with some sample items
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('image', "empty.html", "Image");

	// Initialize the Google Map to be zoomed in on the lat/long
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);	
	
	
	// Saves the li to selectedItem to be used later on
	$("#participantList li, #workspaceList li").live("click", function() {
		selectedItem = $(this);
		
		// Change header to be more approprate for the item that was clicked on
		$(".dialogHeader").text(selectedItem.text());
	});
	
	// When clicking on an item from the group dialog that isn't a header, this gets called. It formats the string to get rid of trailing spaces and then adds the user to the selected group.
	$(".groupListPop li:not([data-role='list-divider'])").live("click", function() {
		selectedGroup = $(this);
		var text = selectedGroup.text();
		var text2 = text.substring(0,text.length-1);
		$(this).addUserToGroup(selectedItem.text(),text2);
		
		// Go back 2 dialog boxes (to the main screen)
		window.history.go(-2);
		
	});
	
	// A fix to an error I was having if I tried to refresh the dialog list
	$('#addToGroupDialog').on('pagecreate pageshow', function (event) {
		var $the_ul = $('.groupListPop');
        if ($the_ul.hasClass('ui-listview')) {
            $the_ul.listview('refresh');
        } else {
            $the_ul.trigger('create');
        }
    });
	
	// Hiding function
	$(".group").live("click", function() {
		// .hidden is used for when adding users to a group. If a user is added to a group that is hidden, the users is hidden
		if($(this).hasClass("hidden")) {
			$(this).removeClass("hidden");
		} else {
			$(this).addClass("hidden");
		}
		
		// Goes from the item clicked up until the next divider and toggles visibility
		$(this).nextUntil(".ui-li-divider").toggle();
	});
			
});
 
$.fn.newGroup = function() {
	// Gets value from textbox
	var name = $("#createGroupLabel").val();
	
	// Does not add group if name is blank
	if(name != "") {
		// Append new group to both the visible group list, as well as the dialog box when adding user to group
		$("#groupList").append("<li class='group' data-role='list-divider'><div class='name'>"+ name + "</div><div class='ui-li-count'>0</div></li>");
		$(".groupListPop").append("<li><a>"+ name + "</a></li>");
		
		// jQuery Mobile - Added proper CSS to newly added item
		$('#groupList').listview('refresh', true);
		
		// Close dialog
		$('#newgroupDialog').dialog('close');
		
		// Clear text field
		$("#createGroupLabel").val("");
	}
};

$.fn.deleteUser = function() {
	// Slice out selected item and remove it
	$("#participantList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
	
	// Close dialog
	$('.ui-dialog').dialog('close');
};

$.fn.deleteItem = function() {
	// Slice out selected item and remove it
	$("#workspaceList").children().slice(selectedItem.index(),selectedItem.index()+1).remove();
	
	// Close dialog	
	$('.ui-dialog').dialog('close');
};

$.fn.addUserToGroup = function(name, groupName) {

	// Goes through all the .name in #groupList and checks to see if it matches the groupName parameter. If it does, then it adds the user to the group
	$("#groupList li .name").each(function(index) {
		if(groupName == $(this).text()) {
			var style="";
			
			// If the group is hidden, then the user that is added is also hidden
			if($(this).parent().hasClass("hidden")) {
				style = "style='display:none;'";
			}
			
			// Appends the user after the header
			$(this).parent().after("<li " + style +">"+name+"</li>");
			
			// Increases the count of the group by 1
			var count = parseInt($(this).parent().find(".ui-li-count").text()) + 1;
			
			// Updates html
			$(this).parent().find(".ui-li-count").text(count);
			
			// Refreshes list
			$('#groupList').listview('refresh', true);
		}
	});	

};

$.fn.createItem = function(type, link, name) {
	// data-filtertext = when using the filter bar, it filters by this text. Currently it filters by type (survey, image, document, etc ...) and the item name.
    $("#workspaceList").append("<li data-filtertext='"+ name + " " + type + "' type=" + type + " title = '" + name + "'><a data-rel='dialog' data-transition='pop' href='#workspaceDialog' linkURL='" + link + "'>" + name + "</a></li>");

	// Refreshes list
	$('#workspaceList').listview('refresh');
};

$.fn.changeOpenFile = function() {
	console.log(selectedItem.text());
};

