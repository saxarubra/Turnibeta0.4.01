# Turnibeta0.4.2

Un'applicazione web per la gestione dei turni con funzionalità di invio email.

## Funzionalità

- Gestione utenti e autenticazione
- Invio di email tramite Resend API
- Interfaccia utente moderna e responsive

## Tecnologie utilizzate

- React
- TypeScript
- Vite
- Express.js
- Resend API per l'invio di email
- Supabase per il database

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/tuousername/Turnibeta0.4.2.git
cd Turnibeta0.4.2
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env` nella root del progetto con le seguenti variabili:
```
# Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App URL
VITE_APP_URL=http://localhost:8080

# Resend
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_EMAIL_FROM=notifications@resend.dev
VITE_PORT=8080

# Resend API Key (for server-side)
RESEND_API_KEY=your_resend_api_key_here
```

4. Avvia il server di sviluppo:
```bash
npm run dev
```

5. Per avviare il server di produzione:
```bash
npm run build
npm run server
```

## Deploy

L'applicazione è configurata per essere deployata su Vercel. Per deployare:

1. Installa Vercel CLI:
```bash
npm install -g vercel
```

2. Login su Vercel:
```bash
vercel login
```

3. Deploya l'applicazione:
```bash
vercel
```

## Pagine di test

L'applicazione include diverse pagine di test per verificare la funzionalità:

- `/test-api.html`: Testa l'API di invio email e verifica lo stato del server
- `/test-email.html`: Permette di inviare email di test

## Licenza

MIT 