import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleLPChangeResponse } from '../../services/lpChangeService';

export const LPChangeResponse: React.FC = () => {
  const { requestId, action } = useParams<{ requestId: string; action: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processResponse = async () => {
      if (!requestId || !action) {
        setError('Parametri mancanti nella richiesta');
        setIsLoading(false);
        return;
      }

      if (action !== 'accept' && action !== 'deny') {
        setError('Azione non valida');
        setIsLoading(false);
        return;
      }

      try {
        const result = await handleLPChangeResponse(requestId, action as 'accept' | 'deny');
        
        if (result.success) {
          setMessage(
            action === 'accept'
              ? 'Il cambio di LP è stato autorizzato con successo!'
              : 'Il cambio di LP è stato rifiutato.'
          );
        } else {
          setError(result.error || 'Si è verificato un errore durante la gestione della richiesta');
        }
      } catch (error) {
        setError('Si è verificato un errore durante la gestione della richiesta');
      } finally {
        setIsLoading(false);
      }
    };

    processResponse();
  }, [requestId, action]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Elaborazione in corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Risposta Richiesta Cambio LP</h2>
      
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      ) : (
        <div className="p-4 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      <button
        onClick={() => navigate('/')}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Torna alla Home
      </button>
    </div>
  );
}; 