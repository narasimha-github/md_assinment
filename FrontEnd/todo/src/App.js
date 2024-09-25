import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/LogIn'
import SignIn from './components/SignIn'
import Body from './components/Body'


import './App.css';

const App = () => (
  <>
   <Router>
    <Routes>
     <Route path="/" element={<SignIn />}/>
     <Route path='/login' element={<Login />}/>
     <Route path='/body' element={<Body/>} />
    </Routes>
   </Router>
  </>
)
export default App;
