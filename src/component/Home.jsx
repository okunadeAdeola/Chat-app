import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/Styles/pages.css'
import section1Img from '../assets/image/back.png'
import section2Img from '../assets/image/section8.jpg'
import section3Img from '../assets/image/section3.jpg'
import section5Img from '../assets/image/section7.jpg'
const Home = () => {
  return (
    <>
      <nav className='flex justify-between px-14 sm:px-5 bg-green-800 h-20 sm:h-16 text-white items-center ' style={{ fontFamily: '"Josefin Sans", sans-serif', position: "sticky", top: "0" }}>
        <div className='homePage'>
          <Link>Adey Square </Link>
        </div>
        <ul className='flex gap-10 sm:gap-5 h-full items-center '>
          <li className='h-full flex items-center justify-center'>
            <Link className='bg-white h-[50%] w-28 sm:w-20 sm:h-[45%] sm:text-[0.8em] rounded-3xl text-green-600 flex items-center justify-center ' to='/signin'>Login</Link>
          </li>
          <li className='flex gap-10 h-full items-center '>
            <Link className='bg-white h-[50%] w-28 sm:w-20 sm:h-[45%] sm:text-[0.8em] rounded-3xl text-green-600 flex items-center justify-center ' to='/signup'>Register</Link>
          </li>
        </ul>
      </nav>
      {/* Section 1 */}
      <div className="section2 w-full h-[30em] bg-slate-100 flex border-b-8 border-slate-200 sm:flex-col" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
        <div className='w-hf sm:w-full sm:mt-10 sm:h-hf flex mt-[-2em] items-center'>
          <div className='ms-[10%]'>
            <h1 className='text-[2.6em] sm:text-[1.4em] text-bold text-green-400 border-s-8 border-green-400 ps-4 rounded-[5px]'>Chat very fast </h1>
            <p className='text-[3em] sm:text-[1em] ps-6 text-red-500 '>Chat, have some fun</p>
            <h2 className='ps-6'><span className='text-green-500 text-[1.7em] sm:text-[1em]'> <i>Chat easy,</i></span><span className='text-red-500 text-[2.2em] sm:text-[1.3em]'> <i>Stay Happy.</i></span> </h2>
            <Link to='/signup'>
              <button className=' transition-all h-12 bg-green-400 text-white font-semibold hover:bg-white hover:text-blue-950 w-[10em] rounded-3xl ms-6 mt-5 sm:h-8 sm:text-[0.7em] sm:mt-3'>Get Started</button>
            </Link>
          </div>
        </div>
        <div className='w-hf sm:w-full sm:h-hf'>
          <img src={section1Img} alt="" className='w-full h-full ' />
        </div>
      </div>
      {/* Section  2*/}
      <div className="section2 w-full h-[30em] bg-white flex sm:flex-col-reverse" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
        <div className='w-hf sm:h-hf sm:w-full '>
          <img src={section5Img} alt="" className='w-full h-full ' />
        </div>
        <div className='w-hf sm:w-full sm:h-hf flex mt-[-4em] items-center border-blue-50'>
          <div className='ms-[10%]'>
            <h1 className='text-[2.8em] text-bold border-blue-600 text-green-500 rounded-[5px]'>Fast Response</h1>
            <p className='mt-3 text-lg text-green-500 w-[70%] '>You will be able to chat with people from all over the world...</p>
          </div>
        </div>
      </div>
      {/* Section  3*/}
      <div className="section2 w-full h-[30em] bg-white flex sm:flex-col border-b-8 border-white sm:border-4" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
        <div className='w-hf sm:w-full sm:h-hf flex items-center'>
          <div className='ms-[10%]'>
            <h1 className='text-[2.7em] text-bold border-green-700 text-green-500 rounded-[5px] mt-2'>Stay Connected, Stay Powered!</h1>
            <p className='mt-3 text-lg text-green-500 w-[70%] '> Quick, simple, and budget-friendly—so you can get back to chatting.</p>
          </div>
        </div>
        <div className='w-hf sm:h-hf sm:w-full '>
          <img src={section3Img} alt="" className='w-full h-full ' />
        </div>
      </div>
      {/* Section  4*/}
      <div className="section2 w-full h-[30em] bg-white flex sm:flex-col-reverse" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
        <div className='w-hf sm:h-hf sm:w-full '>
          <img src={section2Img} alt="" className='w-full h-full ' />
        </div>
        <div className='w-hf sm:w-full sm:h-hf flex mt-[-4em] items-center border-blue-50'>
          <div className='ms-[10%]'>
            <h1 className='text-[2.8em] text-bold border-blue-700 text-green-500 rounded-[5px]'>Save & Secured</h1>
            <p className='mt-3 text-lg text-green-500 w-[70%] '>Make your chat secure. Register with Adey Square chat app and you won't the decision anytime anyday. Very Secure & Fast</p>
          </div>
        </div>
      </div>
      <footer style={{ fontFamily: '"Josefin Sans", sans-serif' }} className='bg-green-950 h-28 text-blue-50 flex items-center justify-center border-t-8'>
        <p>Copy right, (Adey Square) 2024.</p>
      </footer>
    </>
  )
}
export default Home