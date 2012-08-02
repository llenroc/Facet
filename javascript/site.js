"use strict";

var slideOpen = true;
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
			backgroundColor: '#000', 
			'-webkit-border-radius': '10px', 
			'-moz-border-radius': '10px', 
			opacity: .5, 
			color: '#fff' },
	});
	
	// AJAX call to first get user id from cookie, and then to retrieve the json object from server
	// Once AJAX call is completed then accountJSON will be the user account of the person currently logged in
	getUser();
	
	// Makes everything draggable
	makeQueueDroppable();
	makeParticipantsDroppable();
	makeFilesDroppable();
	
	// Initializes the tabs
	$( "#tabs" ).tabs();
	
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
		{
			// At bottom
			$("#downArrow").css("visibility", "hidden");		
		} else 
		{
			// Not at bottom
			$("#downArrow").css("visibility", "visible");		
		}
		
		if($(this).scrollTop() >= 5)
		{
			// Not at top
			$("#upArrow").css("visibility", "visible");
		} else 
		{
			// At top
			$("#upArrow").css("visibility", "hidden");
		}
	});
	
	// Updates the scrolling arrows that show when user scrolls the queue
	$(".queue").scroll(function() {
	    if($(this)[0].scrollWidth - $(this).scrollLeft()-500 <= $(this).outerWidth())
		{
			// At right
			$("#rightArrow").css("visibility", "hidden");
		} else 
		{
			// Not at right
			$("#rightArrow").css("visibility", "visible");	
		}
	
		if($(this).scrollLeft() >= 5)
		{
			// Not at left
			$("#leftArrow").css("visibility", "visible");
		} else 
		{
			// At left
			$("#leftArrow").css("visibility", "hidden");
		}
	});
		
	//Placeholder to populate workspace	
	populateSampleWorkspace()
	
	//Placeholder to populate queue
	populateSampleQueue()
	
	// Event handling for the slide button
	$("#toggleSlide").click(function() {	
		slideItems();
	});
				
	// Initializes the Google Map
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);						
	
	// Disables selection
	$("body").disableSelection();
	
	// If an administrator is logged in, then the list of all users is populated
	$("#participantList").append("<li class='icon' id='loading'>Loading Users...</li>");
	PS.ajax.userIndex(populateParticipants, populateFailed);
});

// When the logged in user is retrieved, the UI is unblocked
function getUserCallback() {	
	$.unblockUI();
}


// Ajax call passed and adding recieved users
function populateParticipants(json, textStatus, jqXHR) {

	loadParticipants(json);
	
	// Removes loading animation item
	$("#loading").remove();
	makeParticipantsDroppable(); /* Makes new group droppable */
}

// Not administrator and so populating with default users
function populateFailed() {

	populateSampleUsers();
	
	// Removes loading animation item
	$("#loading").remove();
	makeParticipantsDroppable(); /* Makes new group droppable */
}

// Adds user to the participant list with the given name
function createUser(name, id) {
	$("#participantList").append("<li uid='" + id + "' class='user icon'><a href='#'>" + name + "</a><img alt='Drag Handle' src='icons/handle.png' class='dragHandle2'></li>");
}

// Creates Queue item with a given name and link
function createQueueItem(name, link) {
	$("#columns").css("width", "+=162px");
	$("#columns").append("<li class='column'><header><h1><a onclick='changeTab(3)' href='"+ link + "' target='openFile'>" + name + "</a><img alt='List Item' src='icons/handle.png' class='dragHandle2'></h1></header></li>");
}

