import React, {useState} from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './component/Signup'
import Signin from './component/Signin'
import Dashboard from './component/Dashboard'
import Chat from './component/Chat'
import Loader from './component/Loader'
import Home from './component/Home'
import Test from './component/Test'
import Record from './component/Record'
function App() {
  // const [verifiedIp, setverifiedIp] = useState(false)

  // const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     dispatch(setAuthenticated(true));
  //   }

  // }, []);

  // const verifyIp = () => {
  //   let url = 'http://localhost:3000/user/verify_ip'
  //   axios.get(url)
  //   .then((res)=>{
  //     console.log(res);
  //     setverifiedIp(true)
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //     setverifiedIp(true)
  //   })
  // }

  return (
    <div className='font-roboto'>
      <Routes>
      <Route path='/' element={<Loader/>}/>
      <Route path='/home' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/dashboard' element={ <Dashboard/>}/>
        <Route path="/chat/:username" element={<Chat />} />
        <Route path='/record' element={<Record/>}/>
        <Route path='/verify' element={<Test/>}/>
      </Routes>
        
    </div>
  )
}

export default App
