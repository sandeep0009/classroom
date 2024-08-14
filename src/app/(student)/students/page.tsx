
import React from 'react';

const Page = () => {
  return (
    <div>
   

      <div className="flex flex-col justify-center max-w-4xl m-auto py-8 px-4">
        <div className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome to ClassRoom,Students
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <p className="text-lg text-gray-700">
            As a Students, you have the following capabilities:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>View the list of Students in classroom in table form.</li>
            <li>View Time table.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
