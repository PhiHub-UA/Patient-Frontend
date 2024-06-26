import { hospital } from '@/assets'
import { useUserStore } from '@/stores/userStore'
import { Button } from './ui/button'
import {useState, useEffect} from 'react'
import { Link } from '@tanstack/react-router'

const Hero = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useUserStore((state) => state.login) || false;

  useEffect(() => {
    if (login) {
      setIsLoggedIn(true);
    }
  }, [login]);




  return (
    <section className='flex flex-row w-full justify-between p-[5%]'>
        <img src={hospital} alt="hospital" className='size-[70vh]' />
        <div className='flex flex-col justify-center'>
          <h1 className='text-4xl font-bold' id="mainText">PhiHub Patient Office</h1>
          <p className='text-lg'> Here you can mark appointments or search for your old appointments.</p>
          {!isLoggedIn && (
          <p className='text-lg'> Start by logging in!</p>
          )}
          {isLoggedIn && (
          <div className="flex flex-row gap-2 mt-5"> 
          <Link to="/mark_appointment">
          <Button variant="outline" className="border-2 border-primary" >Mark a new Appointment</Button>
          </Link>
          <Link to="/appointments">
          <Button variant ="outline">Check my old appointments</Button>
          </Link>
          </div>
          )}
        </div>

    </section>
  )
}

export default Hero