
document.addEventListener('DOMContentLoaded', () => {
    const auditForm = document.getElementById('audit-form');
    const auditInput = document.getElementById('audit-input');
    const auditConsole = document.querySelector('.audit-console');
    const scanStatus = document.getElementById('scan-status');
    const progressBar = document.querySelector('.progress-fill');
    const resultCard = document.getElementById('result-card');

    // Matrix rain effect container (reusing the one from script.js if possible, 
    // but here we might want a specific console effect)

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = auditInput.value.trim();
            if (!url) return;

            startScan(url);
        });
    }

    function startScan(url) {
        // UI Reset
        auditForm.classList.add('scanning-active'); // maybe hide input
        document.querySelector('.audit-input-group').style.display = 'none';
        scanStatus.classList.remove('hidden');
        resultCard.classList.add('hidden');

        const steps = [
            { key: 'audit.status.init', progress: 10, delay: 800 },
            { key: 'audit.status.connect', progress: 30, delay: 1500 },
            { key: 'audit.status.analyze', progress: 60, delay: 2000 },
            { key: 'audit.status.calc', progress: 90, delay: 1200 }
        ];

        let currentStep = 0;

        function nextStep() {
            if (currentStep >= steps.length) {
                finishScan();
                return;
            }

            const step = steps[currentStep];
            // Update status text using our i18n helper from script.js if available
            // otherwise fallback or direct text
            updateStatusText(step.key);
            progressBar.style.width = `${step.progress}%`;

            addConsoleLog(`> [EXEC] ${step.key} >> ${url}`);

            setTimeout(() => {
                currentStep++;
                nextStep();
            }, step.delay);
        }

        nextStep();
    }

    function updateStatusText(key) {
        // Assume _t function exists globally from script.js
        if (typeof _t === 'function') {
            scanStatus.querySelector('.status-text').textContent = _t(key);
        }
    }

    function addConsoleLog(text) {
        const log = document.createElement('div');
        log.className = 'console-line';
        log.textContent = text;
        log.style.opacity = 0;
        // auditConsole.appendChild(log); // Uncomment if we have a log container
        // Fade in
        // requestAnimationFrame(() => log.style.opacity = 0.7);
    }

    function finishScan() {
        progressBar.style.width = '100%';
        setTimeout(() => {
            scanStatus.classList.add('hidden');
            resultCard.classList.remove('hidden');

            // Randomize score slightly for effect
            const score = Math.floor(Math.random() * (45 - 20 + 1)) + 20; // Low score to prompt action
            document.getElementById('score-value').textContent = `${score}%`;

            // Re-enable form? No, force refresh or contact
        }, 500);
    }
});
