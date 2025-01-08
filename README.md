# README - Proyecto Supabase 🚀

## Descripción

Gestor de usuarios con Supabase, autenticación OAuth (Google) y backend en Node.js para validar tokens y replicar datos en MongoDB. 🎉

## Características 🛠️

- **Frontend:** React + login con Supabase + botón para verificar token.
- **Backend:** Node.js + middleware para tokens JWT.
- **Base de Datos:** Webhook sincroniza PostgreSQL (Supabase) con MongoDB.

## Flujo 🚦

1. Login con Supabase (correo o Google OAuth).
2. Frontend envía token al backend.
3. Backend valida token y consulta MongoDB.
4. Respuesta: correo asociado al usuario. 📧

## Configuración ⚙️

1. **Frontend:**

   - `npm install`
   - Configura Supabase en `.env`.
   - `npm start`

2. **Backend:**

   - `npm install`
   - Configura Supabase y MongoDB en `.env`.
   - `node server.js`

3. **Supabase & MongoDB:**

   - Despliega Supabase.
   - Configura webhook para sincronización. 🔄
