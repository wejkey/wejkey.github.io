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
let previewLine = null;
let saveCount = 1;  

const lightTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

let currentLayer = L.tileLayer(lightTiles, {
    maxZoom: 18,
    subdomains: 'abcd',
    attribution: '© OpenStreetMap contributors © CartoDB'
}).addTo(map);

document.getElementById('themeToggleButton').onclick = function() {
    map.removeLayer(currentLayer);
    if (currentLayer._url === lightTiles) {
        currentLayer = L.tileLayer(darkTiles, {
            maxZoom: 18,
            subdomains: 'abcd',
            attribution: '© OpenStreetMap contributors © CartoDB'
        }).addTo(map);
        document.getElementById('themeToggleButton').textContent = '☀️';
    } else {
        currentLayer = L.tileLayer(lightTiles, {
            maxZoom: 18,
            subdomains: 'abcd',
            attribution: '© OpenStreetMap contributors © CartoDB'
        }).addTo(map);
        document.getElementById('themeToggleButton').textContent = '🌙';
    }
};

function startPath() {
    if (isDrawing) return;

    isDrawing = true;
    tempLatLngs = [];

    if (polyline) {
        map.removeLayer(polyline);
    }

    polyline = L.polyline(tempLatLngs, { color: 'blue' }).addTo(map);
    previewLine = L.polyline([], { color: 'blue', dashArray: '5, 10' }).addTo(map);

    map.on('click', updatePath);
    map.on('mousemove', previewPath);

    document.getElementById('stopButton').disabled = false;
    document.getElementById('saveButton').disabled = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('undoButton').disabled = true;
}

function stopPath() {
    isDrawing = false;
    map.off('click', updatePath);
    map.off('mousemove', previewPath);

    if (previewLine) {
        previewLine.remove();
        previewLine = null;
    }

    document.getElementById('stopButton').disabled = true;
    document.getElementById('saveButton').disabled = false;
    document.getElementById('startButton').disabled = false;
}

function updatePath(e) {
    if (!isDrawing) return;
    const latlng = e.latlng;
    tempLatLngs.push(latlng);
    polyline.addLatLng(latlng);
    document.getElementById('undoButton').disabled = tempLatLngs.length === 0;
    calculateWalkingTime();
}

function previewPath(e) {
    if (!isDrawing) return;
    const latlng = e.latlng;
    previewLine.setLatLngs([...tempLatLngs, latlng]);
}

function undoPath() {
    if (tempLatLngs.length === 0) return;
    tempLatLngs.pop();
    polyline.setLatLngs(tempLatLngs);
    previewLine.setLatLngs(tempLatLngs);

    document.getElementById('undoButton').disabled = tempLatLngs.length === 0;
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
            <title>Saved Bike Path</title>
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
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

                const polyline = L.polyline(savedPathData, { color: 'blue' }).addTo(map);
            </script>
        </body>
        </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bike_path_${saveCount}.html`;
        link.click();

        saveCount++;
    }
}

function calculateWalkingTime() {
    if (!polyline || tempLatLngs.length < 2) {
        document.getElementById('timeEstimate').innerText = 'No valid path to calculate time for!';
        return;
    }

    let totalLength = 0;
    for (let i = 1; i < tempLatLngs.length; i++) {
        totalLength += tempLatLngs[i-1].distanceTo(tempLatLngs[i]);
    }

    const walkingSpeed = 1.4; 
    const timeInSeconds = totalLength / walkingSpeed;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);
    document.getElementById('timeEstimate').innerText = `Estimated walking time: ${minutes} min ${seconds} sec`;
}
