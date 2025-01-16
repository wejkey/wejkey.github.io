function updateCountdown() {
    const newYear = new Date("January 1, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = newYear - now;

    if (difference >= 0) {
        const seconds = Math.floor(difference / 1000);
        document.getElementById("countdown").innerText = `${seconds} seconds`;
    } else {
        document.getElementById("countdown").innerText = "Happy New Year!";
    }

    setTimeout(updateCountdown, 1000);
}

updateCountdown();
