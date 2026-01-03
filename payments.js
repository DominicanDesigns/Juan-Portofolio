/**
 * Payment Integration Logic (PayPal Smart Buttons)
 * 
 * INSTRUCTIONS FOR OWNER:
 * 1. Ensure the PayPal SDK script in services.html has your correct Client ID.
 *    Current: client-id=sb (Sandbox/Test Mode)
 *    Live: Replace 'sb' with your live Client ID from developer.paypal.com
 * 
 * 2. Configure the prices below.
 */

const PAYMENT_CONFIG = {
    // Owner Notification Settings
    whatsappNumber: "18097292380", // Format: CountryCode + Number (No + or -)

    prod_empire: {
        id: "empire",
        title: "Empire Platform",
        price: "5000.00", // String format for PayPal
        description: "Full Web Platform Build"
    },
    prod_sovereign: {
        id: "sovereign",
        title: "Sovereign App (P2P)",
        price: "8000.00",
        description: "Mobile App & Algorithm Integration"
    },
    prod_asset: {
        id: "asset",
        title: "Asset Management",
        price: "1000.00",
        description: "Monthly Maintenance Subscription"
    }
};

// State to track if buttons are rendered
let currentButtons = null;

// DOM Elements
const modal = document.getElementById('payment-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const container = document.getElementById('paypal-button-container');

/**
 * Opens the payment modal and renders PayPal buttons
 * @param {string} planKey - Key from PAYMENT_CONFIG (e.g., 'prod_empire')
 */
function openModal(planKey) {
    const plan = PAYMENT_CONFIG[`prod_${planKey}`];

    if (!plan) {
        console.error("Plan not found:", planKey);
        return;
    }

    // Update Modal Content
    modalTitle.textContent = plan.title;
    modalPrice.textContent = `$${Number(plan.price).toLocaleString()}`;

    // Show Modal
    modal.classList.add('active');

    // Clean up previous buttons if they exist
    if (container.innerHTML !== "") {
        container.innerHTML = "";
    }

    // Render PayPal Buttons
    try {
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'pay',
                height: 40
            },
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        description: plan.description,
                        amount: {
                            value: plan.price
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    // 1. Show processing message
                    container.innerHTML = "<p style='text-align:center; padding:1rem; color: var(--accent-gold);'>Payment Verified.<br>Accessing Secure Terminal...</p>";
                    modalTitle.textContent = "Access Granted";

                    // 2. Prepare Data for Success Page
                    const payerName = details.payer.name.given_name + " " + details.payer.name.surname;

                    // 3. Redirect to Success Page
                    setTimeout(() => {
                        // Pass details via URL params
                        const params = new URLSearchParams({
                            name: payerName,
                            plan: plan.title,
                            price: plan.price,
                            id: details.id
                        });
                        window.location.href = `success.html?${params.toString()}`;
                    }, 1000);
                });
            },
            onError: function (err) {
                console.error('PayPal Error:', err);
                alert("An error occurred with the payment system. Please try again.");
            }
        }).render('#paypal-button-container');
    } catch (e) {
        console.error("PayPal SDK not loaded or failed to render:", e);
        container.innerHTML = "<p style='color:red; text-align:center;'>Payment system offline. Checks console.</p>";
    }
}

/**
 * Closes the modal
 */
function closeModal() {
    modal.classList.remove('active');
    // We clear the container after a short delay to allow transition to finish
    setTimeout(() => {
        container.innerHTML = "";
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Open Modal Triggers
    const triggers = document.querySelectorAll('[data-plan]');
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const planKey = btn.getAttribute('data-plan');
            openModal(planKey);
        });
    });

    // Close Modal Triggers
    closeModalBtn.addEventListener('click', closeModal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
