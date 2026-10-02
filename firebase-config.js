// Firebase → Project settings → General → Your apps → Web app → "SDK setup and configuration" (Config).
// Поки apiKey порожній — додаток працює в ДЕМО-режимі (дані лише в цьому браузері).
//
// ВАЖЛИВО: apiKey у Firebase — це не пароль, а ідентифікатор проєкту. Він завжди видимий у браузері.
// Захист даних забезпечують: правила Firestore (firestore.rules) + список доступу members
// + обмеження ключа за доменом у Google Cloud Console. Див. README.md → «Безпека».

export const firebaseConfig = {
  apiKey: "AIzaSyA6nwwEb9gD7jVMIBVy3BukK2p_9OOBzaQ",
  authDomain: "adminhub-6edb2.firebaseapp.com",
  projectId: "adminhub-6edb2",
  storageBucket: "adminhub-6edb2.firebasestorage.app",
  messagingSenderId: "461250626203",
  appId: "1:461250626203:web:1082496c80c993e2e4bc3e"
};
