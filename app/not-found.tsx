import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col w-full min-h-80 max-w-screen-xl mx-auto py-8 justify-center items-center'>
      <h2 className='text-6xl mb-10'>404</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}