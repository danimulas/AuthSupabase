import './index.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import axios from 'axios';

const supabase = createClient('https://<your_supabase_url>', '<your_supabase_key>');

export default function App() {
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('session', session.access_token);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

 

  const verifyUser = async () => {
    if (session?.access_token) {
      try {
        const response = await axios.get('http://localhost:3000/protected/hello', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setMessage(`Hola! ${response.data.email || 'usuario desconocido'}`);
        setMessageColor('green');
      } catch (error) {
        console.error('Error al verificar la sesión:', error.response?.data || error.message);
        setMessage(error.response?.data.error || 'Error al conectar con el servidor');
        setMessageColor('red');
      }
    } else {
      setMessage('No se encontró un token válido');
      setMessageColor('red');
    }
  };

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      />
    );
  } else {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Bienvenido</h1>
        <button
          onClick={verifyUser}
          className="button button-verify"
        >
          Verificar Usuario
        </button>
        <button
          onClick={async () => {
            try {
              await supabase.auth.signOut();
              setMessage('');
            } catch (error) {
              console.error('Error al cerrar sesión:', error.message);
            }
          }}
          className="button button-logout"
        >
          Cerrar Sesión
        </button>
        {message && (
          <p style={{ marginTop: '20px', color: messageColor }}