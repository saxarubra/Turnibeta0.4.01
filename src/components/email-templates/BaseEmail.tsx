import React from 'react';

interface BaseEmailProps {
  children: React.ReactNode;
  title: string;
  footerText?: string;
}

export const BaseEmail: React.FC<BaseEmailProps> = ({
  children,
  title,
  footerText = '© 2024 Turni. All rights reserved.',
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#4F46E5', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', margin: 0 }}>Turni</h1>
      </div>
      
      <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#1F2937', marginBottom: '20px' }}>{title}</h2>
        {children}
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#F3F4F6', 
        textAlign: 'center',
        fontSize: '14px',
        color: '#6B7280'
      }}>
        {footerText}
      </div>
    </div>
  );
}; 