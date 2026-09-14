[out:json][timeout:60];
area["boundary"="administrative"]["name"="Warszawa"]["admin_level"="6"]->.searchArea;
(
  node["amenity"="toilets"](area.searchArea);
  way["amenity"="toilets"](area.searchArea);
);
out center meta;
