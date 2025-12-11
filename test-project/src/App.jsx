
import './App.css'
import { HomePage } from './pages/HomePage'
import {Routes,Route} from 'react-router'

function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='checkout' element={<div>Checkout Page</div>}/>
      </Routes>
  )
}

export default App
