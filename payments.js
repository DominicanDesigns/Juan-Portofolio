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
const PAYPAL_CLIENT_ID = "ARJc9hoxkzsoYS6jm-uWzirgqih_isRPmvPGu5gIhEKDAr4vtqPJOPoJL9L-7YfN9rgQEb_2qShIvu52";

/** 
 * Maps internal language codes to PayPal locales 
 */
const LOCALE_MAP = {
    'en': 'en_US',
    'es': 'es_ES',
    'fr': 'fr_FR'
};

// Track current loaded locale
let currentLocale = null;

/**
 * Loads the PayPal SDK dynamically with the specified language
 * @param {string} langCode - 'en', 'es', or 'fr'
 */
function loadPayPalSDK(langCode) {
    const targetLocale = LOCALE_MAP[langCode] || 'en_US';

    // Prevent reloading if already loaded with correct locale
    if (currentLocale === targetLocale && document.getElementById('paypal-sdk')) {
        console.log(`PayPal SDK already loaded for ${targetLocale}`);
        return;
    }

    // 1. Remove existing script if any
    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) {
        existingScript.remove();
        // Clear global object to ensure fresh load
        // Note: clearing window.paypal ensures we don't use the old instance
        if (window.paypal) window.paypal = undefined;
    }

    // 2. Setup New Script
    // Update current locale tracker
    currentLocale = targetLocale;

    // 3. Create new script
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    // Removed enable-funding=venmo to avoid locale conflicts/limitations
    // Added components=buttons to ensure we get the buttons component
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=buttons&currency=USD&locale=${targetLocale}`;
    script.dataset.sdkIntegrationSource = "button-factory";

    // 3. Handle Load
    script.onload = () => {
        console.log(`PayPal SDK loaded for locale: ${targetLocale}`);
    };

    script.onerror = () => {
        console.error("Failed to load PayPal SDK");
        currentLocale = null; // Reset on failure
        // Ensure we don't leave a broken object
        if (window.paypal) window.paypal = undefined;
    };

    document.head.appendChild(script);
}

// Listen for Language Changes from script.js
window.addEventListener('languageChanged', (e) => {
    if (e.detail && e.detail.lang) {
        loadPayPalSDK(e.detail.lang);
    }
});

// Initial Fallback: If no language event fires within 1s, load default
setTimeout(() => {
    if (!currentLocale) {
        console.warn("No language event detected, loading default PayPal SDK (en_US)");
        loadPayPalSDK('en');
    }
}, 1000);

// Owner Notification Settings
const PAYMENT_CONFIG = {
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
    },
    prod_monopoly: {
        id: "monopoly",
        title: "Monopoly Tier",
        price: "1000.00",
        description: "Total Market Domination - Access"
    }
};

// State to track if buttons are rendered
let currentButtons = null;

// DOM Elements (Initialized lazily or on load)
let modal, closeModalBtn, modalTitle, modalPrice, container;

function initPaymentElements() {
    modal = document.getElementById('payment-modal');
    closeModalBtn = document.getElementById('close-modal');
    modalTitle = document.getElementById('modal-title');
    modalPrice = document.getElementById('modal-price');
    container = document.getElementById('paypal-button-container');
}

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

    // Store current plan for retry logic
    modal.dataset.currentPlan = planKey;

    // Show Modal
    modal.classList.add('active');

    // Clean up previous buttons if they exist
    if (container.innerHTML !== "") {
        container.innerHTML = "";
    }

    // Begin Polling for SDK
    pollForPayPalSDK(plan);
}

/**
 * Polls for the PayPal SDK to be ready
 * @param {object} plan - The plan configuration object
 */
function pollForPayPalSDK(plan) {
    const maxRetries = 20; // 10 seconds total
    let attempts = 0;

    function check() {
        // We need both the 'paypal' object and the 'Buttons' component
        console.log(`Polling for PayPal... Attempt ${attempts + 1}. PayPal: ${typeof paypal}, Buttons: ${typeof paypal !== 'undefined' ? (!!paypal.Buttons) : 'N/A'}`);

        if (typeof paypal !== 'undefined' && paypal.Buttons) {
            renderButtons(plan);
        } else {
            attempts++;
            if (attempts < maxRetries) {
                // Determine message based on attempts
                let msg = "Connecting to Secure Payment Network...";
                if (attempts > 5) msg = "Establishing Secure Uplink...";

                container.innerHTML = `<p style='text-align:center; padding-top:20px; color: var(--text-muted);'>${msg} (${attempts})</p>`;

                // Retry
                setTimeout(check, 500);
            } else {
                handlePayPalTimeout();
            }
        }
    }

    check();
}

/**
 * Handles the timeout scenario
 */
function handlePayPalTimeout() {
    console.error("PayPal Timeout. PayPal object:", typeof paypal !== 'undefined' && paypal);
    container.innerHTML = `
    <div style="text-align:center; padding: 1rem; color: #ff4444;">
        <p><strong>Connection Timeout</strong></p>
        <p>Secure payment network did not respond.</p>
        <button onclick="window.location.reload()" style="margin-top:10px; padding:5px 10px; cursor:pointer; background: var(--accent-primary); color:white; border:none; border-radius:4px;">Reload Page</button>
        <p style="font-size:0.8em; margin-top:5px; color:#aaa;">Debug: Script ${document.getElementById('paypal-sdk') ? 'Loaded' : 'Missing'}</p>
    </div>`;

    // Last ditch effort: ensure SDK is requested if missing
    if (!document.getElementById('paypal-sdk')) {
        loadPayPalSDK(localStorage.getItem('site_lang') || 'en');
    }
}

/**
 * Renders the PayPal buttons once SDK is ready
 * @param {object} plan - The plan configuration object
 */
function renderButtons(plan) {
    try {
        if (!paypal.Buttons) {
            throw new Error("paypal.Buttons is undefined (Unexpected state)");
        }

        const buttons = paypal.Buttons({
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
                    container.innerHTML = "<p style='text-align:center; padding:1rem; color: var(--accent-gold);'>Payment Verified.<br>Accessing Secure Terminal...</p>";
                    modalTitle.textContent = "Access Granted";

                    const payerName = details.payer.name.given_name + " " + details.payer.name.surname;

                    setTimeout(() => {
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
        });

        if (buttons.isEligible()) {
            buttons.render('#paypal-button-container');
        } else {
            container.innerHTML = "<p style='text-align:center; color:orange;'>PayPal is not eligible on this device/browser.</p>";
        }

    } catch (e) {
        console.error("PayPal SDK Render Error:", e);
        container.innerHTML = `<p style='color:red; text-align:center;'>Payment system offline. Error: ${e.message}</p>`;
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
    initPaymentElements();

    if (!modal) {
        console.error("Payment modal elements not found in DOM");
        return;
    }

    // Open Modal Triggers
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
