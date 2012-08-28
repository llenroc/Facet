// 2012 Facet Decision Systems, Inc.
function LayerControl(settings,attrs){
  this.settings = settings;
  this.attrs = attrs;
  this.legendDiv = null;
  this.layerOptions = { addMore: 0, preserveViewport : true };
}

LayerControl.prototype = {};

LayerControl.prototype.isArray = function(obj){
   if (!obj || obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}
LayerControl.prototype.isEmpty = function(obj){
   for(var i in obj){ return false; }
  return true;
}

LayerControl.prototype.showStatus = function(div,status){
  var title = div.title;
  if (title && title.length) title += ' ';
  if (google && google.maps && google.maps.KmlLayerStatus)
  switch(status){
  case google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND:
    title += 'DOCUMENT_NOT_FOUND'; break;
  case google.maps.KmlLayerStatus.DOCUMENT_TOO_LARGE:
    title += 'DOCUMENT_TOO_LARGE'; break;
  case google.maps.KmlLayerStatus.FETCH_ERROR:
    title += 'FETCH_ERROR'; break;
  case google.maps.KmlLayerStatus.INVALID_DOCUMENT:
    title += 'INVALID_DOCUMENT'; break;
  case google.maps.KmlLayerStatus.INVALID_REQUEST:
    title += 'INVALID_REQUEST'; break;
  case google.maps.KmlLayerStatus.LIMITS_EXCEEDED:
    title += 'LIMIT_EXCEEDED'; break;
  case google.maps.KmlLayerStatus.OK:
    title += 'OK'; break;
  case google.maps.KmlLayerStatus.TIMED_OUT:
    title += 'TIMED_OUT'; break;
  case google.maps.KmlLayerStatus.UNKNOWN:
  default:
    title += 'UNKNOWN'; break;
  }
  div.title = title;
}

LayerControl.prototype.initialize = function(map){

  var me = this;
  var container = document.createElement("div");
  container.className = "layer-control LayerControl";
/*
  container.style.maxWidth = "30%";
  container.style.position = "absolute";
  container.style.zIndex = 2000;
  container.style.overflow = "visible";
*/

  var mapDiv = me.createToggle_("Map");
  mapDiv.firstChild.style.marginLeft = "8px";
  mapDiv.firstChild.style.marginRight = "8px";
  var satDiv = me.createToggle_("Satellite");
  satDiv.firstChild.style.marginLeft = "8px";
  satDiv.firstChild.style.marginRight = "8px";
  var aerDiv = me.createToggle_("Aerial");
  aerDiv.firstChild.style.marginLeft = "8px";
  aerDiv.firstChild.style.marginRight = "8px";
  var terDiv = me.createToggle_("Terrain");
  terDiv.firstChild.style.marginLeft = "8px";
  terDiv.firstChild.style.marginRight = "8px";
  var hybDiv = me.createToggle_("Hybrid");
  hybDiv.firstChild.style.marginLeft = "8px";
  hybDiv.firstChild.style.marginRight = "8px";

  me.assignButtonEvent_(mapDiv, map, google.maps.MapTypeId.ROADMAP, [satDiv, aerDiv, terDiv, hybDiv]);
  me.assignButtonEvent_(satDiv, map, google.maps.MapTypeId.SATELLITE, [mapDiv, aerDiv, terDiv, hybDiv]);
  me.assignButtonEvent_(aerDiv, map, google.maps.MapTypeId.TERRAIN, [satDiv, mapDiv, terDiv, hybDiv ]);
  me.assignButtonEvent_(terDiv, map, google.maps.MapTypeId.TERRAIN, [satDiv, aerDiv, mapDiv, hybDiv]);
  me.assignButtonEvent_(hybDiv, map, google.maps.MapTypeId.HYBRID, [satDiv, aerDiv, mapDiv, terDiv]);

  google.maps.event.addListener(map, "maptypechanged", function(){
    if (map.getCurrentMapType() == google.maps.MapTypeId.ROADMAP)
	google.maps.event.trigger(mapDiv, "click");
    else if (map.getCurrentMapType() == google.maps.MapTypeId.SATELLITE)
	google.maps.event.trigger(satDiv, "click");
    else if (map.getCurrentMapType() == google.maps.MapTypeId.TERRAIN)
	google.maps.event.trigger(aerDiv, "click");
    else if (map.getCurrentMapType() == google.maps.MapTypeId.TERRAIN)
	google.maps.event.trigger(terDiv, "click");
    else
	google.maps.event.trigger(hybDiv, "click");
  });
  switch(me.attrs['map_background']){
  case 'Satellite':
	google.maps.event.trigger(satDiv, "click");
	break;
  case 'Aerial':
	google.maps.event.trigger(aerDiv, "click");
	break;
  case 'Terrain':
	google.maps.event.trigger(terDiv, "click");
	break;
  case 'Hybrid':
	google.maps.event.trigger(hybDiv, "click");
	break;
  case 'Map':
  default:
	google.maps.event.trigger(mapDiv, "click");
	break;
  }

// 1st or 2nd child of container's 1st, layerButton, is legendDiv
// keep it facilitate appendToLegend later
  me.legendDiv = document.createElement("div");
  me.appendToLegend(map,me.settings);

  var expandedDiv = me.createDiv_();
  if(me.attrs['map_legend_display']=='on')
    expandedDiv.style.display = 'block';
  expandedDiv.appendChild(me.legendDiv);
  var opts = me.attrs['map_background_options'];
  if (opts){
    opts = opts.split(',');
    for (var row in opts){
      var opt = opts[row];
      switch(opt){
      case 'Map':
	expandedDiv.appendChild(mapDiv);
	break;
      case 'Satellite':
	expandedDiv.appendChild(satDiv);
	break;
      case 'Aerial':
	expandedDiv.appendChild(aerDiv);
	break;
      case 'Terrain':
	expandedDiv.appendChild(terDiv);
	break;
      case 'Hybrid':
	expandedDiv.appendChild(hybDiv);
	break;
      }
    }
  }
  var layerButton = me.createToggle_(me.attrs['map_legend_label'],expandedDiv);

  if(me.attrs['map_legend_latlong']=='on'){
    // Koordinaten
    coords = document.createElement("div");
    coords.className = "coords";
    coords.style.marginLeft = "20px";
    coords.style.fontFamily = "Courier,monospace";
    coords.style.display = "inline";
    coords.style.cssFloat = "right";
   // coords.style.float = "right";
    coords.style.styleFloat = "right"; // fuer IE7
    coords.appendChild(document.createTextNode(""));

    // Koordinaten
    google.maps.event.addListener(map, "mousemove", function(mm){
      var msLoc = mm.latLng.toUrlValue().split(",");
      var z = map.getZoom();
	var scalor = 100;
	var places = 2;
	if(z > 12){
	    scalor = 10000;
	    places = 4;
	}else if(z > 7){
	    scalor = 1000;
	    places = 3;
	};
    var msLat = Math.round(msLoc[0] * scalor) / scalor;
    var msLon = Math.round(msLoc[1] * scalor) / scalor;
    coords.firstChild.nodeValue
      = msLat.toFixed(places) + " / " + msLon.toFixed(places);
    });

    layerButton.firstChild.appendChild(coords);
  }
  layerButton.appendChild(expandedDiv);
  container.appendChild(layerButton);

// this results in legend clipped to stay within map bounds
// caller instead overlays legend in front of map
//  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(container); 

  return container;
}

// ------- Layer Control Functions -------
LayerControl.prototype.toggleOvl = function(id,className){
  $('#'+id).find('.'+className).each(function(){
    google.maps.event.trigger(this,'click');
  });
}
LayerControl.prototype.disableOvl = function(id,className){
  $('#'+id).find('.'+className).each(function(){
    google.maps.event.trigger(this,'nullify');
  });
}
LayerControl.prototype.updateOvl = function(layer){
  var me = this;
  var ctx = layer.canvas_selector || '.LayerControl';
  $(ctx).find('.'+layer.id).each(function(){
    google.maps.event.trigger(this,'updateMapLayer',layer.url);
    var textDiv = this.firstChild;
    var legend = this.lastChild;
    textDiv.lastChild.nodeValue = layer.title;
// presuming that have-legend implies replace-legend
// i.e. will not change to no-legend
    if (textDiv != legend){
      legend.innerHTML = "";
      if (layer.legend){
        me.fillLegend_(legend,layer.legend,layer.stride);
      }
    }
  });
}
LayerControl.prototype.appendToLegend = function(map,layers){
  var me = this;
  var cat;
  var catDiv;
  var catButton;
  var ovlButton;
  var mapLayer;
  var tile;
  var last_cat = '_NO_CAT_';
  var disp_cat = 0;
  var count_cat = 0;
  var legend = 0;
  for (var row in layers){
    var layer = layers[row];
    if (!layer.category){
      last_cat = "_NO_CAT_";
      disp_cat = count_cat = 0;
      catDiv = me.legendDiv;
      cat = 0;
    }else
    if (layer.category != last_cat){
      last_cat = layer.category;
      if (!legend && count_cat == 1
      && me.attrs['map_legend_singleton_category']=='hide'){
	// hide categories with only one child
        catDiv.style.display = 'block';
        if (catButton){
          catButton.style.display = 'none';
        }
      }
      if (disp_cat){
        catDiv.style.display = 'block';
        catButton.firstChild.lastChild.firstChild.nodeValue = '-';
      }
      disp_cat = count_cat = 0;
      catDiv = document.createElement('div');
      catDiv.style.display = 'none';
      catButton = this.createCat_(last_cat,catDiv);
      me.legendDiv.appendChild(catButton);
      me.legendDiv.appendChild(catDiv);
      cat = { n_on : 0, div : catButton.firstChild };
    }
    legend = 0;
    if (layer.legend){
      legend = document.createElement('div');
      legend.style.display = 'none';
      legend.style.marginLeft = "25px";
      this.fillLegend_(legend,layer.legend,layer.stride);
    }
    mapLayer = new Array();
    tile = {};
    var layer_no = 0;
    if (me.isArray(layer.url)){
      var len = layer.url.length;
      var last_url;
      var overview_url;
      if (len > 0 && typeof layer.url[len-1] == 'string') {
        overview_url = layer.url[len-1];
      }
      for(var i=0;i<len;i++){
        var url = layer.url[i];
        if (me.isArray(url)) {
          var zoom = url[0];
          tile[zoom] = new Array();
          var tile_no = url.length;
          while (tile_no-- > 1) {
            var link;
            if (typeof overview_url == 'string') {
              link = overview_url.replace(/[.a-zA-Z_0-9]*$/, url[tile_no][4]);
//console.log("chip:",link);
            }
            var bbox = new google.maps.LatLngBounds(
new google.maps.LatLng(url[tile_no][0],url[tile_no][1]),
new google.maps.LatLng(url[tile_no][2],url[tile_no][3]));
            tile[zoom][tile_no] = {"url":link,
              "bbox":bbox,"layer":null};
          }
          last_url = url;
        } else if (typeof url == 'string') {
          if (0 && i == 1 && me.isArray(last_url)) {
            var tile_no = last_url.length;
            while (tile_no-- > 1) {
//if (tile_no > 2) { tile_no = 2; } else { tile_no = 1; }
//console.log("one zoom:",url);
              url = url.replace(/[a-zA-Z_0-9]*.kmz/, last_url[tile_no][4]);
              mapLayer[layer_no] = new google.maps.KmlLayer(url,this.layerOptions);
              this.layerOptions.preserveViewport = true;
              if (layer.displayed){
	        mapLayer[layer_no].setMap(map);
                mapLayer[layer_no].visible = true;
              }else{
                mapLayer[layer_no].visible = false;
              }
              layer_no++;
            }
            tile = {};
          } else {
//console.log("overview:",url);
            mapLayer[layer_no] = new google.maps.KmlLayer(url,this.layerOptions);
            this.layerOptions.preserveViewport = true;
            if (layer.displayed){
	      mapLayer[layer_no].setMap(map);
              mapLayer[layer_no].visible = true;
            }else{
              mapLayer[layer_no].visible = false;
            }
            layer_no++;
          }
        }
      }
      ovlButton = this.createOvl_(map,cat,layer.name,layer.title,
       layer.displayed,layer.switched,layer.color,mapLayer,legend,tile);
      catDiv.appendChild(ovlButton);
    }else {
      if (typeof layer.url == 'string') {
//console.log('plain string:',layer.url);
        mapLayer[0] = new google.maps.KmlLayer(layer.url,this.layerOptions);
        this.layerOptions.preserveViewport = true;
        if (layer.displayed){
	  mapLayer[0].setMap(map);
          mapLayer[0].visible = true;
        }else{
          mapLayer[0].visible = false;
        }
      }
      ovlButton = this.createOvl_(map,cat,layer.name,layer.title,
        layer.displayed,layer.switched,layer.color,mapLayer,legend);
      catDiv.appendChild(ovlButton);
    }
    disp_cat = disp_cat || layer.displayed;
    count_cat++;
  }
  if (!legend && count_cat == 1
	&& me.attrs['map_legend_singleton_category']=='hide'){
    if (catDiv){
      catDiv.style.display = 'block';
    }
    if (catButton){
      catButton.style.display = 'none';
    }
  }
}

// Erzeugt die Buttons
LayerControl.prototype.createButton_ = function(text,onclick){
  var buttonDiv = document.createElement("div");
  var rowDiv = document.createElement("div");
  var textDiv = text;
  if (typeof(textDiv) == "string"){
    textDiv = document.createElement("div");
    textDiv.style.display = "inline";
    textDiv.appendChild(document.createTextNode(text));
  }
  rowDiv.appendChild(textDiv);
  buttonDiv.appendChild(rowDiv);
  if (onclick){
    google.maps.event.addDomListener(rowDiv, "click", onclick, true);
  }
  return buttonDiv;
}
LayerControl.prototype.createToggle_ = function(text,div){
  var onclick;
  if (div){
    onclick = function(){
      if (div.style.display == "none"){
        div.style.display = "block";
      }else{
        div.style.display = "none";
      }
    };
  }
  var buttonDiv = this.createButton_(text,onclick);
  buttonDiv.style.color = "#000000";
  buttonDiv.style.backgroundColor = "white";
  buttonDiv.style.font = "small Arial";
  buttonDiv.style.border = "1px solid black";
  buttonDiv.style.padding = "1px";
  buttonDiv.style.margin= "1px";
  buttonDiv.style.textAlign = "left";
  buttonDiv.style.fontSize = "12px";
  buttonDiv.style.cursor = "pointer";
  buttonDiv.style.cssFloat = "left";
  buttonDiv.style.styleFloat = "left";
  return buttonDiv;
}
LayerControl.prototype.createCat_ = function(text,div){
  var plus;
  var onclick;
  if (div){
    plus = document.createElement("div");
    plus.style.display = "inline";
    plus.style.marginLeft = "10px";
    plus.style.display = "inline";
    plus.style.cssFloat = "right";
 //   plus.style.float = "right";
    plus.style.styleFloat = "right"; // fuer IE7
    plus.appendChild(document.createTextNode("+"));
    onclick = function(){
      if (div.style.display == "none"){
        div.style.display = "block";
        plus.firstChild.nodeValue = "-";
      }else{
        div.style.display = "none";
        plus.firstChild.nodeValue = "+";
      }
    };
  }
  var buttonDiv = this.createButton_(text,onclick);
  if (plus){
    buttonDiv.firstChild.appendChild(plus);
  }
  buttonDiv.style.fontStyle = "italic";
  buttonDiv.style.backgroundColor = "#D0D0D0";
  return buttonDiv;
}
LayerControl.prototype.fillLegend_ = function(legendDiv,arr,stride){
  var rowDiv;
  var chipDiv;
  var textDiv;
  var nchips = stride-1;
  if (nchips < 0){
    nchips = 0;
  }else
  if (nchips > 4){
    nchips = 4;
  }
  var chipHTML = [ 0,
"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
"&nbsp;&nbsp;&nbsp;",
"&nbsp;&nbsp;",
"&nbsp;" ][ nchips ];
  if (stride <= 0){
    stride = 1;
  }
  for(var i = 0; i+stride-1 < arr.length;){
    rowDiv = document.createElement("div");
    rowDiv.style.clear = "both";
    rowDiv.style.margin = "1px";
    for(var iz = 2; iz <= stride; iz++){
      chipDiv = document.createElement("div");
      chipDiv.style.backgroundColor = arr[i++];
      chipDiv.style.display = "inline";
      chipDiv.innerHTML = chipHTML;
      rowDiv.appendChild(chipDiv)
    }
    textDiv = document.createElement("div");
    textDiv.style.marginLeft = "15px";
    textDiv.style.display = "inline";
    textDiv.appendChild(document.createTextNode(arr[i++]));
    rowDiv.appendChild(textDiv);
    legendDiv.appendChild(rowDiv);
  }
}
LayerControl.prototype.createOvl_ = function(map,cat,id,text,
    displayed,switched,color,mapLayer,legend,tile){
  var me = this;
  var st_mapLayer = mapLayer;
  var buttonDiv = document.createElement("div");
  buttonDiv.className = "layer-control-toggle-layer "+id; // layer name is used here UNDONE
  buttonDiv.style.margin = "1px";
  var textDiv = document.createElement("div");
  textDiv.style.marginLeft = "15px";
  var chipDiv;
  if (color){
    chipDiv = document.createElement("div");
    chipDiv.style.marginRight = "15px";
    chipDiv.style.display = "inline";
    chipDiv.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    textDiv.appendChild(chipDiv);
  }
  textDiv.appendChild(document.createTextNode(text));
  buttonDiv.appendChild(textDiv);
  if (legend){
    buttonDiv.appendChild(legend);
  }
  if (displayed){
    if (cat){
      cat.n_on++;
      cat.div.style.fontWeight = "bold";
    }
    textDiv.style.fontWeight = "bold";
    if (color){
      chipDiv.style.backgroundColor = color;
    }
    if (legend){
      legend.style.display = "block";
    }
  }
  if (mapLayer){
    for(var i=0;i<mapLayer.length;i++){
      var L = mapLayer[i];
      google.maps.event.addListener(L, "status_changed", function(){
        me.showStatus(buttonDiv,L.getStatus());
      });
    }
  }
  if (switched && mapLayer){
//console.log("click");
    google.maps.event.addDomListener(buttonDiv, "click", function(){
      buttonDiv.title = '';
      if (mapLayer.length && mapLayer[0].visible){
        for(var i=0;i<mapLayer.length;i++){
          mapLayer[i].setMap(null);
          mapLayer[i].visible = false;
        }
        if (cat){
          cat.n_on--;
          if (cat.n_on == 0){
            cat.div.style.fontWeight = '';
          }
        }
        textDiv.style.fontWeight = '';
        if (color){
          chipDiv.style.backgroundColor = '';
        }
        if (legend){
          legend.style.display = "none";
        }
      }else{
        for(var i=0;i<mapLayer.length;i++){
          mapLayer[i].setMap(map);
          mapLayer[i].visible = true;
        }
        if (cat){
          cat.n_on++;
          cat.div.style.fontWeight = "bold";
        }
        textDiv.style.fontWeight = "bold";
        if (color){
          chipDiv.style.backgroundColor = color;
        }
        if (legend){
          legend.style.display = "block";
        }
      }
    }, true);
  }
  if (mapLayer){
    google.maps.event.addListener(buttonDiv, "nullify", function(){
      if (mapLayer.length && mapLayer[0].visible){
        for(var i=0;i<mapLayer.length;i++){
          mapLayer[i].setMap(null);
          mapLayer[i].visible = false;
          google.maps.event.clearInstanceListeners(mapLayer[i]);
        }
        if (cat){
          cat.n_on--;
          if (cat.n_on == 0){
            cat.div.style.fontWeight = '';
          }
        }
        textDiv.style.fontWeight = '';
        if (color){
          chipDiv.style.backgroundColor = '';
        }
        if (legend){
          legend.style.display = "none";
        }
      }
      this.style.color =  '#eeeedd';
      this.style.backgroundColor =  '#eeeedd';
      google.maps.event.clearInstanceListeners(this);
    });
    google.maps.event.addListener(buttonDiv, "updateMapLayer", function(url){
      var visible = (mapLayer.length && mapLayer[0].visible)
      || (textDiv.style.fontWeight == "bold");
if (me.layerOptions.addMore > 0) {
    me.layerOptions.addMore = 0;
      for(var i=0;i<mapLayer.length;i++){
        mapLayer[i].setMap(null);
        google.maps.event.clearInstanceListeners(mapLayer[i]);
      }
      mapLayer = new Array();
}
      if (me.isArray(url)){
        var len = url.length;
        for(var i=0;i<len;i++){
          if (typeof url[i] == 'string') {
            mapLayer[mapLayer.length]
= new google.maps.KmlLayer(url[i],me.layerOptions);
            me.layerOptions.preserveViewport = true;
          }
        }
      }else if (typeof url == 'string') {
        mapLayer[mapLayer.length]
= new google.maps.KmlLayer(url,me.layerOptions);
        me.layerOptions.preserveViewport = true;
      }
      for(var i=0;i<mapLayer.length;i++){
        mapLayer[i].visible = false;
        if (visible){
	  mapLayer[i].setMap(map);
          mapLayer[i].visible = true;
        }
      }
    });
  }
  if (tile && !me.isEmpty(tile)) {
//    var ztile = jQuery.extend({},tile);
//console.log(tile);
    google.maps.event.addListener(map, "updateMapLayer", function(){
      var visible = false;
      var view = map.getBounds();
      var zoom = map.getZoom();
      var new_layer = new Array();
      var i;
      for(i=0;i<mapLayer.length;i++) {
        if (mapLayer[i] && mapLayer[i].visible) {
          visible = true;
          break;
        }
      }
      for (;view && zoom > 0 && new_layer.length == 0;zoom--) {
        var obj = tile[zoom];
        var tile_no = (me.isArray(obj)? obj.length: 0);
//console.log(zoom,tile_no);
        while (tile_no-- > 1) {
          if (view.intersects(obj[tile_no].bbox)) {
            for(i=0;i<mapLayer.length;i++) {
              if (mapLayer[i]) {
                if (mapLayer[i].getUrl() == obj[tile_no].url) {
                  new_layer[new_layer.length] = mapLayer[i];
                  mapLayer[i] = null;
                  break;
                }
              }
            }
            if (i<mapLayer.length) {
              continue;
            }
            if (!obj[tile_no].layer) {
              me.layerOptions.preserveViewport = true;
              var L = new google.maps.KmlLayer(
                obj[tile_no].url,me.layerOptions);
              L.visible = false;
      google.maps.event.addListener(L, "status_changed", function(){
        me.showStatus(buttonDiv,L.getStatus());
      });

            }
            new_layer[new_layer.length] = L;
          }
        }
      }
      if (new_layer.length == 0) {
        new_layer = st_mapLayer;
      }
      for(i=0;i<mapLayer.length;i++) {
        if (mapLayer[i]) {
          mapLayer[i].visible = false;
          mapLayer[i].setMap(null);
          google.maps.event.clearInstanceListeners(mapLayer[i]);
        }
      }
      if (visible)
      for(i=0;i<new_layer.length;i++) {
        if (!new_layer[i].getMap()) {
          new_layer[i].setMap(map);
        }
        new_layer[i].visible = true;
      }
      mapLayer = new_layer;
    });
  }
  return buttonDiv;
}
LayerControl.prototype.createDiv_ = function(){
  var div = document.createElement("div");
  div.style.clear = "both";
  div.style.display = "none";
  div.style.padding = "1px";
  div.style.margin= "2px";
  return div;
}

// Click Map Buttons
LayerControl.prototype.assignButtonEvent_ = function(div,map,mapType,others){
  var me = this;
  google.maps.event.addDomListener(div, "click", function(){
    if (others)
    for (var i = 0; i < others.length; i++){
      others[i].firstChild.style.fontWeight = '';
    }
    div.firstChild.style.fontWeight = 'bold';
    map.setMapTypeId(mapType);
  }, true);
}
