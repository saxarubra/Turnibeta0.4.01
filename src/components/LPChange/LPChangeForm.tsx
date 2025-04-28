import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestLPChange } from '../../services/lpChangeService';

export const LPChangeForm: React.FC = () => {
  const { user } = useAuth();
  const [requestedLP, setRequestedLP] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestedLP) return;

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      await requestLPChange(user.id, requestedLP);
      setMessage({
        type: 'success',
        text: 'Richiesta inviata con successo! Riceverai una email di conferma.'
      });
      setRequestedLP('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Errore durante l\'invio della richiesta'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Effettua il login per richiedere un cambio LP</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Richiedi Cambio LP</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">LP Attuale:</p>
        <p className="text-lg font-semibold text-gray-800">{user.lp}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newLP" className="block text-sm font-medium text-gray-700">
            Nuovo LP
          </label>
          <input
            type="text"
            id="newLP"
            value={requestedLP}
            onChange={(e) => setRequestedLP(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Inserisci il nuovo LP"
            required
          />
        </div>

        {message.type && (
          <div className={`p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !requestedLP}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !requestedLP
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Invio in corso...' : 'Invia Richiesta'}
        </button>
      </form>
    </div>
  );
}; 