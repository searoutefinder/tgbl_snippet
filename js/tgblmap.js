L.mapbox.accessToken = 'pk.eyJ1IjoicnBlcnJ5IiwiYSI6ImNpemUzaXhwcDAwNW4ycWt5YWRieXEwN3UifQ.IuhBNAbJqVkNza_Yne8CtA';
		var map = null;
		var popup = L.popup({'offset': L.point(0, -25)});
		var tgblLayer = L.mapbox.featureLayer();		

		function pointBuffer (pt, radius, units, resolution) {
		  	var ring = []
		  	var resMultiple = 360/resolution;
		  	for(var i  = 0; i < resolution; i++) {
		    	var spoke = turf.destination(pt, radius, i*resMultiple, units);
		    	ring.push(spoke.geometry.coordinates);
		  	}
		  	if((ring[0][0] !== ring[ring.length-1][0]) && (ring[0][1] != ring[ring.length-1][1])) {
			    ring.push([ring[0][0], ring[0][1]]);
		  	}
		  	return turf.polygon([ring])
		}
		function createSidebarEntry(feature){
			var div = $("<div class='sb_seller_container'>");
			div.append($('<a href="#" class="sb_seller" data-id="' + feature.id + '">' + feature.properties.seller + '</a>'));
			div.find('a').on('click', function(e){
				e.preventDefault();
				var ID = $(this).attr('data-id');
				tgblLayer.eachLayer(function(l){						
					if(l.feature.id == ID){
						console.log([l.feature.id, ID]);
						map.setView(l.getLatLng(), 15);
						l.fireEvent('click');
					}
				});
			});			
			return div;
		}
		function radiusReset(){
			tgblLayer.setFilter(function(larder){
				return true;
			});
		}
		function radiusSearch(lat, lng, radius){
			$("#sidebar").html("");

			tgblLayer.setFilter(function(larder){
				var distance = turf.distance(
					turf.point(larder.geometry.coordinates), 
					turf.point([parseFloat(lng), parseFloat(lat)]),
					{"units": "miles"}
					);
            	if ( distance <= parseInt(radius) ){
            		return true;
            	}
            	return false;	
        	});		
		}	
		$(document).on('ready', function(){	

			map = L.mapbox.map('map', 'mapbox.streets');
			map.setView([54, -1], 5);

			var autocomplete = $("#location").ezMapboxAutocomplete(
				{
					"style": {
						"margin-top": 0, 
						"border": "1px solid #CCC"
					}
				}
			);
			autocomplete.on("place_changed", function(e, data){
				map.setView([data.lat, data.lng], 12);
				$("#location").attr("data-lat", data.lat);
				$("#location").attr("data-lng", data.lng);		

			}); 
			var simplestyle = {"marker-size": "small", "marker-color": "#FF0000", "marker-symbol": "attraction"};

			for(i=0;i<vendors.features.length;i++){
				vendors.features[i].properties.icon = {
              		"iconUrl": "accomodation_marker.svg",
              		"iconSize": [32, 32], // size of the icon
              		"iconAnchor": [16, 32], // point of the icon which will correspond to marker's location
              		"popupAnchor": [16, -25], // point from which the popup should open relative to the iconAnchor
              		"className": "dot"
          		}				
			}
			
			console.log(vendors.features);
			
			tgblLayer.on('layeradd', function(e){
				var marker = e.layer;
				
				marker.on('click', function(e){
					var content = '<p>Content for seller: ' + e.target.feature.properties.seller + '</p>';
					popup.setLatLng(e.target.getLatLng());
					popup.setContent(content);
					popup.openOn(map);					
				});	

		        var feature = marker.feature;

    			marker.setIcon(L.icon(feature.properties.icon));

				var item = createSidebarEntry(marker.feature);

				$("#sidebar").append(item);
			});

			tgblLayer.setGeoJSON(vendors);

			tgblLayer.addTo(map);

			$("#radiusgo").on('click', function(){
				radiusSearch($("#location").attr("data-lat"), $("#location").attr("data-lng"), $("#mileslist").val());
				map.fitBounds(tgblLayer.getBounds());
			});
			$("#radiusreset").on("click", function(){
				radiusReset();
				map.fitBounds(tgblLayer.getBounds());
			});     	
		});