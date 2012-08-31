
/*
Provided to us by Byron

*/

var md_map;
var md_map_overlay_selector;
var isMapDragging = false;
var idleSkipped =false;
function resizeFactorMap() { if (md_map) google.maps.event.trigger(md_map,'resize'); }
function boundsChangedFactorMap() { $('#map_canvas-status-wrapper').html("Bounds change"); }

function md_update_map(key,layer) {
  if (typeof layer == 'string') {
    $(key+'-status-wrapper').html(layer);
    return layer;
  }
  if (layer) {
    layer.canvas_selector = key + '-legend';

    if (!md_map && document.getElementById) {
      var ctx = document.getElementById(key);
      var myOptions = {
          center: new google.maps.LatLng(34.038,-117.6),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          overviewMapControl: true,
	  scaleControl: true,
      };
	  
		md_map = new google.maps.Map(ctx,myOptions);
		jQuery.getJSON("resources/legend.json",function(data){
				md_map_overlay_selector = new LayerControl(data,
					{"map_width":"400",
					"map_height":"300",
					"map_legend_label":"Legend",
					"map_legend_singleton_category":"show",
					"map_background":"terrain",
					"map_background_options":"Map,Terrain,Satellite,Aerial",
					"map_lat":"49",
					"map_legend_latlong":"on",
					"map_legend_location":"on_map",
					"map_legend_open":"all",
					"map_long":"120",
					"map_zoom":"6",
					"map_legend_live":"none"
					});
				  ctx = document.getElementById(key + "-legend");
				  ctx.appendChild(md_map_overlay_selector.initialize(md_map));
				google.maps.event.addListener(md_map, 'idle', function() {
					if (isMapDragging) {
						idleSkipped = true;
						return;
					}
					idleSkipped = false;
					google.maps.event.trigger(md_map,'updateMapLayer');
				});
				google.maps.event.addListener(md_map, 'dragstart', function() {
					isMapDragging = true;
				});
				google.maps.event.addListener(md_map, 'dragend', function() {
					isMapDragging = false;
					if (idleSkipped == true) {
						google.maps.event.trigger(md_map,'updateMapLayer');
						idleSkipped = false;
					}
				});
				google.maps.event.addListener(md_map, 'bounds_changed', function() {
					idleSkipped = false;
				});
				$(key+'-status-wrapper').html("&nbsp;");
				md_map_overlay_selector.updateOvl(layer);
				google.maps.event.trigger(md_map,'resize');
		});
    }
	
		if (md_map && md_map_overlay_selector) {
		  md_map_overlay_selector.updateOvl(layer);
		  google.maps.event.trigger(md_map,'resize');
		} else {
		  $(key+'-status-wrapper').html("not_supported_msg");
		}
	
		return 'layer_loaded_msg';
	}
	return 'empty_layer_msg';
	}



function googleMapFacetLegendSetup(mapElementId) {
	md_update_map( mapElementId,
		{"id": "theme",
		 "category": " p 2841 5095 colored by:",
		 "name": "theme",
		 "title": "p 2841 5095: Buildout industrial employment",
		 "displayed": 1,
		 "switched": 1,
		 "url": "resources/i_nodes_PCS0001__3cd87fbe.kmz", //"http://localhost:81/byrons/i_nodes_PCS0001__3cd87fbe.kmz",
		 "legend": [ "#FFFFFF",
			 "#FFFFFF",
			 "#FFFFFF",
			 "#FFFFFF",
			 "#FFFFFF",
			 "below",
			 "#65FE65",
			 "#5FF582",
			 "#5AED9F",
			 "#54E4BC",
			 "#4FDBD9",
			 "4.0E-7 and up to 10",
			 "#4FDBD9",
			 "#4FB8D9",
			 "#4F95DA",
			 "#4F72DB",
			 "#4F4FDB",
			 "10 and up to 20",
			 "#4F4FDB",
			 "#724FD9",
			 "#954FD7",
			 "#B84FD5",
			 "#DB4FD3",
			 "20 and up to 30",
			 "#DB4FD3",
			 "#DB4FB2",
			 "#DB4F91",
			 "#DB4F70",
			 "#DB4F4F",
			 "30 and up to 40",
			 "#CC0000",
			 "#CC0000",
			 "#CC0000",
			 "#CC0000",
			 "#CC0000",
			 "above" ],
		 "stride": 6,
		 "color": "" 
		}
	);
}