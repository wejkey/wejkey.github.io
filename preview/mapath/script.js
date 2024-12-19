let map = L.map('map', {
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false,
    maxBounds: [
        [47.75842886022369, 16.84488250599731],
        [49.61391633410873, 22.564011231579537]
    ]
}).setView([48.673753, 19.696059], 8);

let polyline = null;
let tempLatLngs = [];
let isDrawing = false;

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd',
    attribution: '© OpenStreetMap contributors © CartoDB'
}).addTo(map);

map.on('mousemove', function(e) {
    const lat = e.latlng.lat.toFixed(5);
    const lng = e.latlng.lng.toFixed(5); 
    document.getElementById('mouseCoords').innerText = `Coordinates: ${lat}, ${lng}`;
});

function startPath() {
    if (isDrawing) return;

    isDrawing = true;
    tempLatLngs = [];

    if (polyline) {
        map.removeLayer(polyline);
    }

    polyline = L.polyline(tempLatLngs, { color: 'blue', weight: 4 }).addTo(map);

    map.on('click', updatePath);
    map.on('mousemove', previewPath);

    document.getElementById('stopButton').disabled = false;
    document.getElementById('startButton').disabled = true;
    document.getElementById('undoButton').disabled = true;
    document.getElementById('saveButton').disabled = true; 
}

function stopPath() {
    isDrawing = false;

    map.off('click', updatePath);
    map.off('mousemove', previewPath);

    document.getElementById('stopButton').disabled = true;
    document.getElementById('startButton').disabled = false;
    document.getElementById('saveButton').disabled = false; 
}

function updatePath(e) {
    if (!isDrawing) return;

    const latlng = e.latlng;
    tempLatLngs.push(latlng);
    polyline.addLatLng(latlng);

    document.getElementById('undoButton').disabled = tempLatLngs.length === 0;

    calculateMetrics();
}

function previewPath(e) {
    if (!isDrawing) return;

    const latlng = e.latlng;
    polyline.setLatLngs([...tempLatLngs, latlng]);
}

function undoPath() {
    if (tempLatLngs.length === 0) return;

    tempLatLngs.pop();
    polyline.setLatLngs(tempLatLngs);

    calculateMetrics();

    document.getElementById('undoButton').disabled = tempLatLngs.length === 0;
}

function calculateMetrics() {
    if (tempLatLngs.length < 2) {
        document.getElementById('distanceDisplay').innerText = "Distance: 0.00 km";
        document.getElementById('timeDisplay').innerText = "Walking Time: 0.00 min";
        return;
    }

    const distance = tempLatLngs.reduce((acc, latlng, index, arr) => {
        if (index === 0) return acc;
        return acc + map.distance(arr[index - 1], latlng);
    }, 0);

    const distanceInKm = distance / 1000;
    const walkingTime = (distance / 1.4) / 60;

    document.getElementById('distanceDisplay').innerText = `Distance: ${distanceInKm.toFixed(2)} km`;
    document.getElementById('timeDisplay').innerText = `Walking Time: ${walkingTime.toFixed(2)} min`;
}

function savePath() {
    if (polyline && tempLatLngs.length > 0) {
        const pathData = JSON.stringify(tempLatLngs);

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Saved Path</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
            <style>
                body, html { margin: 0; height: 100%; font-family: Arial, sans-serif; background-color: black; color: white; }
                #map { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
            <script>
                const savedPathData = ${pathData};

                let map = L.map('map').setView([48.673753, 19.696059], 8);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 18,
                    subdomains: 'abcd',
                    attribution: '© OpenStreetMap contributors © CartoDB'
                }).addTo(map);

                const savedPath = L.polyline(savedPathData, { color: 'blue' }).addTo(map);
                map.fitBounds(savedPath.getBounds());
            </script>
        </body>
        </html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'map_plan.html';
        a.click();

        URL.revokeObjectURL(url); 
    }
}
