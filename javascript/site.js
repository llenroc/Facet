"use strict";

var deleteUI;
var slideOpen = true;
var pressTimer;



$(function() {
	$(this).makeQueueDroppable();
	$(this).makeParticipantsDroppable();
	$(this).makeFilesDroppable();
	$( "#tabs" ).tabs();
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
	
	
	$("#columns .column header h1 img.dragHandle2").hover(function(){$(this).parent().parent().parent().addClass("hover-border2");}, function () {$(this).parent().parent().parent().removeClass("hover-border2");});
	$("#participantList li img.dragHandle2").hover(function(){$(this).parent().addClass("hover-border2");}, function () {$(this).parent().removeClass("hover-border2");});	
	
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
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('images', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('images', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('images', "empty.html", "Image");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('images', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	
	$("#toggleSlide").click(function() {	
		$(this).slideItems();
	});
								
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);						
	
	$("body").disableSelection();
	
	// If an administrator is logged in, then the list of all users is populated
	PS.ajax.userIndex(populateParticipants, populateFailed);
});

// Account logged in is administrator and is adding users
function populateParticipants(json, textStatus, jqXHR) {
	$(json).each(function() {
		var name = this.name;
		if(name != "")
			createUser(name);
	});
	
	$(this).makeParticipantsDroppable(); /* Makes new group droppable */
}

// Not administrator and so populating with default users
function populateFailed() {
	createUser("Byron");
	createUser("Charles");
	createUser("Christopher");
	createUser("Daniel");
	createUser("David");
	createUser("Patrick");
	createUser("Robert");
	createUser("Roseline");
	createUser("Yaser");
	
	$(this).makeParticipantsDroppable(); /* Makes new group droppable */
}

// Adds user to the participant list with the given name
function createUser(name) {
	$("#participantList").append("<li class='user icon'><a href='#'>" + name + "</a><img alt='Drag Handle' src='icons/handle.png' class='dragHandle2'></li>");
}

$.fn.slideItems = function() {

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

$.fn.makeQueueDroppable = function() {	
	
	$("#columns").sortable({
		appendTo: "body",
		revert: true,
		handle: "img.dragHandle2",
		helper: "clone",
		revertDuration: 250,
		zIndex: 9999,
		scroll: false,
        opacity: 0.5,
		connectWith: ".workspace",
		
		start: function(event,ui) {
			$(ui.helper).find("a").css("color","white");
			$(ui.helper).css("list-style-type","none");
			
		},
		remove: function(event,ui) {$("#columns").css("width", "-=162px");},
		receive: function(event,ui) {
			$("#columns").css("width", "+=162px");
		
			doClone(event,ui);
			var type = $(ui.item).attr("type");
			$(ui.item).removeClass();
			$(ui.item).addClass("column");
			var text = $(ui.item).text();
			var link = ui.item.find("a").attr("href");
			$(ui.item).html("<header><h1><a onclick='$(this).changeTab(3);' href='"+ link + "' target='openFile'>" + text + "</a><img src='icons/handle.png' class='dragHandle2'></h1></header>");
			
			$(this).removeClass("hover-border");			
			$(this).makeQueueDroppable();
						
			//Just creates a random name because twitter doesn't allow duplicate tweets
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 5;
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			
			tweet("facetmeeting321","queue",randomstring,type, ui.item.text() );
		},
		
		over: function(event,ui) {$(".queue").addClass("hover-border");},		
		out: function(event,ui) {$(".queue").removeClass("hover-border");},
	}).disableSelection();
		
	$(".workspace").sortable({
		items: "none",
		receive: function(event,ui) {
			$(".trash").append(ui.item);
			$(".trash").children().remove();
			var type = $(ui.item).attr("type");
			$("#sharedScreen").attr("src",ui.item.find("a").attr("href"));
						
			//Just creates a random name because twitter doesn't allow duplicate tweets
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 5;
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			tweet("facetmeeting321","shared screen",randomstring,type, ui.item.text() );
			$(this).changeTab(4);
		},
		
		over: function(event,ui) {$("#tabs").addClass("hover-border");},		
		out: function(event,ui) {$("#tabs").removeClass("hover-border");},
	
	}).disableSelection();

};

var editing = false;

/* If we are currently renaming, then we make an group with the textarea, else if just create regular text*/
$.fn.newGroup = function() {
    if(editing == true) {
        $("#groupList").append("<li class = 'icon group connectedSortable'><img onclick='$(this).test();' class='delete' src='icons/delete.png'></img><div onclick='$(this).hide5();'><textarea>New Group</textarea></div><ul class = 'apple'></ul></li>");
    } else {
        $("#groupList").append("<li class = 'icon group connectedSortable'><div onclick='$(this).hide5();'>New Group</div><ul class = 'apple' style='display:none'></ul></li>");	
    }
    $(this).makeParticipantsDroppable(); /* Makes new group droppable */
};

/* Converts the name to a textarea to start renaming. Converts text area to text when finished */
$.fn.rename = function() {
    if(editing == false) {
        $("#groupList li").not(".trash").each(function(index) {
            /*Renaming*/
            var name = $(this).find("div").html();
            $(this).find("div").html("<textarea>" + name + "</textarea>");
                                              
            /*Deleting*/
            var oldHtml = $(this).html();
            $(this).html("<img onclick='$(this).test();' class='delete' src='icons/delete.png'></img>" + oldHtml);
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

function tweet(hashtag,location,name,type,filename) {
	$.ajax({
		type: "POST",
		url:  "tweetMessage.php?hashtag="+hashtag+"&location="+location+"&name="+name+"&type="+type+"&filename="+filename,
		success: function(){

		},
		error: function(){
			// code
			console.log("Twitter call failed!");
		}
    });
}

$.fn.test = function() {
    $(this).parent().remove();
};

$.fn.makeParticipantsDroppable = function() {
    $( "#participantList li" ).draggable({
		appendTo: "body",
        helper: function() {
			var name = $(this).text();
			return $("<li class='user icon' style='font-weight: bold;font-size: 17px;font-family: Helvetica; list-style-type: none; border-top-left-radius: 8px; border-top-right-radius: 8px;'>" + name + "</li>")[0];},
        cursorAt: { right: 20, top: 20},
        opacity: 0.5,
		scroll: false,
        handle: "img.dragHandle2",
		iframeFix: true,
	}).disableSelection();
    
    /* Everything with the .group class will be droppable, and it'll append it to children with the .apple class */
    $( ".group" ).droppable({
        accept: ":not(.ui-sortable-helper)",
		over: function(event,ui) {$(this).addClass("hover-border");},		
		out: function(event,ui) {$(this).removeClass("hover-border");},
        drop: function( event, ui ) {
			$( this ).find(".apple").show(); /* When a new item is added, the group is expanded */
			$( this ).find( ".placeholder" ).remove();
			$(this).removeClass("hover-border");
            			
			$( "<li class='icon user'></li>" ).html( ui.draggable.html() ).appendTo( jQuery(".apple",this));
        }
    }).disableSelection();
		
	$( "#participantList li" ).droppable({
        accept: ":not(.ui-sortable-helper) .queueItem, .workspaceItem",
		over: function(event,ui) {$(this).addClass("hover-border");},		
		out: function(event,ui) {$(this).removeClass("hover-border");},
        drop: function( event, ui ) {
			$( this ).find( ".placeholder" ).remove();
			$(this).removeClass("hover-border");
			var name = $(this).text();
			var item = ui.draggable.text();
			alert("Send " + item + " to " + name + "?");
        }
    }).disableSelection();
    
  
    /* All groups need .group class and .connectedSortable class to join together for sorting */
    $( ".group" ).sortable({
		opacity: 0.5,
		items: "li:not(.placeholder)",
		connectWith: ".connectedSortable",
		receive: doClone,
		appendTo: "body",
		helper: "clone",
		zIndex: 9999,
		over: function(event,ui) {$(this).addClass("hover-border");},		
		out: function(event,ui) {$(this).removeClass("hover-border");},
		handle: "img.dragHandle2",
		distance: 15,
    }).disableSelection();
    
	
	$( ".trash" ).droppable({
		items: "li:not(.placeholder)",
		connectWith: ".connectedSortable",
		over: function(event,ui) {$(this).addClass("hover-border-red");},		
		drop: function(event,ui) {
			deleteUIItem(ui);	
			},
		out: function(event,ui) {$(this).removeClass("hover-border-red");},
		distance: 15,
	}).disableSelection();
	
    $( ".trash" ).sortable({
		items: "li:not(.placeholder)",
		connectWith: ".connectedSortable",
		over: function(event,ui) {$(this).addClass("hover-border-red");},		
		out: function(event,ui) {$(this).removeClass("hover-border-red");},
		distance: 15,
		receive: function(event, ui) {
			deleteUIItem(ui);
		}
	}).disableSelection();
};

function deleteUIItem(ui) {
	var message = "Are you sure you wish to delete?";
	var r = confirm(message);
	if (r==true)
	{
		$(".trash").removeClass("hover-border-red");
		$(".trash").append(ui.draggable);
		$(".trash").children().remove();
	}
	else
	{
		$(".trash").removeClass("hover-border-red");
	}
}

$.fn.hide5 = function() { 
    $(this).next().toggle();
};



//<!-- scripts from files.html -->
$.fn.makeFilesDroppable = function() {
	
	$(".appleCube").sortable({
		handle: "img.dragHandle2",
		appendTo: "body",
		forcePlaceholderSize: true, 
		start: function(event,ui) {
			startDrag(event,ui);
		},		

        opacity: 0.5,
        zIndex: 2700,
		connectWith: "#columns",
	}).disableSelection();
		
};

function doClone(event, ui) {
    if (ui.sender.is('.appleCube')) {
        // clone and insert where we got it
        if (itemOriIndex == 0) {
            ui.item.clone().prependTo('.appleCube');
        } else {
            itemOriIndex -= 1;
            ui.item.clone().insertAfter('.appleCube li:eq(' + itemOriIndex + ')');
        }
        
    }
}



/* Gets the index of where the dragging item is from */
var itemOriIndex;
function startDrag(event, ui) {
	itemOriIndex = ui.item.index();
}

/* 	type = Type of file it is (what icon will be displayed). Can choose file, image, document, survey, audio
	link = What the text links to */
$.fn.createItem = function(type, link, name) {
    $(".appleCube").append("<li type=" + type + " title = '" + name + "' class = 'icon "+ type +"'><a onclick='$(this).changeTab(3);' href='" + link + "' target='openFile'>" + name + "</a><img src='icons/handle.png' class='dragHandle2'></li>");
	$(this).makeFilesDroppable();
	$(".appleCube").last().find("img.dragHandle2").hover(function(){$(this).parent().addClass("hover-border2");}, function () {$(this).parent().removeClass("hover-border2");});	
};

$.fn.changeTab = function(number) {
	$( '#tabs' ).tabs( 'option', 'selected', number );
};






