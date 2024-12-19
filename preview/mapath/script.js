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

const outdoorTiles = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'; 
const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

let currentLayer = L.tileLayer(outdoorTiles, {
    maxZoom: 17,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
}).addTo(map);

document.getElementById('themeToggleButton').onclick = function() {
    map.removeLayer(currentLayer);
    if (currentLayer._url === outdoorTiles) {
        currentLayer = L.tileLayer(darkTiles, {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors © CartoDB'
        }).addTo(map);
        document.getElementById('themeToggleButton').textContent = '☀️';
    } else {
        currentLayer = L.tileLayer(outdoorTiles, {
            maxZoom: 17,
            attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
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

    polyline = L.polyline(tempLatLngs, { color: 'green' }).addTo(map);
    previewLine = L.polyline([], { color: 'green', dashArray: '5, 10' }).addTo(map);

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
fun
