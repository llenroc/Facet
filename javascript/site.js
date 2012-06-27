var deleteUI;
var slideOpen = true;
var pressTimer;



$(function() {
	$(this).makeQueueDroppable();
	$(this).makeParticipantsDroppable();
	$(this).makeFilesDroppable();
	$( "#tabs" ).tabs();
	$.fn.updateSurvey();
	
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
	
	$("herp").changeTab(2);
	
$("body").mousedown(function(e) {
    // set timeout for this element
    var timeout = window.setTimeout(function() { $("body").trigger("longclick");}, 500);
    $(this).mouseup(function() {
        // clear timeout for this element
        window.clearTimeout(timeout);
        // reset mouse up event handler
        $(this).unbind("mouseup");
        return false;
    });
    return false;
});

	$("body").bind("longclick", function() {console.log("longclick");});

		
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
	

	

});

$.fn.slideItems = function() {

	if(slideOpen) {
		$(".queue").animate({width: '+=240'}, {duration:"slow", queue: false});
		$(".monitter").animate({width: '+=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({width: '+=240'}, {duration:"slow", queue: false});
		$("ul.appleCube > li").animate({width: '-=66'}, {duration:"slow", queue: false});
		
		$(".participants").animate({left: '-=240'}, {duration:"slow", queue: false});
		$(".queue").animate({left: '-=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({left: '-=240'}, {duration:"slow", queue: false});
		$("#toggleSlide").animate({left: '-=200'}, {duration:"slow", queue: false});
		
		$("#toggleSlide").attr("src","icons/right.png");
		slideOpen = false;
	} else {
		$(".queue").animate({width: '-=240'}, {duration:"slow", queue: false});
		$(".monitter").animate({width: '-=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({width: '-=240'}, {duration:"slow", queue: false});
		$("ul.appleCube > li").animate({width: '+=66'}, {duration:"slow", queue: false});
		
		$(".participants").animate({left: '+=240'}, {duration:"slow", queue: false});
		$(".queue").animate({left: '+=240'}, {duration:"slow", queue: false});
		$(".workspace").animate({left: '+=240'}, {duration:"slow", queue: false});
		$("#toggleSlide").animate({left: '+=200'}, {duration:"slow", queue: false});
		
		$("#toggleSlide").attr("src","icons/left.png");

		slideOpen = true;
	}
};

$.fn.makeQueueDroppable = function() {
/*    $( "#columns" ).sortable({
		items: "div:not(.placeholder)",
        distance: 15,
        scroll: false,
    }).disableSelection();*/
	
	$(".column").addClass("hover-border2");
	$( "#columns div" ).draggable({
		appendTo: "body",
        helper: "original",
		revert: true,
		handle: "img.dragHandle",
		revertDuration: 250,
		zIndex: 2700,
		scroll: false,
        opacity: 0.5,
		iframeFix: true,
		start: function(event,ui) {$(this).addClass("queueItem");}
	}).disableSelection();
	
	$( ".queue" ).droppable({
        accept: ":not(.ui-sortable-helper) .workspaceItem",
        drop: function( event, ui ) {
			var type = $(ui.draggable).attr("type");
			$( this ).find( ".placeholder" ).remove();
			$( "<div type='" + type + "' class='column'></div>" ).html( "<header><h1>" + ui.draggable.html() + "<img class='dragHandle'></h1></header>" ).appendTo("#columns");	
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
			
			tweet("facetmeeting321","queue",randomstring,type, ui.draggable.text() );
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
			
			var type = $(ui.draggable).attr("type");

			//Just creates a random name because twitter doesn't allow duplicate tweets
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 5;
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			
			$(this).changeTab(4);
			tweet("facetmeeting321","shared screen",randomstring,type, ui.draggable.text() );
        },
		over: function(event,ui) {
			$("#tabs").addClass("hover-border");			
		},		
		out: function(event,ui) {
			$("#tabs").removeClass("hover-border");
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

function tweet(hashtag,location,name,type,filename) {
	$.ajax({
		type: "POST",
		url:  "tweetMessage.php?hashtag="+hashtag+"&location="+location+"&name="+name+"&type="+type+"&filename="+filename,
		success: function(){

		},
		error: function(){
			// code
			alert("AJAX call failed!");
		}
    });
}

$.fn.test = function() {
    $(this).parent().remove();
};

$.fn.makeParticipantsDroppable = function() {
	$(".dragHandle").addClass("hover-border2");
    $( "#participantList li" ).draggable({
		appendTo: "body",
        helper: function() {
			var name = $(this).text();
			return $("<li class='user icon' style='border-top-left-radius: 8px; border-top-right-radius: 8px;'>" + name + "</li>")[0];},
        cursorAt: { right: 20, top: 20},
        opacity: 0.5,
		scroll: false,
        handle: "img.dragHandle",
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
			//deleteUI = ui;
			//$("#dialog-confirm #message").text("Are you sure you wish to delete " + ui.draggable.text());
			//$("#dialog-confirm").dialog('open');
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
			//deleteUI = ui;
			//$("#dialog-confirm #message").text("Are you sure you wish to delete " + ui.draggable.text());
			//$("#dialog-confirm").dialog('open');
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
/*	$( ".appleCube" ).sortable({
		items: "li:not(.placeholder)",
		distance: 15,
	}).disableSelection();*/
	
	$(".appleCube li").addClass("hover-border2");
	$( ".appleCube li" ).draggable({
		appendTo: "body",
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
    $(".appleCube").append("<li type=" + type + " title = '" + name + "' class = 'icon "+ type +"'><a onclick='$(this).changeTab(3);' href='" + link + "' target='openFile'>" + name + "</a></li>");
	$(this).makeFilesDroppable();
};

$.fn.changeTab = function(number) {
	$( '#tabs' ).tabs( 'option', 'selected', number );
};


// XML based survey updates

/*$.fn.updateSurvey = function() {
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
}*/



// JSON based survey updates. requires local PHP mirror for cross site request

$.fn.updateSurvey = function() {

	var serverURL;
	if( typeof phpServer === 'undefined') {
		serverURL = "http://localhost:81/curl.php?request="
	}
	else {
		serverURL = phpServer;
	}

	$.ajax({
		type: "GET",
		url: serverURL + "facetsurvey.4abyte.com/json-services/",
		dataType: "json",
		success: parseJson
	});
};

function parseJson(json, textStatus, jqXHR) {

	for (var x in json.nodes) {
		//console.log(x + " " + json.nodes[x].node.question);
		$(this).createItem('survey', json.nodes[x].node.urlResponse, json.nodes[x].node.question);
		$(this).createItem('results', "http://facetsurvey.4abyte.com/surveymaps/" + json.nodes[x].node.idsurvey, json.nodes[x].node.question + " " + "Results");
	}

}




