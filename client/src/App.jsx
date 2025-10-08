import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import RegistrationPage from './pages/AuthorizationPages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/AuthorizationPages/LoginPage/LoginPage';

import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

function App() {

  return (
    <BrowserRouter>
      <Header/>
        <main>
          
      <Routes>

        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/RegistrationPage" element={<RegistrationPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Route>
      </Routes>

        </main> 
      <Footer/>
    </BrowserRouter>
  )
}

export default App
