import React from 'react';

interface LPChangeRequestProps {
  userName: string;
  currentLP: string;
  requestedLP: string;
  requestId: string;
}

export const LPChangeRequestEmail = ({
  userName,
  currentLP,
  requestedLP,
  requestId
}: LPChangeRequestProps): React.ReactElement => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Richiesta Cambio LP</h2>
      <p>Ciao {userName},</p>
      <p>Hai richiesto di cambiare il tuo LP da <strong>{currentLP}</strong> a <strong>{requestedLP}</strong>.</p>
      <p>Per confermare o negare questa richiesta, clicca su uno dei pulsanti qui sotto:</p>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <a 
          href={`http://localhost:5173/lp-change/accept/${requestId}`}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Accetta
        </a>
        <a 
          href={`http://localhost:5173/lp-change/deny/${requestId}`}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Rifiuta
        </a>
      </div>
      <p>Se i pulsanti non funzionano, puoi copiare e incollare questi link nel tuo browser:</p>
      <p>Per accettare: http://localhost:5173/lp-change/accept/{requestId}</p>
      <p>Per rifiutare: http://localhost:5173/lp-change/deny/{requestId}</p>
      <p>Cordiali saluti,<br />Il team di Turni</p>
    </div>
  );
}; 