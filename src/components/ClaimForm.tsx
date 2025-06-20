import React, { useState } from "react";

interface ClaimFormData {
  policyNumber: string;
  claimType: string;
  description: string;
  estimatedAmount: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ClaimFormProps {
  onSubmit: (claimData: ClaimFormData) => void;
  isLoading?: boolean;
}

const ClaimForm: React.FC<ClaimFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ClaimFormData>({
    policyNumber: "",
    claimType: "Auto",
    description: "",
    estimatedAmount: "",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [errors, setErrors] = useState<Partial<ClaimFormData>>({});

  const claimTypes = [
    { value: "Auto", label: "Auto Insurance" },
    { value: "Home", label: "Home Insurance" },
    { value: "Health", label: "Health Insurance" },
    { value: "Life", label: "Life Insurance" },
    { value: "Business", label: "Business Insurance" },
    { value: "General", label: "General Liability" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ClaimFormData> = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Policy number is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Claim description is required";
    }

    if (formData.estimatedAmount && isNaN(Number(formData.estimatedAmount))) {
      newErrors.estimatedAmount = "Estimated amount must be a valid number";
    }

    if (!formData.contactInfo.name.trim()) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        name: "Name is required",
      };
    }

    if (!formData.contactInfo.email.trim()) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        email: "Email is required",
      };
    } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      newErrors.contactInfo = {
        ...newErrors.contactInfo,
        email: "Please enter a valid email",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ClaimFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContactChange = (
    field: keyof ClaimFormData["contactInfo"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
    if (errors.contactInfo?.[field]) {
      setErrors((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: undefined },
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Claim
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Policy Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="policyNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Policy Number *
            </label>
            <input
              type="text"
              id="policyNumber"
              value={formData.policyNumber}
              onChange={(e) =>
                handleInputChange("policyNumber", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.policyNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your policy number"
            />
            {errors.policyNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.policyNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="claimType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Claim Type *
            </label>
            <select
              id="claimType"
              value={formData.claimType}
              onChange={(e) => handleInputChange("claimType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {claimTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Claim Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Claim Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Please describe what happened and the damages incurred..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Estimated Amount */}
        <div>
          <label
            htmlFor="estimatedAmount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Estimated Amount (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="estimatedAmount"
              value={formData.estimatedAmount}
              onChange={(e) =>
                handleInputChange("estimatedAmount", e.target.value)
              }
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.estimatedAmount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          {errors.estimatedAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.estimatedAmount}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.contactInfo.name}
                onChange={(e) => handleContactChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactInfo?.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.contactInfo?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactInfo.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactInfo?.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your email address"
              />
              {errors.contactInfo?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactInfo.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isLoading ? "Creating Claim..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;
