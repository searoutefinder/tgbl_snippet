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
			return div;
		}
		function radiusReset(){
			tgblLayer.setFilter(function(larder){
				var item = createSidebarEntry(larder);
				$("#sidebar").append(item); 
				return true;
			});
		}
		function radiusSearch(lat, lng, radius){
			$("#sidebar").html("");
			var bounds = L.latLngBounds();
			tgblLayer.setFilter(function(larder){
            	if (turf.distance(turf.point(larder.geometry.coordinates), turf.point([parseFloat(lng), parseFloat(lat)]), 'miles') <= parseInt(radius)){
            		bounds.extend([parseFloat(lng), parseFloat(lat)]);
            		var item = createSidebarEntry(larder);
					item.find('a').on('click', function(e){
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

					$("#sidebar").append(item);  

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

				console.log(data);
				map.setView([data.lat, data.lng], 12);
				$("#location").attr("data-lat", data.lat);
				$("#location").attr("data-lng", data.lng);		

			}); 

			
			
			tgblLayer.on('layeradd', function(e){
				var marker = e.layer;
				
				marker.on('click', function(e){
					var content = '<p>Content for seller: ' + e.target.feature.properties.seller + '</p>';
					popup.setLatLng(e.target.getLatLng());
					popup.setContent(content);
					popup.openOn(map);					
				});	

				var item = createSidebarEntry(marker.feature);
				item.find('a').on('click', function(e){
					e.preventDefault();
					var ID = $(this).attr('data-id');
					tgblLayer.eachLayer(function(l){						
						if(l.feature.id == ID){
							map.setView(l.getLatLng(), 15);
							l.fireEvent('click');
						}
					});
				});
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