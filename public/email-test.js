// Funzione per inviare un'email
async function sendEmail(to, subject, message) {
  try {
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html: message }),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('Error response:', data);
      return { 
        success: false, 
        error: data.error || 'Unknown error occurred',
        details: data
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception in sendEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    };
  }
}

// Funzione per inizializzare il form
function initEmailForm() {
  const form = document.getElementById('email-form');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitButton = document.getElementById('submit-button');
  const statusDiv = document.getElementById('status');
  const errorDiv = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disabilita il pulsante durante l'invio
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Nascondi i messaggi di stato precedenti
    statusDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    
    const to = emailInput.value;
    const subject = subjectInput.value;
    const message = messageInput.value;
    
    const result = await sendEmail(to, subject, message);
    
    if (result.success) {
      // Mostra il messaggio di successo
      statusDiv.textContent = 'Email sent successfully!';
      statusDiv.style.display = 'block';
      
      // Resetta il form
      form.reset();
    } else {
      // Mostra il messaggio di errore
      errorDiv.textContent = result.error || 'Failed to send email. Please try again.';
      errorDiv.style.display = 'block';
      
      // Mostra i dettagli dell'errore nella console
      console.error('Email error details:', result.details);
    }
    
    // Riabilita il pulsante
    submitButton.disabled = false;
    submitButton.textContent = 'Send Email';
  });
}

// Inizializza il form quando il documento è caricato
document.addEventListener('DOMContentLoaded', initEmailForm); 