// Animates divs to slide in and out
function slideItems() {
	if(slideOpen) {
	/*	$(".queue").animate({width: '+=240'}, {duration:"slow", queue: false});
		$(".monitter").animate({width: '+=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({width: '+=240'}, {duration:"slow", queue: false});
		$("#columns").animate({width: '+=240'}, {duration:"slow", queue: false});*/
		
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
	/*	$(".queue").animate({width: '-=240'}, {duration:"slow", queue: false});
		$(".monitter").animate({width: '-=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({width: '-=240'}, {duration:"slow", queue: false});
		$("#columns").animate({width: '-=240'}, {duration:"slow", queue: false});*/
		
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
			var type = $(ui.helper).attr("type");
			var text = $(ui.helper).text();
			var link = $(ui.helper).attr("href");
			
			createQueueItem(text,link);
			
			makeQueueDroppable();
			$(this).removeClass("hover-border");
			
			PS.ajax.tweet("facetmeeting321","queue",accountJSON.name,type, text );
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
			$("#sharedScreen").attr("src",href);
						
			PS.ajax.tweet("facetmeeting321","shared screen",accountJSON.name,type, ui.helper.text() );
			changeTab(4);
			
			$("#tabs").removeClass("hover-border");
		},
		
		over: function(event,ui) {$("#tabs").addClass("hover-border");},		
		out: function(event,ui) {$("#tabs").removeClass("hover-border");},
	});	
};

var editing = false;
/* If we are currently renaming, then we make an group with the textarea, else if just create regular text*/
function newGroup() {
    if(editing == true) {
        $("#groupList").append("<li class = 'icon group'><img onclick='$(this).parent().remove();' class='delete' src='icons/delete.png'></img><div onclick='$(this).next().toggle();'><textarea>New Group</textarea></div><ul class = 'apple'></ul></li>");
    } else {
        $("#groupList").append("<li class = 'icon group'><div onclick='$(this).next().toggle();'>New Group</div><ul class = 'apple' style='display:none'></ul></li>");	
    }
    makeParticipantsDroppable(); /* Makes new group droppable */
};

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
        $("#groupList li").not(".trash").each(function(index) {
            /*Renaming*/
            var name = $(this).find("div").html();
            $(this).find("div").html("<textarea>" + name + "</textarea>");
                                              
            /*Deleting*/
            var oldHtml = $(this).html();
            $(this).html("<img onclick='$(this).parent().remove();' class='delete' src='icons/delete.png'></img>" + oldHtml);
        });
		editing = true;
		$("#renameButton").html("Done");
    } else {
        $("#groupList li").not(".trash").each(function(index) {
            var name = $(this).find("textarea").val();
            if(name == "") {
                name = "New Group";
            }
            $(this).find("div").html(name);		
        });
        
        $(".delete").remove();
        editing = false;
        $("#renameButton").html("Edit");
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
			var isWorkspaceItem = $(ui.helper).hasClass("workspaceItem");
			var isDupe = $(ui.helper).hasClass("groupDupe");
			
			if(isQueueItem || isWorkspaceItem) {				
				console.log("Sending item to all members of '" + $(this).find("div").text()+"'");
				var item = ui.draggable.text();	
				$(this).find("ul li").each(function() {		
					console.log("Sending " + item + " to '" + $(this).text() + "'");					
				});
			
			} else if (isDupe) {/*Ignore Duplicates from sortable*/} else {
				$( this ).find(".apple").show(); /* When a new item is added, the group is expanded */
				$( "<li class='icon user'></li>" ).html( ui.draggable.html() ).appendTo( jQuery(".apple",this));
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
			console.log("Sending " + item + " to '" + name + "'");
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
		stop: function(event,ui) { stopiFrameFix(); },
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
		forcePlaceholderSize: true, 
		start: function(event,ui) {
			iFrameFix();
			$(ui.helper).addClass("workspaceItem");
			
			$(ui.helper).attr("href",$(ui.item).find("a").attr("href"));
			$(ui.helper).attr("type",$(ui.item).attr("type"));
		},	

		stop: function(event,ui) {stopiFrameFix();},		

        opacity: 0.5,
        zIndex: 2700,
	}).disableSelection();	
};

/* 	type = Type of file it is (what icon will be displayed). Can choose file, image, document, survey, audio
	link = What the text links to */
function createItem(type, link, name) {
    $(".appleCube").append("<li type=" + type + " title = '" + name + "' class = 'icon "+ type +"'><a onclick='changeTab(3)' href='" + link + "' target='openFile'>" + name + "</a><img src='icons/handle.png' class='dragHandle2'></li>");
	makeFilesDroppable();
};

function changeTab(number) {
	$( '#tabs' ).tabs( 'option', 'selected', number );
};






