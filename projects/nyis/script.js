function updateCountdown() {
    const newYear = new Date("January 1, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = newYear - now;
    const seconds = Math.floor(difference / 1000);
    document.getElementById("countdown").innerText = `${seconds} seconds`;
    setTimeout(updateCountdown, 1000);
}

updateCountdown();