import { hospital } from '@/assets'
import { useUserStore } from '@/stores/userStore'

import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'

const Hero = () => {
  
  const isLoggedIn = useUserStore((state) => state.loggedIn) || false;

  return (
    <section className='flex flex-row w-full justify-between p-[5%]'>
        <img src={hospital} alt="hospital" className='size-[70vh]' />
        <div className='flex flex-col justify-center'>
          <h1 className='text-4xl font-bold'>PhiHub Patient Office</h1>
          <p className='text-lg'> Here you can mark appointments or search for your old appointments.</p>
          {isLoggedIn && (
          <div className="flex flex-row gap-2 mt-5"> 
          <Button variant="outline" className="border-2 border-primary" >Mark a new Appointment</Button>
          <Link to="/appointments">
          <Button variant ="outline" className="border-2 border-primary" >Check my old appointments</Button>
          </Link>
          </div>
          )}
        </div>

    </section>
  )
}

export default Hero