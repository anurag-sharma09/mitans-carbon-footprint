// Constants for calculations
const EMISSION_FACTORS = {
    transport: {
        walk: 0.01, // kg CO2e per km
        public: 0.04, // kg CO2e per km
        car: 0.12,    // kg CO2e per km
        bicycle: 0.02,    // kg CO2e per km
    },
    waste: {
        small: 2,     // kg CO2e per bag
        medium: 4,    // kg CO2e per bag
        large: 6,     // kg CO2e per bag
    },
    diet: {
        'vegetarian': 100,  // kg CO2e per month
        'vegan': 60,        // kg CO2e per month
        'meat-eater': 200,  // kg CO2e per month
    },
    energy: {
        'natural-gas': 0.2,  // kg CO2e per hour
        'electricity': 0.4,  // kg CO2e per hour
        'renewable': 0.05,   // kg CO2e per hour
    },
    shower: {
        'daily': 30,         // kg CO2e per month
        'twice-daily': 60,   // kg CO2e per month
        'every-other-day': 15, // kg CO2e per month
    }
};

// Did You Know facts
const FACTS = [
    "Every year, over 8 million metric tons of plastic enter the oceans, contributing to marine pollution and environmental harm.",
    "Globally, buildings are responsible for approximately 36% of total energy use and 39% of CO2 emissions.",
    "A single tree can absorb up to 22kg of CO2 per year.",
    "Using public transportation can reduce your carbon footprint by up to 30%.",
    "Recycling one aluminum can saves enough energy to run a TV for three hours."
];

// Current tab index
let currentTab = 0;
const totalTabs = 5;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Range inputs
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    
    // Initialize range values
    rangeInputs.forEach(input => {
        const valueDisplay = input.nextElementSibling;
        valueDisplay.textContent = input.value;
        
        input.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
        });
    });
    
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            showTab(tabName);
        });
    });
    
    // Navigation button clicks
    prevBtn.addEventListener('click', () => navigateTab(-1));
    nextBtn.addEventListener('click', () => navigateTab(1));
    calculateBtn.addEventListener('click', calculateFootprint);
    refreshBtn.addEventListener('click', () => {
        window.location.reload();
    });
    
    // Display random fact
    displayRandomFact();
    
    // Initialize first tab
    updateNavButtons();

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to input fields
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(10px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
    });

    // Add animation to range inputs
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', function() {
            const value = (this.value - this.min) / (this.max - this.min) * 100;
            this.style.background = `linear-gradient(to right, var(--primary-color) ${value}%, #ddd ${value}%)`;
        });
    });

    // Add animation to buttons
    document.querySelectorAll('.nav-btn, .tab-btn').forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section and activate tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update current tab index
    currentTab = Array.from(document.querySelectorAll('.tab-btn')).findIndex(btn => btn.dataset.tab === tabName);
    
    // Update navigation buttons
    updateNavButtons();
}

function navigateTab(direction) {
    currentTab += direction;
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabName = tabBtns[currentTab].dataset.tab;
    showTab(tabName);
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    
    prevBtn.style.display = currentTab === 0 ? 'none' : 'block';
    
    if (currentTab === totalTabs - 1) {
        nextBtn.style.display = 'none';
        calculateBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        calculateBtn.style.display = 'none';
    }
}

