import React, { useState } from "react";
import ClaimForm from "./ClaimForm";
import { createClaim } from "../services/chatApi";

interface ClaimCreationPageProps {
  onBack: () => void;
}

const ClaimCreationPage: React.FC<ClaimCreationPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdClaim, setCreatedClaim] = useState<any>(null);

  const handleSubmit = async (claimData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createClaim(claimData);

      if (result.success) {
        setCreatedClaim(result.claim);
        setSuccess(true);
      } else {
        setError(result.error || "Failed to create claim");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success && createdClaim) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Claim Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your claim has been submitted and is now under review.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Claim Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Claim ID:</span>
                  <span className="ml-2 text-blue-600 font-mono">
                    {createdClaim.claimId}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-green-600">
                    {createdClaim.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2">{createdClaim.claimType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Policy Number:
                  </span>
                  <span className="ml-2">{createdClaim.policyNumber}</span>
                </div>
                {createdClaim.amount > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Estimated Amount:
                    </span>
                    <span className="ml-2">
                      ${createdClaim.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2">{createdClaim.submissionDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Our claims team will review your submission within 24-48
                  hours
                </li>
                <li>• You'll receive email updates on your claim status</li>
                <li>
                  • A claims adjuster may contact you for additional information
                </li>
                <li>• You can track your claim using the Claim ID above</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedClaim(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Another Claim
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Chat
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Claim</h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to submit a new insurance claim. All fields
            marked with * are required.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Claim Form */}
        <ClaimForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ClaimCreationPage;
