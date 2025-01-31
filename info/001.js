document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const borderColor = window.getComputedStyle(card).borderColor;
        card.style.boxShadow = `0 0 10px ${borderColor}`;

        card.addEventListener("mouseenter", () => {
            card.classList.add("flashing");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("flashing");
        });
    });
});
