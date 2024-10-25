const holidays = {
    "autumnBreak": new Date('2024-10-30T00:00:00'),
    "christmasBreak": new Date('2024-12-23T00:00:00'),
    "springBreakEast": new Date('2025-02-17T00:00:00'),
    "springBreakWest": new Date('2025-02-24T00:00:00'),
    "springBreakCentral": new Date('2025-03-03T00:00:00'),
    "easterBreak": new Date('2025-04-17T00:00:00'),
    "summerBreak": new Date('2025-06-30T00:00:00')
};

function countdown(date, elementId) {
    const now = new Date().getTime();
    const timeRemaining = date.getTime() - now;

    const months = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (timeRemaining < 0) {
        document.getElementById(elementId).innerHTML = "Prázdniny skončili, je čas sa pripraviť do školy!";
    } else {
        document.getElementById(elementId).innerHTML = `${months}M : ${weeks}W : ${days}D : ${hours}H : ${minutes}M : ${seconds}S`;
    }
}

function updateCountdowns() {
    countdown(holidays.autumnBreak, 'autumn-break');
    countdown(holidays.christmasBreak, 'christmas-break');
    countdown(holidays.springBreakEast, 'spring-break-east');
    countdown(holidays.springBreakWest, 'spring-break-west');
    countdown(holidays.springBreakCentral, 'spring-break-central');
    countdown(holidays.easterBreak, 'easter-break');
    countdown(holidays.summerBreak, 'summer-break');
}


setInterval(updateCountdowns, 1000);

updateCountdowns();
