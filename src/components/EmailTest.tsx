import React, { useState } from 'react';
import { sendEmail } from '../services/emailService';

export const EmailTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    setErrorDetails(null);

    try {
      const result = await sendEmail({
        to: email,
        subject,
        html: message,
      });

      if (result.success) {
        setStatus('success');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to send email. Please try again.');
        setErrorDetails(result.details);
        console.error('Email error details:', result.details);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('An error occurred while sending the email.');
      setErrorDetails(error);
      console.error('Email exception:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Test Email Service</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">To:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Email sent successfully!
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">{errorMessage}</p>
          {errorDetails && (
            <div className="mt-2 text-sm">
              <p className="font-semibold">Error Details:</p>
              <pre className="mt-1 p-2 bg-red-50 rounded overflow-auto text-xs">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 