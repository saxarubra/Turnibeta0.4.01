import React from 'react';
import { EmailTest } from '../components/EmailTest';

const EmailTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Email Test Page</h1>
      <EmailTest />
    </div>
  );
};

export default EmailTestPage; 