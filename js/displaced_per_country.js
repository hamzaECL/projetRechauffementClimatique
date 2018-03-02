    var margin = {
                  top: 40,
                  right: 40,
                  bottom: 80,
                  left: 80
              },
              width = 960 - margin.left - margin.right,
              height = 460 - margin.top - margin.bottom;
    

    // charger les données
    d3.queue()
      .defer(d3.csv, "data/cities_populations.csv")
      .defer(d3.csv, "data/world_cities.csv")
      .await(build_plot);
  
    
    function build_plot(error, cities_population, cities) {
      if(error) { console.log(error); }
      // remplir la liste déroulante des noms des pays 
      countries_names = [];
      for(var i = 0; i < cities.length; i++){
        if (countries_names.indexOf(cities[i].country) < 0){
        		countries_names.push(cities[i].country)  
        }
      }
      countries_names.sort();
      
      var select = d3.select('#distributionpage')
                    .append('div')
                    .attr('class', 'dropdown_list')
                    .append('select')
                    .attr('class','select')
                    .on('change',onchange)
			
      var elevations_nbr = 60;
      var elevations_array = Array.apply(null,{length:elevations_nbr}).map(Number.call, Number);
      var options = select.selectAll('option')
                          .data(elevations_array).enter()
                          .append('option')
                          .text(function (d) { return 'Elevation : ' + d; })
      
      // ajouter l'élément svg de sorti 
      var svg = d3.select("#distributionpage")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
        // la fonction qui change de plot en fonction du pays choisi

      function onchange() {
      		svg.selectAll('.bar').remove()
          svg.selectAll('.axis').remove()
        	var current_elevation = +d3.select('select').property('value').slice(-1)
        	var displaced_per_country = [];
      		// calcul du taux déplacé pour chaque pays
          for (var i=0 ; i < countries_names.length; i++){
            var emerged_cities = [];

            for (var j=0; j < cities.length; j++){	
              if(cities[j].country === countries_names[i] && cities[j].altitude <= current_elevation){
                    emerged_cities.push(cities[j].city);
                  }
                }

            var displaced_population = 0;
              for (var l =0; l < emerged_cities.length; l++){
                for(var k = 0; k < cities_population.length; k++){
                  if(emerged_cities[l] === cities_population[k].city){
                    displaced_population = displaced_population + (+cities_population[k].population); 
                    break;
                  }
                }
              }
						
						displaced_per_country.push({country: countries_names[i], displaced_pop: displaced_population})

          }
        
        // on ordonne les pays selon les populations déplacées 
        displaced_per_country.sort(function(a,b) {return (a.displaced_pop < b.displaced_pop) ? 1 : ((b.displaced_pop < a.displaced_pop) ? -1 : 0);} );
        
        // choisir les 15 premiers pays qui seront le plus affectés par l'élévation 
        var choosen_data = displaced_per_country.slice(0,16)
        
        var xScale = d3.scaleBand()
          .range([0, width])
          .padding(0.1); 

        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
          .range([height, 0])
        	.nice(); 
        
        var color = d3.scaleLinear()
							.domain([
							Math.min.apply(Math,choosen_data.map(function(o){return o.displaced_pop;})), 
							Math.max.apply(Math,choosen_data.map(function(o){return o.displaced_pop;}))
							])
							.range(["rgb(137,206,255)","rgb(0,43,112)"]);
        
        xScale.domain(choosen_data.map(function(d) { return d.country; }));
  			yScale.domain([0, d3.max(choosen_data, function(d) { return +d.displaced_pop; })]);
        
        
        var tooltip = d3.select("#distributionpage")
                        .append("div")
                        .attr("class", "hidden tooltip");

        
        svg.selectAll(".bar")
            .data(choosen_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.country); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.displaced_pop); })
            .attr("height", function(d) { return height - yScale(d.displaced_pop); })
        		.style("fill", function(d) 
              {
                return color(d.displaced_pop);
              })
        		.on('mousemove', function(d) 
                {	
                  var mouse = d3.mouse(svg.node()).map(function(d) {
                  return parseInt(d);
                  });
                  tooltip.classed('hidden', false)
                            .attr('style', 'left:' + (mouse[0] + 15) +
                                     'px; top:' + (mouse[1] ) + 'px')
                            .html(d.displaced_pop);
                })
						.on('mouseout', function() {
            		tooltip.classed('hidden', true);
            });
				svg.append("g")
        	.append('text')
        	.attr('x', width/2 - margin.left)
          .attr('class', 'titre')
          .text('displaced population per country');

  			// add the x Axis
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
        	 .attr('class', 'axis')
           .call(d3.axisBottom(xScale))
           .selectAll("text")	
           .style("text-anchor", "end")
           .attr("dx", ".8em")
        	 .style("font-size", "15px") 
           .attr("dy", ".75em")
           .attr("transform",  "rotate(-35)");
        
        // add the y Axis
        svg.append("g")
        		.attr('class', 'axis')
            .call(d3.axisLeft(yScale));
        
      };

    }