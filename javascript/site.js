$(function() {
  $(this).makeDroppable();
  });

$.fn.makeDroppable = function() {
    /* All groups need .group class and .connectedSortable class to join together for sorting */
    $( "#columns" ).sortable({
                             items: "div:not(.placeholder)",
                             distance: 15,
                             scroll: false,
                             }).disableSelection();
};


var editing = false;

/* This is run when the html is finished loading*/
$(function() {
  $(this).makeDroppable();
  });

/* If we are currently renaming, then we make an group with the textarea, else if just create regular text*/
$.fn.newGroup = function() {
    if(editing == true) {
        $("#groupList").append("<li class = 'icon group connectedSortable'><img onclick='$(this).test();' class='delete' src='icons/delete.png'></img><div onclick='$(this).hide5();'><textarea>New Group</textarea></div><ul class = 'apple'></ul></li>");
    } else {
        $("#groupList").append("<li class = 'icon group connectedSortable'><div onclick='$(this).hide5();'>New Group</div><ul class = 'apple'></ul></li>");	
    }
    $(this).makeDroppable(); /* Makes new group droppable */
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

$.fn.makeDroppable = function() {
    $( "#participantList li" ).draggable({
                                         helper: "clone",
                                         cursorAt: { right: 20, top: 20},
                                         opacity: 0.5,
                                         handle: "img.dragHandle",
                                         zIndex: 2700,
                                         });
    
    /* Everything with the .group class will be droppable, and it'll append it to children with the .apple class */
    $( ".group" ).droppable({
                            accept: ":not(.ui-sortable-helper)",
                            over: function(event,ui) {$(this).css("color","green");},
                            out: function(event,ui) {$(this).css("color", "black");},
                            drop: function( event, ui ) {
                            $( this ).find(".apple").show(); /* When a new item is added, the group is expanded */
                            $( this ).find( ".placeholder" ).remove();
                            $( this ).css("color","black");
                            
                            $( "<li class='icon user'></li>" ).html( ui.draggable.html() ).appendTo( jQuery(".apple",this));
                            }
                            });
    
    
    /* All groups need .group class and .connectedSortable class to join together for sorting */
    $( ".group" ).sortable({
                           items: "li:not(.placeholder)",
                           connectWith: ".connectedSortable",
                           over: function(event,ui) {
                           $(this).css("color","green");},
                           out: function(event,ui) {
                           $(this).css("color", "black");},
                           handle: "img.dragHandle",
                           distance: 15,
                           });
    
    $( ".trash" ).sortable({
                           items: "li:not(.placeholder)",
                           connectWith: ".connectedSortable",
                           over: function(event,ui) {$(this).css("color","red");},
                           out: function(event,ui) {$(this).css("color", "black");},
                           distance: 15,
                           receive: function(event, ui) {
                           $(this).children().not("div").remove();
                           }
                           });
    
    /* Disabling group sorting for now because it is buggy
     $( "#groupList" ).sortable({
     items: "li:not(.placeholder)",
     distance: 15,
     }).disableSelection();
     */
};

$.fn.hide5 = function() {
    
    $(this).next().toggle();
};



$(function() {
  $( "#tabs" ).tabs();
  });





//<!-- scripts from files.html -->
$(function() {
  $(this).makeDroppable();
  });

$.fn.makeDroppable = function() {
    /* All groups need .group class and .connectedSortable class to join together for sorting */
    $( ".appleCube" ).sortable({
                               items: "li:not(.placeholder)",
                               connectWith: ".connectedSortable",
                               distance: 15,
                               }).disableSelection();
};

/* 	type = Type of file it is (what icon will be displayed). Can choose file, image, document, survey, audio
 link = What the text links to */
$.fn.createItem = function(type, link) {
    var typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);
    $(".appleCube").append("<li class = 'icon "+ type +"'><a href='" + link + "'>" + typeFormatted + "</a></li>");
};













