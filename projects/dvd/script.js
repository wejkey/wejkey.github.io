const dvdLogo = document.getElementById('dvd-logo');
const dvdScreen = document.getElementById('dvd-screen');

const logoWidth = dvdLogo.offsetWidth;
const logoHeight = dvdLogo.offsetHeight;

let xPos = Math.random() * (window.innerWidth - logoWidth);
let yPos = Math.random() * (window.innerHeight - logoHeight);

let xSpeed = 2;
let ySpeed = 2;

let currentImage = 1;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function updateScreenSize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    xPos = Math.random() * (screenWidth - logoWidth);
    yPos = Math.random() * (screenHeight - logoHeight);
}

function changeImage() {
    currentImage = (currentImage % 20) + 1;
    dvdLogo.src = `dvd_images/dvd${currentImage}.png`;
}

function moveLogo() {
    xPos += xSpeed;
    yPos += ySpeed;

    if (xPos <= 0 || xPos + logoWidth >= screenWidth) {
        xSpeed *= -1;
        changeImage();
    }

    if (yPos <= 0 || yPos + logoHeight >= screenHeight) {
        ySpeed *= -1;
        changeImage();
    }

    dvdLogo.style.left = `${xPos}px`;
    dvdLogo.style.top = `${yPos}px`;

    requestAnimationFrame(moveLogo);
}

function toggleFullscreen() {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

document.body.addEventListener('dblclick', toggleFullscreen);

moveLogo();

let resizeTimeout;
window.addEventListener('resize', () => {
    if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
            updateScreenSize();
            resizeTimeout = null;
        }, 100);
    }
});