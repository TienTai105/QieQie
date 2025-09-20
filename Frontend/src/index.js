import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import './i18n';
// ✅ Chỉ tạo root và render một lần duy nhất
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Hiệu suất (tùy chọn)
reportWebVitals();
=======
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Thêm dòng này: import AuthProvider
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Import
import './i18n';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        {/* ✅ SỬA LỖI: BrowserRouter phải bọc ngoài AuthProvider */}
        <BrowserRouter>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your_google_client_id'}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
>>>>>>> b32aa75 (update code)
