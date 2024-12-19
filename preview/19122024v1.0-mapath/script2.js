// Function to fetch POIs dynamically from Overpass API
function fetchPOIs(cityCoordinates) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const POIs = [
        { name: "Mestská veža (City Tower)", lat: 48.3772, lon: 17.5886 },
        { name: "City Arena", lat: 48.3739, lon: 17.5924 },
        { name: "Trnava Synagogue", lat: 48.3761, lon: 17.5883 },
        { name: "St. John the Baptist Cathedral", lat: 48.3758, lon: 17.5894 },
        { name: "Trnava City Hall", lat: 48.3755, lon: 17.5889 },
        { name: "Trnava Castle", lat: 48.3748, lon: 17.5865 },
        { name: "Katedrála sv. Jána Krstiteľa", lat: 48.3750, lon: 17.5891 },
        { name: "Trojičné námestie", lat: 48.3751, lon: 17.5913 },
        { name: "Janko Kráľ Park", lat: 48.3732, lon: 17.5905 },
        { name: "Arena Shopping Mall", lat: 48.3740, lon: 17.5910 },
        // Add more POIs here
    ];
    
    // Loop through and add each POI to the map
    POIs.forEach(poi => {
        L.marker([poi.lat, poi.lon])
            .addTo(map)
            .bindPopup(`<b>${poi.name}</b>`);
    });
    
    
    fetch(overpassUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(query)
    })
    .then(response => response.json())
    .then(data => {
        // Process POIs data and add to the map
        data.elements.forEach(poi => {
            const poiLocation = [poi.lat, poi.lon];
            const poiName = poi.tags.name || "Unnamed POI";
            const poiDescription = poi.tags.description || "No description available";
            
            L.marker(poiLocation)
                .addTo(map)
                .bindPopup(`<b>${poiName}</b><br>${poiDescription}`);
        });
    })
    .catch(error => console.error('Error fetching POIs:', error));
}

// Example usage
const trnavaCoordinates = { north: 48.404, south: 48.385, west: 17.589, east: 17.648 };  // Bounding box for Trnava
fetchPOIs(trnavaCoordinates);
