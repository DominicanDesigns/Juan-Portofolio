// src/ui/calculator.js

export function initCalculator() {
    const trafficInput = document.getElementById('roi-traffic');
    const valueInput = document.getElementById('roi-value');

    if (!trafficInput || !valueInput) return;

    const trafficDisplay = document.getElementById('Traffic-display');
    const valueDisplay = document.getElementById('Value-display');
    const totalDisplay = document.getElementById('roi-total');

    // Default Conversion Rate (1%)
    const CONVERSION_RATE = 0.01;

    function calculate() {
        const traffic = parseInt(trafficInput.value);
        const avgValue = parseInt(valueInput.value);

        // Traffic * Conversion * Value
        const monthlyRevenue = traffic * CONVERSION_RATE * avgValue;

        // Update displays
        trafficDisplay.textContent = traffic.toLocaleString();
        valueDisplay.textContent = '$' + avgValue.toLocaleString();

        // Animate count up logic could be added here, but simple text update for now
        totalDisplay.textContent = '$' + Math.round(monthlyRevenue).toLocaleString();
    }

    trafficInput.addEventListener('input', calculate);
    valueInput.addEventListener('input', calculate);

    // Initial calc
    calculate();
}