function calculateFootprint() {
    // Get all input values
    const data = {
        personal: {
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            gender: document.getElementById('gender').value,
            diet: document.getElementById('diet').value
        },
        travel: {
            transportation: document.getElementById('transportation').value,
            distance: document.getElementById('distance').value,
            flights: document.getElementById('flights').value
        },
        waste: {
            wasteSize: document.getElementById('waste-size').value,
            wasteBags: document.getElementById('waste-bags').value,
            recycling: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
        },
        energy: {
            heating: document.getElementById('heating').value,
            cooking: document.getElementById('cooking').value,
            screenTime: document.getElementById('screen-time').value,
            internetUsage: document.getElementById('internet-usage').value
        },
        consumption: {
            shower: document.getElementById('shower').value,
            groceries: document.getElementById('groceries').value,
            clothes: document.getElementById('clothes').value
        }
    };
    
    // Calculate emissions
    const emissions = {
        transport: calculateTransportEmissions(data.travel),
        waste: calculateWasteEmissions(data.waste),
        energy: calculateEnergyEmissions(data.energy),
        diet: calculateDietEmissions(data.personal),
        consumption: calculateConsumptionEmissions(data.consumption)
    };
    
    const totalEmissions = Object.values(emissions).reduce((a, b) => a + b, 0);
    
    // Store data in localStorage
    const footprintData = {
        emissions,
        totalEmissions
    };
    localStorage.setItem('footprintData', JSON.stringify(footprintData));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

function calculateTransportEmissions(travel) {
    let emissions = 0;
    
    // Base transportation emissions
    switch(travel.transportation) {
        case 'car':
            emissions += travel.distance * 0.2; // 0.2 kg CO2e per km
            break;
        case 'public':
            emissions += travel.distance * 0.05; // 0.05 kg CO2e per km
            break;
        case 'bike':
        case 'bicycle':
            emissions += travel.distance * 0.01; // 0.01 kg CO2e per km
            break;
    }

    // Flight emissions
    switch(travel.flights) {
        case 'often':
            emissions += 500; // 500 kg CO2e per month
            break;
        case 'sometimes':
            emissions += 250; // 250 kg CO2e per month
            break;
        case 'rarely':
            emissions += 100; // 100 kg CO2e per month
            break;
    }

    return emissions;
}

function calculateWasteEmissions(waste) {
    let emissions = 0;
    
    // Waste size impact
    const wasteSizeMultiplier = {
        'small': 1,
        'medium': 1.5,
        'large': 2
    };

    // Base waste emissions
    emissions += waste.wasteBags * 10 * wasteSizeMultiplier[waste.wasteSize];

    // Recycling reduction
    const recyclingReduction = waste.recycling.length * 0.1; // 10% reduction per recycling type
    emissions *= (1 - recyclingReduction);

    return emissions;
}

function calculateEnergyEmissions(energy) {
    let emissions = 0;
    
    // Heating emissions
    switch(energy.heating) {
        case 'natural-gas':
            emissions += 200; // 200 kg CO2e per month
            break;
        case 'electricity':
            emissions += 150; // 150 kg CO2e per month
            break;
        case 'renewable':
            emissions += 50; // 50 kg CO2e per month
            break;
    }

    // Screen time emissions
    emissions += energy.screenTime * 0.1; // 0.1 kg CO2e per hour

    // Internet usage emissions
    emissions += energy.internetUsage * 0.05; // 0.05 kg CO2e per hour

    return emissions;
}

function calculateDietEmissions(personal) {
    let emissions = 0;
    
    // Diet type emissions
    switch(personal.diet) {
        case 'meat-eater':
            emissions += 300; // 300 kg CO2e per month
            break;
        case 'vegetarian':
            emissions += 150; // 150 kg CO2e per month
            break;
        case 'vegan':
            emissions += 100; // 100 kg CO2e per month
            break;
    }

    return emissions;
}

function calculateConsumptionEmissions(consumption) {
    let emissions = 0;
    
    // Shower frequency impact
    switch(consumption.shower) {
        case 'twice-daily':
            emissions += 100; // 100 kg CO2e per month
            break;
        case 'daily':
            emissions += 50; // 50 kg CO2e per month
            break;
        case 'every-other-day':
            emissions += 25; // 25 kg CO2e per month
            break;
    }

    // Grocery spending impact
    emissions += consumption.groceries * 0.1; // 0.1 kg CO2e per dollar

    // Clothing purchases impact
    emissions += consumption.clothes * 10; // 10 kg CO2e per item

    return emissions;
}

function createChart(emissions) {
    const ctx = document.getElementById('footprintChart').getContext('2d');
    
    // Clear any existing chart
    if (window.footprintChart) {
        window.footprintChart.destroy();
    }
    
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
    
    window.footprintChart = new Chart(ctx, {
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

function displayRandomFact() {
    const factElement = document.getElementById('fact');
    const randomFact = FACTS[Math.floor(Math.random() * FACTS.length)];
    factElement.textContent = randomFact;
}

// Add animation to chart updates
function updateChart() {
    const chart = document.getElementById('emissionsChart');
    if (chart) {
        chart.style.animation = 'none';
        chart.offsetHeight; // Trigger reflow
        chart.style.animation = 'chartAppear 0.6s ease forwards';
    }
}

// Add animation to did you know section
function showDidYouKnow() {
    const didYouKnow = document.querySelector('.did-you-know');
    if (didYouKnow) {
        didYouKnow.style.animation = 'none';
        didYouKnow.offsetHeight; // Trigger reflow
        didYouKnow.style.animation = 'slideUp 0.5s ease';
    }
}

// Modify the existing calculateEmissions function to include animations
const originalCalculateEmissions = calculateEmissions;
calculateEmissions = function() {
    originalCalculateEmissions();
    updateChart();
    showDidYouKnow();
};

// Add parallax effect to background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    document.body.style.backgroundPositionY = scrolled * 0.5 + 'px';
}); 