// RequestCard.js
import React, { useState, useEffect } from "react";
import { Button, Modal } from 'flowbite-react';

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
            className="text-white bg-green-300 hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-green-400 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center dark:bg-green-400 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => handleMarkCompleted(request.id)}
          >
            Mark as Completed
          </button>
          <button
            type="button"
            className="text-white bg-red-200 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => handleMarkFailed(request.id)}
          >
            Mark as Failed
          </button>
        </div>
        <div>{request.timestamp}</div>
      </div>




      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{request.itemName} | {request.department}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Equipment Use: {request.equipmentType}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
              to ensure a common set of data rights in the European Union. It requires organizations to notify users as
              soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>close</Button>
          
        </Modal.Footer>
      </Modal>

    </div>
    
  );
};

export default RequestCard;
