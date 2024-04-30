import React from 'react'
import { hospital } from '@/assets'

const Hero = () => {
  return (
    <section className='flex flex-row w-full justify-between p-[5%]'>
        <img src={hospital} alt="hospital" className='size-[70vh]' />
        <div className='flex flex-col justify-center'>
          <h1 className='text-4xl font-bold'>Hospital Management System</h1>
          <p className='text-lg'>Manage your hospital with ease</p>
        </div>
    </section>
  )
}

export default Hero