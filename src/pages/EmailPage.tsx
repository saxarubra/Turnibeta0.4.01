import React from 'react';
import { EmailForm } from '../components/EmailForm';

const EmailPage: React.FC = () => {
  const handleSuccess = () => {
    console.log('Email sent successfully');
    // Puoi aggiungere qui altre azioni da eseguire dopo l'invio dell'email
  };

  const handleError = (error: Error) => {
    console.error('Error sending email:', error);
    // Puoi aggiungere qui altre azioni da eseguire in caso di errore
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Send Email</h1>
      <EmailForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default EmailPage; 