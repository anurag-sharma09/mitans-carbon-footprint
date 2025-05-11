document.addEventListener('DOMContentLoaded', () => {
    // Get data from localStorage
    const footprintData = JSON.parse(localStorage.getItem('footprintData'));

    if (footprintData) {
        displayResults(footprintData);
    } else {
        // Redirect to calculator if no data
        window.location.href = 'calculator.html';
    }

    // Back button functionality
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'calculator.html';
    });

    // Share button functionality
    document.getElementById('share-btn').addEventListener('click', shareResults);

    // Offset button functionality
    document.getElementById('offset-btn').addEventListener('click', () => {
        window.location.href = 'precautions.html#offset-section';
    });

    // Display random fact
    displayRandomFact();
});

function displayResults(data) {
    // Update total emission
    document.getElementById('total-emission').textContent = Math.round(data.totalEmissions);
    document.getElementById('trees-needed').textContent = Math.ceil(data.totalEmissions / 22);

    // Create chart
    createChart(data.emissions);
}

function createChart(emissions) {
    const ctx = document.getElementById('footprintChart').getContext('2d');

    const data = {
        labels: ['Transport', 'Waste', 'Energy', 'Diet', 'Consumption'],
        datasets: [{
            data: [
                emissions.transport,
                emissions.waste,
                emissions.energy,
                emissions.diet,
                emissions.consumption
            ],
            backgroundColor: [
                '#2ecc71',
                '#e74c3c',
                '#f1c40f',
                '#3498db',
                '#9b59b6'
            ]
        }]
    };

    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function shareResults() {
    const totalEmission = document.getElementById('total-emission').textContent;
    const treesNeeded = document.getElementById('trees-needed').textContent;

    const shareText = `My monthly carbon footprint is ${totalEmission} kgCO₂e. I need to plant ${treesNeeded} trees to offset it. Calculate your carbon footprint at ${window.location.origin}`;

    if (navigator.share) {
        navigator.share({
            title: 'My Carbon Footprint Results',
            text: shareText
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Results copied to clipboard!');
    }
}

function displayRandomFact() {
    const FACTS = [
        "Every year, over 8 million metric tons of plastic enter the oceans, contributing to marine pollution and environmental harm.",
        "Globally, buildings are responsible for approximately 36% of total energy use and 39% of CO2 emissions.",
        "A single tree can absorb up to 22kg of CO2 per year.",
        "Using public transportation can reduce your carbon footprint by up to 30%.",
        "Recycling one aluminum can saves enough energy to run a TV for three hours."
    ];

    const factElement = document.getElementById('fact');
    const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
    factElement.textContent = randomFact;
}
