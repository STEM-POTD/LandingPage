import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingMainComponent from './components/landing/LandingMainComponent';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandingMainComponent />
    </>
  )
}

export default App
