var selected;
var deleteUI;

$(function() {
	$(this).makeQueueDroppable();
	$(this).makeParticipantsDroppable();
	$(this).makeFilesDroppable();
	$( "#tabs" ).tabs();
	$.fn.updateSurvey();
	
	//Placeholder to populate workspace
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
	$(this).createItem('image', "empty.html", "Image");
	$(this).createItem('document', "empty.html", "Document");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('file', "empty.html", "File");
	$(this).createItem('audio', "empty.html", "Audio");
								
	var myOptions = {
		center: new google.maps.LatLng(49.891235,-97.15369),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);						
	
	$("body").disableSelection();
	
	$( "#dialog-confirm" ).dialog({
		resizable: false,
		height:140,
		modal: true,
		autoOpen: false,
		buttons: {
			"Delete": function() {
				$(".trash").removeClass("hover-border-red");
				$(".trash").append(deleteUI.draggable);
				$(".trash").children().remove();
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
				$(".trash").removeClass("hover-border-red");
			}
		}
	});
});
  

$.fn.makeQueueDroppable = function() {
/*    $( "#columns" ).sortable({
		items: "div:not(.placeholder)",
        distance: 15,
        scroll: false,
    }).disableSelection();*/
	
	$(".column").addClass("hover-border2");
	$( "#columns div" ).draggable({
        helper: "original",
		revert: true,
		revertDuration: 250,
        opacity: 0.5,
        zIndex: 2700,
		iframeFix: true,
		start: function(event,ui) {$(this).addClass("queueItem"); selected = $("#tabs").tabs("option","selected");}
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
	
	$( ".workspace" ).droppable({
        accept: ":not(.ui-sortable-helper) .queueItem",
        drop: function( event, ui ) {
			$( this ).find( ".placeholder" ).remove();
			$("#sharedScreen").attr("src",ui.draggable.find("a").attr("href"));
			$("#tabs").removeClass("hover-border");
			$(".trash").append(ui.draggable);
			$(".trash").children().remove();
        },
		over: function(event,ui) {
			$("#tabs").addClass("hover-border");
			$(this).changeTab(4);		
			$("#columns div").draggable( "option", "iframeFix", true );			
		},		
		out: function(event,ui) {
			$("#tabs").removeClass("hover-border");
			$(this).changeTab(selected);
		},
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
	$(".dragHandle").addClass("hover-border2");
    $( "#participantList li" ).draggable({
        helper: function() {
			var name = $(this).text();
			return $("<li class='user icon' style='border-top-left-radius: 8px; border-top-right-radius: 8px;'>" + name + "</li>")[0];},
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
    
	
	$( ".trash" ).droppable({
		items: "li:not(.placeholder)",
		connectWith: ".connectedSortable",
		over: function(event,ui) {$(this).addClass("hover-border-red");},		
		drop: function(event,ui) {
			deleteUI = ui;
			$("#dialog-confirm #message").text("Are you sure you wish to delete " + ui.draggable.text());
			$("#dialog-confirm").dialog('open');},
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
			deleteUI = ui;
			$("#dialog-confirm #message").text("Are you sure you wish to delete " + ui.draggable.text());
			$("#dialog-confirm").dialog('open');
		}
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
	
	$(".appleCube li").addClass("hover-border2");
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
    $(".appleCube").append("<li title = '" + name + "' class = 'icon "+ type +"'><a onclick='$(this).changeTab(3);' href='" + link + "' target='openFile'>" + name + "</a></li>");
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
		var nid = $(this).find("Nid").text();
		$(this).createItem('survey', link, name);
		$(this).createItem('results', "http://facetsurvey.4abyte.com/surveymaps/"+nid , name+ " " + "Results");
	});
}

