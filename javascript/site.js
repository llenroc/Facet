"use strict";

var slideOpen = true;
var selectedGroup;
//var accountJSON;

// http://www.w3schools.com/js/js_cookies.asp
// http://malsup.com/jquery/block/

$(function() {
	// Checks if user is logged in. If they are not, redirect them to login page
	checkLogIn();
	
	// Blocks UI until ajax callback is completed
	$.blockUI({
		css: { 
			border: 'none', 
			padding: '15px', 
			backgroundColor: '#222', 
			'-webkit-border-radius': '10px', 
			'-moz-border-radius': '10px', 
			'border-radius': '10px',
			opacity: .8, 
			color: '#fff' },
	});
	
	console.log(document.cookie);
	
	// The list of all users is populated, so this is a loading icon
	$("#participantList").append("<li class='icon loading' id='loadingParticipants'>Loading Users...</li>");
	$("#groupList").append("<li class='icon loading' id='loadingGroups'>Loading Groups...</li>");
	
	// AJAX call to first get user id from cookie, and then to retrieve the json object from server
	// Once AJAX call is completed then accountJSON will be the user account of the person currently logged in
	getUser();
		
	// Performs a node retrieve on the project. After it is retrieved, it populates the UI with all project related fields (groups, group users)
	getProject();
		
	// Makes everything draggable
	makeQueueDroppable();
	makeParticipantsDroppable();
	makeFilesDroppable();
	
	// Initializes the tabs
	$( "#tabs" ).tabs();
	
	// Initialize the workspace accordian
	$( "#accordion" ).accordion( { autoHeight: false } );
	
	// Populates the surveys from the server
	PS.ajax.surveyIndex(PS.model.getSurveysCallback);
	
	var scrollable = document.getElementById("participantList");
	new ScrollFix(scrollable);
	var scrollable1 = document.getElementById("groupList");
	new ScrollFix(scrollable1);
	var scrollable2 = document.getElementById("tweets");
	new ScrollFix(scrollable2);
	var scrollable3 = $(".files-area").get(0);
	new ScrollFix(scrollable3);
	var scrollable4 = document.getElementById("queue");
	new ScrollFix(scrollable4);
		
	// Updates the scrolling arrows that show when user scrolls the participantList.
	$("#participantList").scroll(function(){
		if($(this)[0].scrollHeight - $(this).scrollTop()-5 <= $(this).outerHeight())
			$("#downArrow").css("visibility", "hidden"); 	// At bottom	
		else 
			$("#downArrow").css("visibility", "visible"); 	// Not at bottom		
		
		if($(this).scrollTop() >= 5)
			$("#upArrow").css("visibility", "visible"); 	// Not at top
		else 
			$("#upArrow").css("visibility", "hidden"); 		// At top
	});
	
	// Updates the scrolling arrows that show when user scrolls the queue
	$(".queue").scroll(function() {
	    if($(this)[0].scrollWidth - $(this).scrollLeft()-500 <= $(this).outerWidth())
			$("#rightArrow").css("visibility", "hidden"); 	// At right
		else 
			$("#rightArrow").css("visibility", "visible"); 	// Not at right	
	
		if($(this).scrollLeft() >= 5)
			$("#leftArrow").css("visibility", "visible"); 	// Not at left
		else 
			$("#leftArrow").css("visibility", "hidden"); 	// At left
	});
	
	
	//Placeholder to populate queue
	populateSampleQueue();
	
	// Event handling for the slide button
	$("#toggleSlide").click(function() {	
		slideItems();
	});
				
	// Initializes the Google Map
	initializeGoogleMap();
	
	// Disables selection
	$("body").disableSelection();
				
	// Unblocks UI when ajax calls stop
	$(document).ajaxStop(function() {
		$.unblockUI();
		$("#loadingGroups").remove();
		$("#loadingParticipants").remove();
		
	});
	
	
	// Set timer for refresh
	refresh();
	setInterval(refresh, 5000);
		
});

// Callback for when the account logged in has been retrieved. accountJSON stores this information
function getUserCallback() {	

}

// Not administrator and so populating with default users
function populateFailed() {

	populateSampleUsers();
	
	// Removes loading animation item
	$("#loadingParticipants").remove();
	makeParticipantsDroppable(); /* Makes new group droppable */
}

