import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'

function App() {

  return (
    <BrowserRouter>
      <Header/>
        <main>
          
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/Profile" element={<Profile/>} />
          </Routes>

        </main> 
      <Footer/>
    </BrowserRouter>
  )
}

export default App
