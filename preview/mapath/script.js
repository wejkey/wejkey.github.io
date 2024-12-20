let map;
let polyline = null;
let tempLatLngs = [];
let isDrawing = false;
let totalDistance = 0;

const lightModeTiles = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const darkModeTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

let currentTileLayer;

function loadLeaflet() {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
    document.body.appendChild(script);
    script.onload = initializeMap;
}

function initializeMap() {
    map = L.map('map', {
        minZoom: 8,
        maxZoom: 18,
        zoomControl: false,
        maxBounds: [
            [47.75842886022369, 16.84488250599731],
            [49.61391633410873, 22.564011231579537]
        ]
    }).setView([48.673753, 19.696059], 8);

    currentTileLayer = L.tileLayer(lightModeTiles, {
        maxZoom: 18,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap contributors © CartoDB'
    }).addTo(map);

    map.on('mousemove', throttleMouseMove);
    map.on('click', updatePath);
}

function throttleMouseMove(e) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        document.getElementById('mouseCoords').innerText = `Coordinates: ${lat}, ${lng}`;
    }, 200);
}

function startPath() {
    if (isDrawing) return;

    isDrawing = true;
    tempLatLngs = [];
    totalDistance = 0; 

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
    if (tempLatLngs.length > 0) {
        totalDistance += map.distance(tempLatLngs[tempLatLngs.length - 1], latlng);
    }
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

    const removedLatLng = tempLatLngs.pop();
    if (tempLatLngs.length > 0) {
        totalDistance -= map.distance(tempLatLngs[tempLatLngs.length - 1], removedLatLng);
    }
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

    const distanceInKm = totalDistance / 1000;
    const walkingTime = (totalDistance / 1.4) / 60;

    document.getElementById('distanceDisplay').innerText = `Distance: ${distanceInKm.toFixed(2)} km`;
    document.getElementById('timeDisplay').innerText = `Walking Time: ${walkingTime.toFixed(2)} min`;
}

function savePath() {
    if (polyline && tempLatLngs.length > 0) {
        const geojsonPath = polyline.toGeoJSON(); 
        const blob = new Blob([JSON.stringify(geojsonPath)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'path.geojson';
        a.click();

        URL.revokeObjectURL(url);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode');

    const darkModeButton = document.getElementById('darkModeButton');
    if (document.body.classList.contains('dark-mode')) {
        currentTileLayer.remove();
        currentTileLayer = L.tileLayer(darkModeTiles, {
            maxZoom: 18,
            subdomains: 'abcd',
            attribution: '© OpenStreetMap contributors © CartoDB'
        }).addTo(map);
        darkModeButton.innerHTML = "☀️";
    } else {
        currentTileLayer.remove();
        currentTileLayer = L.tileLayer(lightModeTiles, {
            maxZoom: 18,
            subdomains: 'abcd',
            attribution: '© OpenStreetMap contributors © CartoDB'
        }).addTo(map);
        darkModeButton.innerHTML = "🌙";
    }
}

window.onload = loadLeaflet;