// Adds user to the participant list with the given name
function createUser(name, id) {
	$("#participantList").append("<li uid='" + id + "' class='user icon'><a href='#'>" + name + "</a><img alt='Drag Handle' src='icons/handleL.png' class='dragHandle2'></li>");
	makeParticipantsDroppable();
}

// Creates Queue item with a given name and link
function createQueueItem(name, link, type, nid) {
	$("#columns").css("width", "+=182px");
	$("#columns").append("<li nid='" + nid + "' type='" + type + "' class='column'><header><h1><a onclick='changeTab(3)' href='"+ link + "' target='openFile'>" + name + "</a><img alt='List Item' src='icons/handleL.png' class='dragHandle2'></h1></header></li>");
	makeQueueDroppable();
}

// Animates divs to slide in and out
function slideItems() {
	if(slideOpen) {		
		$(".queue").css("width", '+=240' );
		$(".monitter").css("width", '+=240' );
		$(".workspace").css("width", '+=240' );
		$("#columns").css("width", '+=240' );
			
		$(".participants").animate({left: '-=240'}, {duration:"slow", queue: false});
		$(".queue").animate({left: '-=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({left: '-=240'}, {duration:"slow", queue: false});
		$("#leftArrow").animate({left: '-=240'}, {duration:"slow", queue: false});
		$("#toggleSlide").animate({left: '-=215'}, {duration:"slow", queue: false});
		
		$("#toggleSlide").attr("src","icons/right.png");
		slideOpen = false;
	} else {		
		$(".participants").animate({left: '+=240'}, {duration:"slow", queue: false});
		$(".queue").animate({left: '+=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({left: '+=240'}, {duration:"slow", queue: false});
		$("#leftArrow").animate({left: '+=240'}, {duration:"slow", queue: false});
		$("#toggleSlide").animate({left: '+=215'}, {duration:"slow", queue: false});
		
		$(".queue").css("width", '-=240' );
		$(".monitter").css("width", '-=240' );
		$(".workspace").css("width", '-=240' );
		$("#columns").css("width", '-=240' );
		
		$("#toggleSlide").attr("src","icons/left.png");
		slideOpen = true;
	}
};

function makeQueueDroppable() {	
	$("#columns").sortable({
		appendTo: "body",
		handle: "img.dragHandle2",
		helper: "clone",
		zIndex: 9999,
		scroll: false,
        opacity: 0.5,
		
		start: function(event,ui) {
			iFrameFix();
			$(ui.helper).find("a").css("color","white");
			$(ui.helper).css("list-style-type","none");
			$(ui.helper).addClass("queueItem");
			$(ui.helper).attr("href",$(ui.item).find("a").attr("href"));
			$(ui.helper).attr("type",$(ui.item).attr("type"));
			$(ui.helper).attr("nid",$(ui.item).attr("nid"));
			
					
			$(ui.helper).css("white-space", "nowrap");
			$(ui.helper).css("text-overflow", "ellipsis");
			$(ui.helper).css("overflow", "hidden");			
		},
		stop: function(event,ui) { stopiFrameFix(); },
		remove: function(event,ui) { $("#columns").css("width", "-=162px"); },
	}).disableSelection();
	
	$(".queue").droppable({
		accept: ".workspaceItem",	
		drop: function(event,ui) {
			var type = $(ui.draggable).attr("type");
			var text = $(ui.helper).text();
			var link = $(ui.draggable).attr("href");
			var nid = $(ui.draggable).attr("nid");
			createQueueItem(text,link, type, nid);
			
			makeQueueDroppable();
			$(this).removeClass("hover-border");
			
			PS.ajax.tweet(hashtag,"queue",accountJSON.name,type, text );
		},
		
		over: function(event,ui) { $(".queue").addClass("hover-border"); },		
		out: function(event,ui) { $(".queue").removeClass("hover-border"); },
	}).disableSelection();
	
	
	// Handles the ability to drag items to the shared screen
	$(".workspace").droppable({
		accept: ".column",
		drop: function(event,ui) {
			$(".trash").append(ui.draggable);
			$(".trash").children().remove();
			
			var type = $(ui.helper).attr("type");
			var href = $(ui.helper).attr("href");
			var nid = $(ui.helper).attr("nid");
			
			$("#shared_canvas").attr("src",href);
			
			// Updates shared screen based on the nid of what was dragged to it
			PS.ajax.updateSharedScreen(function() {}, function() { console.log("Error updating shared screen")} , $(meetingJSON).find("Nid").text(), nid);	

			// Tweets about the newly added shared screen item
			PS.ajax.tweet(hashtag,"shared screen",accountJSON.name,type, ui.helper.text() );
			
			changeTab(4);
			
			$("#tabs").removeClass("hover-border");
		},
		
		over: function(event,ui) {$("#tabs").addClass("hover-border");},		
		out: function(event,ui) {$("#tabs").removeClass("hover-border");},
	});	
};

var editing = false;
/* If we are currently renaming, then we make an group with the textarea, else if just create regular text*/

// Creates a new group with a default "New Group" name with the nid attached.
function newGroup(nid) {
	return newGroup1("New Group", nid);
};

function newGroup1(name, nid) {
	if(editing == true) {
        $("#groupList").append("<li nid='"+nid+"' class = 'icon group'><img onclick='ajaxDeleteGroup(this)' class='delete' height='32px' width='32px' src='icons/deleteL.png'></img><textarea class='groupText'>" + name + "</textarea><div onclick='$(this).next().toggle();'></div><ul class = 'apple'></ul></li>");
    } else {
        $("#groupList").append("<li nid='"+nid+"' class = 'icon group'><img style='display:none;' onclick='ajaxDeleteGroup(this)' class='delete' height='32px' width='32px' src='icons/deleteL.png'><textarea class='groupText' style='display:none;'>" + name + "</textarea><div onclick='$(this).next().toggle();'>" + name + "</div><ul class = 'apple' style='display:none'></ul></li>");	
    }
    makeParticipantsDroppable(); /* Makes new group droppable */

	return $("#groupList").children().length-1;
}

function ajaxDeleteGroup(object) {
	PS.ajax.groupDelete(function () { 
		$(object).parent().remove();
	}, function () { console.log("Delete Group Failed!"); }, $(object).parent().attr("nid"), $(projectJSON).find("Nid").text());
}

function ajaxNewGroup() {
	var name = prompt("Please enter the new group name: ","New Group");
	
	if (name != null && name != "") {
		PS.ajax.groupCreate(function (json) {
			newGroup1(name, json.nid);
			PS.model.registerGroup(json.nid, "");
		}, function() { console.log("Failed to Create group '"+ name + "'"); }, name , accountJSON.uid, $(projectJSON).find("Nid").text());
	}
}

function addUserToGroup(name, groupName, id) {
	$("#groupList").children().each(function () { 
		if($(this).find("div").text() == groupName) {
			$(this).find("ul").append("<li uid='" + id + "' class='icon user'><a href='#'>" + name + "</a><img alt='Drag Handle' src='icons/handleL.png' class='dragHandle2'></li>");
		}	
	});
}

// jQuery has built in iFrameFix for draggable, but not for sortable. Essentially what it does is it adds an invisible div overtop to prevent mousecapture
function iFrameFix() {
	$("body").append("<div class='iFrameFix' style='top:0px; left:0px; position:absolute; width:100%; height:100%;'></div>");
}

// Removes div created from iFrameFix()
function stopiFrameFix() {
	$(".iFrameFix").remove();
}

/* Converts the name to a textarea to start renaming. Converts text area to text when finished */
function rename() {
    if(editing == false) {
        $("#groupList").children().each(function(index) {
            /*Renaming*/
					
            $(this).find("div").hide();
			$(this).find("ul").hide();
			$(".groupText").show();
			
			$(".group").css("height","20px");
			               
			// Shows the delete button
			$(".delete").show();
		
        });
		
		editing = true;
		$("#renameButton").text("Done");
		
    } else {
        $("#groupList").children().each(function(index) {
            var name = $(this).find("textarea").val();
            if(name == "") {
                name = "New Group";
            }
			
			$(this).find("div").text(name);		
			$(this).find("div").show();
        });
		
		$(".groupText").hide(); 
        $(".delete").hide();
		$(".group").css("height","auto");
        
		
        editing = false;
        $("#renameButton").text("Edit");
    }
};

function makeParticipantsDroppable() {
    $( "#participantList li" ).draggable({
		appendTo: "body",
        helper: function() {
			var name = $(this).text();
			return $("<li class='user icon' style='font-weight: bold;font-size: 17px;font-family: Helvetica; list-style-type: none;'>" + name + "</li>")[0];},
        cursorAt: { right: 20, top: 20},
        opacity: 0.5,
		scroll: false,
        handle: "img.dragHandle2",
		iframeFix: true,
	}).disableSelection();
	    
    /* Everything with the .group class will be droppable, and it'll append it to children with the .apple class */
    $( ".group" ).droppable({
		over: function(event,ui) { $(this).addClass("hover-border"); },		
		out: function(event,ui) { $(this).removeClass("hover-border"); },
        drop: function( event, ui ) {
				
			var isQueueItem = $(ui.helper).hasClass("queueItem");
			var isWorkspaceItem = $(ui.draggable).hasClass("workspaceItem");
			var isDupe = $(ui.helper).hasClass("groupDupe");
			
			if(isQueueItem || isWorkspaceItem) {				
				console.log("Sending item to all members of '" + $(this).find("div").text()+"'");
				var itemNID = $(ui.draggable).attr("nid");
				var groupNID = $(this).attr("nid");
				PS.ajax.shareWithGroup(function() {}, function() { console.log("Error Sharing Item with Group")}, itemNID, groupNID);
			
			} else if (isDupe) {/*Ignore Duplicates from sortable*/
			} else {
				var groupID = $(this).attr("nid");
				var userID = $(ui.draggable).attr("uid");
				selectedGroup = this;
				
				if(!duplicate(userID, selectedGroup)) {			
					PS.ajax.addUserToGroup(function() {				
						$( selectedGroup ).find(".apple").show(); /* When a new item is added, the group is expanded */
						addUserToGroup($(ui.draggable).find("a").text(), $(selectedGroup).find("div").text(), userID);
					}, function() { console.log("Error Adding user to group"); }, userID, groupID);
				}
			}
			
			$(this).removeClass("hover-border");
        }
    }).disableSelection();
		
	$( "#participantList li" ).droppable({
		accept: ".column, .workspaceItem",
		over: function(event,ui) { $(this).addClass("hover-border"); },		
		out: function(event,ui) { $(this).removeClass("hover-border"); },
        drop: function( event, ui ) {
			$(this).removeClass("hover-border");
			var name = $(this).text();
			var item = ui.draggable.text();
			var uid = $(this).attr("uid");
			var itemID = $(ui.draggable).attr("nid");
			
			console.log("Sending " + item + " to '" + name + "'");
			PS.ajax.shareWithUser(function() {}, function() { console.log("Error sharing Item");} , itemID, uid);
        }
    }).disableSelection();
      
    /* All groups need .group class to join together for sorting */
    $( ".group" ).sortable({
		opacity: 0.5,
		items: "li:not(.placeholder)",
		connectWith: ".group",
		appendTo: "body",
		helper: "clone",
		zIndex: 9999,
		over: function(event,ui) { $(this).addClass("hover-border"); },		
		out: function(event,ui) { $(this).removeClass("hover-border"); },
		start: function(event,ui) {
			iFrameFix(); 
			$(ui.helper).css("list-style-type","none");
			$(ui.helper).css("font-weight","bold");
			$(ui.helper).css("font-size","17px");
			$(ui.helper).css("font-family","Helvetica");
			$(ui.helper).addClass("groupDupe");
		},
		stop: function(event,ui) { 
			stopiFrameFix();
		
		},
		receive: function(event,ui) {

			var groupID = $(this).attr("nid");
			var userID = $(ui.item).attr("uid");

			// Removes the glitch where an element that is sorted into an empty group is formatted incorrectly
			var wronglyPlaced = $(this).children(".user");	
			if(wronglyPlaced.length != 0) {
				$(wronglyPlaced).remove();				
				$(this).find(".apple").append(wronglyPlaced);		
			}
			
			$(this).find(".apple").show();
			
			if(!duplicateSortable(userID, this)) {
				PS.ajax.addUserToGroup(function() {				
					$( selectedGroup ).find(".apple").show(); /* When a new item is added, the group is expanded */
				}, function() { console.log("Error Adding user to group"); }, userID, groupID);
			} else {
				// This user is a duplicate of a user that is already in this group. Sortable has already placed the user in this group, so we're removing it now.
				$(ui.item).remove();			
			}
		},
		
		remove: function(event,ui) {
			var groupID = $(this).attr("nid");
			var userID = $(ui.item).attr("uid");
						
			PS.ajax.removeUserFromGroup(function() {
			
			}, function() { console.log("Failed to Remove User from Group"); }, groupID, userID);
		},
		handle: "img.dragHandle2",
		distance: 15,
    }).disableSelection();
    
	
	$( ".trash" ).droppable({
		over: function(event,ui) { $(this).addClass("hover-border-red"); },		
		drop: function(event,ui) { deleteUIItem(ui); },
		out: function(event,ui) { $(this).removeClass("hover-border-red"); },
		distance: 15,
	}).disableSelection();
};

function duplicate(userID, group) {	
	var status = 0;

	$(group).find("ul").children().each(function () {
		if($(this).attr("uid") == userID) {
			status++;		
		}
	});
	
	return status;
}

function duplicateSortable(userID, group) {
	if(duplicate(userID,group) > 1)
		return true;
	else
		return false;
}

function deleteUIItem(ui) {
	$(".trash").removeClass("hover-border-red");
	var message = "Are you sure you wish to delete?";
	var r = confirm(message);
	if (r==true)
	{	
		$(".trash").append(ui.draggable);
		$(".trash").children().remove();
	}
}

function makeFilesDroppable() {
	$(".appleCube").sortable({
		handle: "img.dragHandle2",
		appendTo: "body",
		helper: "clone",
		scroll: false,
		forcePlaceholderSize: true, 
		start: function(event,ui) {
			iFrameFix();
			$(ui.item).addClass("workspaceItem");
			
			$(ui.helper).css("list-style-type","none");
			$(ui.helper).css("font-weight","bold");
			$(ui.helper).css("font-size","17px");
			$(ui.helper).css("font-family","Helvetica");
			$(ui.item).attr("href",$(ui.item).find("a").attr("href"));
			$(ui.item).attr("type",$(ui.item).attr("type"));
			
			$(ui.item).attr("nid",$(ui.item).attr("nid"));
			
		},	

		stop: function(event,ui) {stopiFrameFix();},		

        opacity: 0.5,
        zIndex: 2700,
	}).disableSelection();	
};

/* 	type = Type of file it is (what icon will be displayed). Can choose file, image, document, survey, audio
	link = What the text links to */
function createItem(type, link, name, target, nid) {
    $(target).append("<li nid='" + nid + "' type=" + type + " title = '" + name + "' class = 'icon "+ type +"'><a onclick='changeTab(3)' href='" + link + "' target='openFile'>" + name + "</a><img src='icons/handleL.png' class='dragHandle2'></li>");
	makeFilesDroppable();
};

function changeTab(number) {
	$( '#tabs' ).tabs( 'option', 'selected', number );
};

function createWorkspaceAccordion(name, className) {
	$("#accordion").append("<h3><a href='#'>" + name + "'s Items</a></h3><div><ul class = '" + className + " appleCube'></ul></div>").accordion('destroy').accordion({ autoHeight: false });
}

function promptCreate() {
$.blockUI({ 
	message: $('#createItemPrompt'),
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
	//	opacity: .5, 
		color: '#fff' },
	}); 
}

function toggleSettingsMenu() {
	var animationDuration = 300;
	var animationDegrees = 90;

	if($("#settingsImage").attr("status") == "hidden") {
		$("#settingsImage").attr("status", "visible");
		$("#settingsImage").animate({rotate:'-='+animationDegrees},{duration:animationDuration});
	} else {
		$("#settingsImage").attr("status", "hidden");
		$("#settingsImage").animate({rotate:'+='+animationDegrees},{duration:animationDuration});
	}

	$('#settingsMenu').toggle(animationDuration);
}

//http://javascriptisawesome.blogspot.ca/2011/09/jquery-css-rotate-and-animate-rotation.html
// Animate with rotation. Used on settings gear
(function($){
	var _e = document.createElement("canvas").width
	$.fn.cssrotate = function(d) {  
	return this.css({
	'-moz-transform':'rotate('+d+'deg)',
	'-webkit-transform':'rotate('+d+'deg)',
	'-o-transform':'rotate('+d+'deg)',
	'-ms-transform':'rotate('+d+'deg)'
	}).prop("rotate", _e ? d : null)
	}; 
	var $_fx_step_default = $.fx.step._default;
	$.fx.step._default = function (fx) {
	if(fx.prop != "rotate")return $_fx_step_default(fx);
	if(typeof fx.elem.rotate == "undefined")fx.start = fx.elem.rotate = 0;
	$(fx.elem).cssrotate(fx.now)
	}; 
})(jQuery);