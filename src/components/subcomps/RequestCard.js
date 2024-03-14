import React from "react";

const AdminTab = ({ requests }) => {
  const handleViewMore = (id) => {
    // Logic to show more info for the selected request
    console.log("View more info for request with ID:", id);
  };

  const handleMarkCompleted = (id) => {
    // Logic to mark the request as completed
    console.log("Mark request with ID:", id, "as completed");
  };

  const handleMarkFailed = (id) => {
    // Logic to mark the request as failed
    console.log("Mark request with ID:", id, "as failed");
  };

  return (
    <div className="p-4 pt-20 sm:ml-64 dark:bg-gray-800 ">
      {requests.map((request) => (
        <div
          key={request.id}
          className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
        >
          <div className="flex items-center">
            <h3 className="text-lg font-medium  pb-2">
              New request from {request.email}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <button
                type="button"
                className="text-white bg-blue-800 hover:bg-blue-900  focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => handleViewMore(request.id)}
              >
                <svg
                  className="me-2 h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 14"
                >
                  <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
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
            <div> {request.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTab;
