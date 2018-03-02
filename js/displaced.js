
    var margin = {
                  top: 25,
                  right: 20,
                  bottom: 25,
                  left: 40
              },
              width = 860 - margin.left - margin.right,
              height = 460 - margin.top - margin.bottom;
    

    // charger les données
    d3.queue()
      .defer(d3.tsv, "data/world_population.tsv")
      .defer(d3.csv, "data/cities_populations.csv")
      .defer(d3.csv, "data/world_cities.csv")
      .await(build_plot);
  
    
    function build_plot(error, countries_population, cities_population, cities) {
      if(error) { console.log(error); }
      // remplir la liste déroulante des noms des pays 
      countries_names = [];
      for(var i = 0; i < countries_population.length; i++){
        countries_names.push(countries_population[i].name)
      }
      countries_names.sort();
      
      var select = d3.select('#zoompage')
                    .append('div')
                    .attr('class', 'dropdown_list')
                    .append('select')
                    .attr('class','select_2')
                    .on('change',onchange)

      var options = select.selectAll('option')
                          .data(countries_names).enter()
                          .append('option')
                          .text(function (d) { return d; })
      
      // ajouter l'élément svg de sorti 
      var svg = d3.select("#zoompage")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
        // la fonction qui change de plot en fonction du pays choisi

      function onchange() {
          var country_name = d3.select('.select_2').property('value')
          var elevations_nbr = 60;
          var elevations_array = Array.apply(null,{length:elevations_nbr}).map(Number.call, Number);
        
          var displaced_rate = [];
        // calcul du taux déplacé pour chaque niveau d'élévation
        for (var i =0; i< elevations_nbr; i++){
            current_elevation = elevations_array[i];
            // trouver les villes du pays en question affectées 
            var emerged_cities = [];
            for (var j=0; j < cities.length; j++){
              if(cities[j].country === country_name && cities[j].altitude <= current_elevation){
                emerged_cities.push(cities[j].city);
              }
            }
            // calcul de la population déplacée pour ce niveau d'élévation
          var displaced_population = 0;
          for (var l =0; l < emerged_cities.length; l++){
            for(var k = 0; k < cities_population.length; k++){
              if(emerged_cities[l] === cities_population[k].city){
                displaced_population = displaced_population + (+(cities_population[k].population)); 
                break;
              }
            }
          }

          // population du pays 
          var country_population;      
          for (var j = 0; j < countries_population.length; j++){
            if(countries_population[j].name === country_name){
              country_population = +countries_population[j].population;
              break;
            }
          }

          
          // ajouter le taux déplacé par niveau élévation 
          
          displaced_rate.push(100*displaced_population/country_population);          
        }  
        var dataset = [];
        for(var i=0; i< elevations_array.length; i++){
          dataset.push({x: elevations_array[i], y: displaced_rate[i]});
        }
        var xScale = d3.scaleLinear()
        .domain([0, elevations_array.length -1]) // input
        .range([30, width])
        .nice(); // output

        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
        .domain([0, 100]) // input 
        .range([height, 0])
        .nice(); // output

        var line = d3.line()
        .x(function(d , i) { return xScale(+d.x); }) 
        .y(function(d) { return yScale(+d.y); })                        													 .curve(d3.curveMonotoneX) // apply smoothing to the line
				
        svg.selectAll('.line').remove();
        svg.selectAll('.dot').remove();
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        
        svg.append("g")
          .attr("class", "y axis")
        	.attr("transform", "translate(30,0)")
          .call(d3.axisLeft(yScale))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Population");
        
        svg.append("g")
        	.append('text')
          .attr('class', 'axis-label')
          .attr('x', '120')
          .attr('y', '0')
          .style('text-anchor', 'middle')
          .text('Displaced population rate');
        
        svg.append("g")
        	.append('text')
          .attr('class', 'axis-label')
          .attr('x', width - 20)
          .attr('y', height -20)
          .style('text-anchor', 'middle')
          .text('Elevation');
        
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line);
        svg.selectAll(".dot")
   				  .data(dataset)
  					.enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d) { return xScale(+d.x) })
            .attr("cy", function(d) { return yScale(+d.y) })
            .attr("r", 2);
        
        
      };

    }


