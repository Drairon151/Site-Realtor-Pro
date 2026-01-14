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
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RealtorLayout from './layouts/RealtorLayout';
import ListingNewPage from './pages/ListingPages/ListingNewPage/ListingNewPage';
import ListingPage from './pages/ListingPages/ListingPage/ListingPage';
import ListingsMyPage from './pages/ListingsPages/ListingsMyPage/ListingsMyPages';
import RealtorsPage from './pages/RealtorsPage/RealtorsPage';
import ListingsPage from './pages/ListingsPages/ListingsPage/ListingsPage';
import ChatPage from './pages/ChatPage/ChatPage';



function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        
        <Header/>

        <main>  
              
          <Routes>

            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/listing/:listingId" element={<ListingPage/>} />

              <Route path="/listings" element={<ListingsPage/>} />

              <Route path="/realtors" element={<RealtorsPage/>} />

              <Route path="/chat" element={<ChatPage/>} />
            </Route>

          <Route element={<RealtorLayout/>}>
            <Route path="/listing/new" element={<ListingNewPage/>} />
            <Route path="/listings/my" element={<ListingsMyPage/>} />
          </Route>

          </Routes>

        </main> 

        <Footer/>

      </UserProvider>
    </BrowserRouter>
  )
}

export default App
