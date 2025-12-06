import Badge from './Badge'
import { Button } from './Button'

const Hero = () => {
  return (
      <div className='w-full flex flex-col gap-10 items-center justify-center'>
      <Badge />
      
      <div className='max-w-4xl px-4 flex flex-col items-center justify-center'>
        <h1 className='text-5xl md:text-7xl font-semibold text-center text-black text-shadow-lg'>
          Automate Your <span className='text-yellow-400'>Timetable</span> Creation
        </h1>

        <p className='text-center text-gray-500 mt-10 text-2xl'> Create efficient and personalized timetables with ease.</p>

        <Button className='mt-10 mx-auto block'>Get Started</Button>
      </div>
      
      </div>
  )
}

export default Hero