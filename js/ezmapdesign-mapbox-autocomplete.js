			(function ( $ ) {
				$.fn.ezMapboxAutocomplete = function(options) {
					var _self = this;
					var _defaults = {
						"sourceInput": "",
						"style": {"margin-top": "0px !important", "border": "1px solid #CCC"},
						"border": {"color": "#CCC", "width": 1},
						"endpoint" : "https://api.tiles.mapbox.com",
						"source" : "mapbox.places",
						"accessToken" : "pk.eyJ1IjoibG9laXpib3VyZGljIiwiYSI6ImNpd3cwcm9tdzAwa2kyeW1nbXYyZmN6Z3AifQ.RbguYDUc8vbF8T5U8JnzcQ",
						"proximity" : "",
						"bbox": "",
						"latest": null,						
						"types": ["place"]		
					};
					var _opts = $.extend({}, _defaults, options);

					var _autocompleteContainer = $('<div class="ez-mapbox-autocomplete" style="display:none;z-index:9999;position:absolute;"></div>');
					var _autocompleteList = $('<ul class="ez-mapbox-autocomplete-list"></ul>').css(_opts.style);

					_autocompleteContainer.append(_autocompleteList);
					
					function ezsearch(endpoint, source, types, accessToken, proximity, bbox, query, callback){
						var searchTime = new Date();
						var uri = endpoint + '/geocoding/v5/' + source + '/' + encodeURIComponent(query) + '.json' + '?' + ((types.length>0) ? '&types=' + types.join(",") : '') +'&access_token=' + accessToken + (proximity ? '&proximity=' + proximity : '') + (bbox ? '&bbox=' + bbox : '');
						$.get(uri, function(res, err, body){
							//console.log([res, err, body, searchTime]);
							callback(res, err, body, searchTime);		
						});					
					}					
					function handleResponse(res, err, body, searchTime){
						if(err == "success"){
							_opts.latest = $.extend({}, res);
							populate(_opts.latest);
						}
					}
					function populate(res){
						_autocompleteList.html("");
						if(res.features.length > 0){
							for(i=0;i<res.features.length;i++){
								var feature = res["features"][i];
								var city, postcode, country, shortcode, place = "";

								if(feature["id"].indexOf("place") > -1){
									place = feature["place_name"];
								}

								for(j=0;j<feature.context.length;j++){
									if(feature.context[j]["id"].indexOf("country") > -1){
										country = feature.context[j]["text"];
										shortcode = feature.context[j]["short_code"];
										if(_opts.hasOwnProperty("fromCountry")){
											if(shortcode != _opts.fromCountry.iso.toLowerCase()){return false;}
										}										
									}
									else if(feature.context[j]["id"].indexOf("region") > -1){
										city = feature.context[j]["text"];
									}
								}				
								if(feature["id"].indexOf("place") > -1){
									if(place.length > 60){
										var placestring = place.substring(0, 55) + "...";
									}
									else
									{
										var placestring = place;
									}

									var $li = $("<li class='ez-mapbox-autocomplete-holder'><a href='#' title='" + place + "' class='ez-mapbox-autocomplete-item' data-location='" + [feature.text, country, shortcode ].join(";") + "' data-latlng='"+ feature.center.join(",") + "'><span><i class='fa fa-map-marker' aria-hidden='true'></i></span>" + [feature.text, country].join(", ") + "</a></li>");
									$li.find("a").on("click", function(e){
										e.preventDefault();
										select_and_transfer_geodata($(this));
									});
									$li.appendTo(_autocompleteList);
								}	
							}
						}
						else
						{
							var $li = $("<li class='ez-mapbox-autocomplete-holder'><a href='#' class='ez-mapbox-autocomplete-item ez-mapbox-autocomplete-noresult'><span><i class='fa fa-info-circle' aria-hidden='true'></i></span>No suggestions available</a></li>");
							$li.find("a").on("click", function(e){
								e.preventDefault();
							});							
							$li.appendTo(_autocompleteList);			
						}
						_autocompleteContainer.show();						
					}					
					function select_and_transfer_geodata($selected){
						if(_opts.hasOwnProperty("suggestionCallback")){
							if(Object.prototype.toString.call(_opts.suggestionCallback) == '[object Function]'){
								_opts.suggestionCallback($selected.attr("data-latlng").split(","));
							}
						}
						_self.attr("data-latlng", $selected.attr("data-latlng"));
						_self.attr("data-location", $selected.attr("data-location"));
						_self.val($selected.text());
						_self.blur();
						_autocompleteContainer.hide();

						if($._data(_self.get(0), "events").hasOwnProperty("place_changed")){
							var coordinates = $selected.attr("data-latlng").split(",");
							var attributes = $selected.attr("data-location").split(";");
							_self.trigger("place_changed", {
								"lat": parseFloat(coordinates[1]), 
								"lng": parseFloat(coordinates[0]), 
								"place": {
									"text": attributes[0],
									"country": attributes[1],
									"countrycode": attributes[2]	
								}
							});
						}	
					}
					

					this.after(_autocompleteContainer);
					
					this.on("click", function(){
					    if(_opts.latest != null){
							_self.val('');
							populate(_opts.latest);
						}
					});
					
					this.on("keyup", function(e){						
						if($(this).val() == ""){
							_autocompleteContainer.hide();
							return false;
						}
						$('.ez-mapbox-autocomplete-list').fadeIn();
						ezsearch(_opts.endpoint, _opts.source, _opts.types, _opts.accessToken, _opts.proximity, _opts.bbox, $(this).val(), handleResponse);
					});

					return this;
				};	
			}( jQuery ));	