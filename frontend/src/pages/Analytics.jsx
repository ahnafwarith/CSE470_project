import React, { useState, useEffect } from "react";
import axios from "axios";

const Analytics = () => {
    const [jobs, setJobs] = useState([]); // State for storing job data
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const itemsPerPage = 5; // Jobs per page

    // Fetch jobs from the backend
    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:3000/jobs/getjobs", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // Sort jobs by most recent (assuming `createdAt` exists)
            const sortedJobs = response.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setJobs(sortedJobs); // Update jobs state
            setError(null); // Reset error state
        } catch (error) {
            setError("Failed to fetch jobs. Please try again later."); // Handle error
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const paginatedJobs = jobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handlers for pagination
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePageSelect = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">Analytics Overview</h1>
                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <>
                            <p className="text-gray-700 text-lg mb-4">
                                <span className="font-medium">Total Jobs:</span> {jobs.length}
                            </p>
                            <p className="text-gray-700 text-lg mb-4">
                                <span className="font-medium">Active Jobs:</span>{" "}
                                {jobs.filter((job) => job.status === "Active").length}
                            </p>
                            <p className="text-gray-700 text-lg mb-4">
                                <span className="font-medium">Expired Jobs:</span>{" "}
                                {jobs.filter((job) => job.status === "Expired").length}
                            </p>
                        </>
                    )}
                </div>

                {!isLoading && !error && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Recent Jobs</h2>
                        {paginatedJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedJobs.map((job) => (
                                    <div key={job._id} className="bg-white shadow-md rounded-lg p-4">
                                        <h3 className="text-xl font-bold text-blue-600 mb-2">{job.title}</h3>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Company:</span> {job.company}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Location:</span> {job.location}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Work Type:</span> {job.workType}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Salary:</span> {job.salary} {job.currency}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Application Deadline:</span>{" "}
                                            {new Date(job.applicationDeadline).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-2">
                                            <span className="font-medium">Status:</span> {job.status}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700 text-lg">No job details available.</p>
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && !error && jobs.length > itemsPerPage && (
                    <div className="mt-6 flex justify-center items-center gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map((page) => (
                            <button
                                key={page + 1}
                                onClick={() => handlePageSelect(page + 1)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === page + 1
                                        ? "bg-blue-700 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                                }`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
