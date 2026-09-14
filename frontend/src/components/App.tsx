import {Routes, Route} from 'react-router'
import '../css/App.css'
import Navigation from './Navigation'
import Header from "./Header.tsx";
import Footer from "./Footer";

function App() {

  return (
    <>
        <Header />
        <Navigation />
        <main>
            <Routes>
                <Route path="/" element={
                    <>
                        Home
                    </>
                }/>
                <Route path="/about" element={
                    <>
                        About
                    </>
                }/>
            </Routes>
        </main>
        <Footer />
    </>
  )
}

export default App
