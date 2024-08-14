import Navbar from '@/components/Navbar';
import React from 'react';

const Page = () => {
  return (
    <div className=" bg-gray-50">
   

      <div className="flex flex-col justify-center max-w-5xl m-auto py-8 px-4">
        <div className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome to ClassRoom, Principal Sir
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <p className="text-lg text-gray-700">
            As a Principal, you have the following capabilities:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>View the list of Teachers and Students in table form.</li>
            <li>
              Modify or delete the details of Students and Teachers.
            </li>
            <li>Create a new Classroom.</li>
            <li>Assign a classroom to a Teacher.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
