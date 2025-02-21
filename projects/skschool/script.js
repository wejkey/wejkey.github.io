const holidays = {
    "springBreakCentral": { start: new Date('2025-03-01T00:00:00'), end: new Date('2025-03-09T23:59:59') },
    "easterBreak": { start: new Date('2025-04-17T00:00:00'), end: new Date('2025-04-22T23:59:59') },
    "summerBreak": { start: new Date('2025-06-28T00:00:00'), end: new Date('2025-09-01T23:59:59') }
};

function countdown(date, elementId) {
    const now = new Date();
    const diff = date - now; 

    if (diff <= 0) {
        document.getElementById(elementId).innerHTML = "Prázdniny sú tu!";
        return;
    }

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); 
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById(elementId).innerHTML = 
        `${months}M : ${days}D : ${hours}H : ${minutes}M : ${seconds}S`;
}

function updateCountdowns() {
    countdown(holidays.springBreakCentral.start, 'spring-break-central');
    countdown(holidays.easterBreak.start, 'easter-break');
    countdown(holidays.summerBreak.start, 'summer-break');
}

setInterval(updateCountdowns, 1000);

updateCountdowns();
