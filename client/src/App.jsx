import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'

function App() {

  return (
    <>
      <Header/>

      <main>
        
        <Home/>

      </main> 

      <Footer/>
    </>
  )
}

export default App
