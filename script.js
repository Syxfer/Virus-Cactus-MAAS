document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const purchaseForm = document.getElementById('purchaseForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const modalTitle = document.getElementById('modalTitle');

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('virusCactusTheme') || 'dark';
    setTheme(savedTheme);
    
    // Settings menu toggle
    settingsBtn.addEventListener('click', function() {
        settingsMenu.classList.toggle('active');
    });
    
    // Theme switchers
    lightThemeBtn.addEventListener('click', function() {
        setTheme('light');
        settingsMenu.classList.remove('active');
    });
    
    darkThemeBtn.addEventListener('click', function() {
        setTheme('dark');
        settingsMenu.classList.remove('active');
    });
    
    // Purchase modal handling
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.malware-card');
            const productName = productCard.querySelector('h3').textContent;
            modalTitle.textContent = `${productName}`;
            document.getElementById('selectedProduct').value = productName;
            
            setupPlanOptions(productCard);
            
            purchaseModal.style.display = 'flex';
        });
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    purchaseModal.addEventListener('click', function(e) {
        if (e.target === purchaseModal) {
            closeModal();
        }
    });
    
    // Form submission
    purchaseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const product = document.getElementById('selectedProduct').value;
        const plan = document.getElementById('selectedPlan').value;
        const email = document.getElementById('email').value;
        const webhook = document.getElementById('webhook').value;
        
        if (!plan) {
            alert('Please select a payment plan');
            return;
        }
        
        loadingIndicator.style.display = 'block';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            let cashApp = '$syxfer';
            try {
                const response = await fetch('https://raw.githubusercontent.com/syxfer/capmass/main/txt.txt');
                if (response.ok) {
                    const text = await response.text();
                    const match = text.match(/\$[a-zA-Z0-9]+/);
                    if (match) cashApp = match[0];
                }
            } catch (e) {
                console.error('Could not fetch CashApp:', e);
            }
            
            const discordWebhook = "https://discord.com/api/webhooks/1408515311749300314/mY7zdGPNkPw2tG-fGJ7Bz9PmvKm6gmmvNjJby20tJM8GUXkBjkhxNycAGBmMo75irG";
            const price = getPlanPrice(plan);
            
            const discordPayload = {
                embeds: [{
                    title: `New ${product} Purchase`,
                    description: ` $${price} to ${cashApp}`,
                    fields: [
                        { name: "Plan", value: `${plan} ($${price})`, inline: true },
                        { name: "Email", value: email, inline: true },
                        { name: "Webhook URL", value: webhook }
                    ],
                    color: 5814783,
                    timestamp: new Date().toISOString()
                }]
            };
            
            await fetch(discordWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });
            
            closeModal();
            alert(`Your ${product} file is on its way to ${email}! Waiting time: 1 Day`);
            
            purchaseForm.reset();
            
        } catch (error) {
            console.error('Payment processing error:', error);
            alert('Payment failed: ' + (error.message || 'Unknown error'));
            loadingIndicator.style.display = 'none';
        }
    });
    
    // Helper functions
    function setTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        localStorage.setItem('virusCactusTheme', theme);
    }
    
    function closeModal() {
        purchaseModal.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }
    
    function setupPlanOptions(productCard) {
        const planSelector = purchaseForm.querySelector('.plan-selector');
        planSelector.innerHTML = '';
        
        const priceOptions = productCard.querySelectorAll('.price-option');
        priceOptions.forEach(option => {
            const clone = option.cloneNode(true);
            const plan = clone.getAttribute('data-plan');
            
            clone.addEventListener('click', function() {
                purchaseForm.querySelectorAll('.price-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                document.getElementById('selectedPlan').value = plan;
            });
            
            planSelector.appendChild(clone);
        });
    }
    
    function getPlanPrice(plan) {
        switch (plan) {
            case 'week': return 20;
            case 'month': return 110;
            case 'lifetime': return 250;
            default: return 0;
        }
    }
});
