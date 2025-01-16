function updateCountdown() {
    const newYear = new Date("January 1, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = newYear - now;

    if (difference >= 0) {
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));

        document.getElementById("countdown-seconds").innerText = `${seconds} seconds`;
        document.getElementById("countdown-minutes").innerText = `${minutes} minutes`;
        document.getElementById("countdown-hours").innerText = `${hours} hours`;
        document.getElementById("countdown-days").innerText = `${days} days`;
        document.getElementById("countdown-weeks").innerText = `${weeks} weeks`;
    } else {
        document.getElementById("countdown-seconds").innerText = "Happy New Year!";
        document.getElementById("countdown-minutes").innerText = "";
        document.getElementById("countdown-hours").innerText = "";
        document.getElementById("countdown-days").innerText = "";
        document.getElementById("countdown-weeks").innerText = "";
    }

    setTimeout(updateCountdown, 1000);
}

updateCountdown();
