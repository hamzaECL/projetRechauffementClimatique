## RC : Visualisations about sea-level rise

<br/>

Authors : <a href="https://github.com/hamzaECL">Hamza Beqqi</a> | Mehdi El-Yaakabi

<a href="https://hamzaecl.github.io/projetRechauffementClimatique">Website</a>

### Introduction


50% of the world's population lives on coasts in contact with the sea. This makes half of the world population open to the dangers of climate change, especially sea-level rise. the latter is obviously not the only cause of displacement of populations : Desertification, climate change, drought and natural disasters are examples of phenomena that can generate climate refugees. And although the other effects mentioned above are more likely to affect populations in the short to medium term, sea-level rise is potentially one of the most devastating phenomena in the scenarios in which it would occur. 

This project consists of a number of visualisations showing the effects of Sea-level rise on populations. With this visualization, we hope to show the extent of this phenomenon by visualizing the submerged zones in different scenarios that range from the most optimistic to the most catastrophic (+70 m of climb), the most affected countries, and the displaced rate of population in each country. 


### DATA

The data we used to build our visualisations are contained in the following files: 

<ul>
	<li> <strong>"world_countries. json"</strong>: containing the coordinates of each country in the world, to be able to draw the map of the world.</li>
	<li><strong>"world_population. tsv"</strong>: containing the name and population of each country in the world, in order to calculate the displaced rate.</li>
	<li><strong>"world_cities. csv"</strong>containing the cities, the country to which they belong, longitude, latitude and altitude. </li>
	<li><strong>The Comparative measure</strong>: utilisé comme marqueur cible pour être comparé avec la barre principale</li>
	<li><strong>"cities_populations.csv"</strong>: which contains the cities and their population.</li>
</ul>

### Visualisations : 


#### Rising sea levels threaten millions of people in Coastal Cities

Global warming is causing the oceans to absorb a lot of extra heat (up to 90%). The estimates predict anywhere from 75 cm to 2 m of sea level rise by 2100. But what if ALL ice melted ? It's a 70m sea level rise. 

By comparing the elevation of the countries with the value of altitude of each city and then conclude on the state of the city : submerged or not.

In our first visualisation we built a zoomable map indicating the cities that will be affected by a rise of sea-level. It contains a slider that you can adjust to the wanted sea-level, then the submergedged cities will be colored in light-blue. 

<p align="center">
  <img src=img/map.png>
</p>


#### How does sea level rise affect individual countries 

Some countries and cities are particuliarly at risk of flooding due to higher sea levels. Clearly, some regions have it harder than others. If a city like Shanghai is flooded, it would mean a disaster for the 17,5 people living there who would have to relocate. In the same way, some countries are much more affected by the rising sea levels. Island countries like Maldives (highest point of 2,4 meters) can be entirely submerged in the future. 

By having the list of submerged cities, and extracting the population of each city, we can calculate the number of displaced population for each country. 

In the next visualisation we wanted to see the most affected countries, in terms of displaced population, by a rise of sea-level. the visualisation allows you to choose the level of elevation, and then prints a decreasing bar chart indicating the number of population displaced in each country.     

<p align="center">
  <img src=img/most_affected_countries.png>
</p>


#### How does sea level rise affect individual countries 

In the final visualisation we show the rate of displaced countries in each country, you can select the country and then the visualisation prints a line chart showing the variations of the rate of displaced population while the elevation level is increasing. 

<p align="center">
  <img src=img/displaced_rate.png>
</p>
