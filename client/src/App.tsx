import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
// import Header from './components/Header/Header'
// import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import RegistrationPage from './pages/AuthorizationPages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/AuthorizationPages/LoginPage/LoginPage';

import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import { UserProvider } from './context/UserContext';

function App() {

  return (
    <BrowserRouter>
      <UserProvider>

          <main>
            
        <Routes>

          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<AppLayout />}>

              <Route path="/profile" element={<ProfilePage />} />
          </Route>

        </Routes>

          </main> 

      </UserProvider>
    </BrowserRouter>
  )
}

export default App
