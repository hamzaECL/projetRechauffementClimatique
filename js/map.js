    var margin = {
          top: 20,
          right: 20,
          bottom: 25,
          left: 40
      },
      width = 1300 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#mappage")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.behavior.zoom().on("zoom", function () {
          svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            }))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var tooltip = d3.select("#mappage")
          .append("div")
          .attr("class", "hidden tooltip");
    
  var projection = d3.geo.mercator();
    var path = d3.geo.path().projection(projection);

    d3.json('data/world_countries.json', function(countries){

      var group = svg.selectAll("g")
                .data(countries.features)
                .enter()
                .append("g")
      var areas = group.append("path")
              .attr("class", "country")
              .attr("d", path)
        
      group.on('mousemove', function(d){  
          var mouse = d3.mouse(svg.node()).map(function(d) {
          return parseInt(d);
          });
          tooltip.classed('hidden', false)
                    .attr('style', 'left:' + (mouse[0] + 15) +
                             'px; top:' + (mouse[1] - 35) + 'px')
                    .html(d.properties.name);
            })
            .on('mouseout', function() {
                tooltip.classed('hidden', true);
              });
    })
  
    var elevations_nbr = 1001; 
    var elevations_array = Array.apply(null, {length: elevations_nbr}).map(Number.call, Number);
    var origine = elevations_array[0];
    d3.select('#elevation').html('Elevation : ' + origine);
  d3.select("#slider").on("input", function() {
          updateViz(+this.value);
        });

    function updateViz(val){
    d3.select('#elevation').html('Elevation : ' + elevations_array[val]);
    drawMap(elevations_array[val]); 
  };

  function drawMap(current_elevation){
    svg.selectAll('circle').remove();
    var emerged_cities = [];
    console.log(current_elevation);
    d3.csv('data/world_cities.csv', function(cities){
      for(var i = 0; i < cities.length; i ++){
        if(cities[i].altitude <= current_elevation){
          emerged_cities.push(cities[i]);
        }
      }
    console.log(emerged_cities.length)
    svg.selectAll('circle')
      .data(emerged_cities)
      .enter()
      .append('circle')
      .attr('cx', function(d){
        return projection([d.longitude, d.latitude])[0];
    })
      .attr('cy', function(d){
        return projection([d.longitude, d.latitude])[1];
    })
      .attr('r', '0.8')
      .style('fill', 'lightblue');
    
    });        
    
  };

