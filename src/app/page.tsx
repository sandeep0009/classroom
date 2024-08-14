import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center  items-center py-11 ">
     
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Welcome to ClassRoom
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            ClassRoom provides an easy and intuitive platform to manage your classes and schedules.
          </p>
          <div className="mt-4">
            <button className="bg-black text-white font-bold py-2 px-4 rounded transition duration-300">
              <Link href="/signin">Get Started</Link>
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500 italic">Your education, simplified.</p>
        </div>
     
   
    </div>
  );
}