// RequestCard.js
import React, { useState, useEffect } from "react";
import { Button, Modal } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';

const RequestCard = ({ request }) => {

  const [openModal, setOpenModal] = useState(false);

  const handleViewMore = (id) => {
    console.log("View more info for request with ID:", id);
  };

  const handleMarkCompleted = (id) => {
    console.log("Mark request with ID:", id, "as completed");
  };

  const handleMarkFailed = (id) => {
    console.log("Mark request with ID:", id, "as failed");
  };


  return (
    <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800">
      
      <div className="flex items-center">
        <h3 className="text-lg font-medium pb-2">
          New request from: {request.userEmail}
        </h3>
      </div>
      <div className="flex justify-between items-center">
        <div>
          
          <button
            type="button"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setOpenModal(true)}
          >
            View more
          </button>
          <button
            type="button"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => handleMarkCompleted(request.id)}
          >
            Mark as Completed ✔
          </button>
          <button
            type="button"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => handleMarkFailed(request.id)}
          >
            Mark as Failed ✖
          </button>
        </div>
        <div>{request.timestamp}</div>
      </div>



      <Modal  show={openModal} >
        <Modal.Body  class="dark:bg-gray-800 rounded-lg dark:border-blue-800">
          <div className="space-y-6 p-4 text-white text-xl ">
            <h1 class="dark:bg-gray-800 ">{request.itemName} </h1>
            <div class="p-2">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
             • Requested By: {request.userEmail}
            </p> <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
             • Department: {request.department}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
             • Equipment Type: {request.equipmentType}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 p-3">
              Description: {request.description}
            </p>
            </div>
            <button
            type="button"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setOpenModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setOpenModal(false)}
          >
            Download Files
          </button>
          <button
            className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            href={request.fileUrl}  
          >
            Link To files
          </button>
          </div>
        </Modal.Body>
        
      </Modal>
      </div>

    
  );
};

export default RequestCard;
