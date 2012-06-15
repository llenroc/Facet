$(function() {
	$(this).makeQueueDroppable();
	$(this).makeParticipantsDroppable();
	$(this).makeFilesDroppable();
	$( "#tabs" ).tabs();
	$.fn.updateSurvey();
	
	$("body").disableSelection();
});
  

$.fn.makeQueueDroppable = function() {
/*    $( "#columns" ).sortable({
		items: "div:not(.placeholder)",
        distance: 15,
        scroll: false,
    }).disableSelection();*/
	
	$( "#columns div" ).draggable({
        helper: "original",
		revert: true,
		revertDuration: 250,
        opacity: 0.5,
        zIndex: 2700,
		iframeFix: true,
		start: function(event,ui) {$(this).addClass("queueItem");}
	}).disableSelection();
	
	$( ".queue" ).droppable({
        accept: ":not(.ui-sortable-helper) .workspaceItem",
        drop: function( event, ui ) {
			$( this ).find( ".placeholder" ).remove();
			$( "<div class='column'></div>" ).html( "<header><h1>" + ui.draggable.html() + "</h1></header>" ).appendTo("#columns");	
			$(this).removeClass("hover-border");			
			$(this).makeQueueDroppable();
        },
		over: function(event,ui) {$(this).addClass("hover-border");},		
		out: function(event,ui) {$(this).removeClass("hover-border");},
		
    }).disableSelection();
	
	$( "#tabs-5" ).droppable({
        accept: ":not(.ui-sortable-helper) .queueItem",
        drop: function( event, ui ) {
			$( this ).find( ".placeholder" ).remove();
			$("#sharedScreen").attr("src",ui.draggable.find("a").attr("href"));
			$("#sharedScreen").removeClass("hover-border");
			$(".trash").append(ui.draggable);
			$(".trash").children().remove();
        },
		over: function(event,ui) {$("#sharedScreen").addClass("hover-border");},		
		out: function(event,ui) {$("#sharedScreen").removeClass("hover-border");},
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

$.fn.test = function() {
    $(this).parent().remove();
};

$.fn.makeParticipantsDroppable = function() {
    $( "#participantList li" ).draggable({
        helper: function() {
			var name = $(this).text();
			return $("<li class='user icon'>" + name + "</li>")[0];},
        cursorAt: { right: 20, top: 20},
        opacity: 0.5,
        handle: "img.dragHandle",
        zIndex: 2700,
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
		over: function(event,ui) {$(this).addClass("hover-border");},		
		out: function(event,ui) {$(this).removeClass("hover-border");},
		handle: "img.dragHandle",
		distance: 15,
    }).disableSelection();
    
    $( ".trash" ).sortable({
		items: "li:not(.placeholder)",
		connectWith: ".connectedSortable",
		over: function(event,ui) {$(this).addClass("hover-border-red");},		
		out: function(event,ui) {$(this).removeClass("hover-border-red");},
		distance: 15,
		receive: function(event, ui) {$(this).children().remove();}
	}).disableSelection();
};

$.fn.hide5 = function() {
    
    $(this).next().toggle();
};


//<!-- scripts from files.html -->
$.fn.makeFilesDroppable = function() {
/*	$( ".appleCube" ).sortable({
		items: "li:not(.placeholder)",
		distance: 15,
	}).disableSelection();*/
	
	$( ".appleCube li" ).draggable({
        helper: "clone",
        opacity: 0.5,
        zIndex: 2700,
		iframeFix: true,
		start: function(event,ui) {$(this).addClass("workspaceItem");}
	}).disableSelection();
};

/* 	type = Type of file it is (what icon will be displayed). Can choose file, image, document, survey, audio
	link = What the text links to */
$.fn.createItem = function(type, link, name) {
    $(".appleCube").append("<li class = 'icon "+ type +"'><a onclick='$(this).changeTab(3);' href='" + link + "' target='openFile'>" + name + "</a></li>");
	$(this).makeFilesDroppable();
};

$.fn.changeTab = function(number) {
	$( '#tabs' ).tabs( 'option', 'selected', number );

};

$.fn.updateSurvey = function() {
	$.ajax({
		type: "GET",
		url: "test.xml",
		dataType: "xml",
		success: parseXml
	});
};

function parseXml(xml) {
	$(xml).find("node").each(function()  {
		var link = $(this).find("URL").text();
		var name = $(this).find("Title").text();
		$(this).createItem('survey', link, name);
	});
}

