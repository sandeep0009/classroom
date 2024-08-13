import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-gray-100 border-t border-grey-600 py-6 '>
      <div className='max-w-6xl mx-auto px-4'>
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            ClassRoom
          </div>
          <div className="flex flex-wrap lg:space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
          </div>
        </div>
        <div className="mt-4  text-center text-sm text-gray-600">
          © {new Date().getFullYear()} ClassRoom. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer