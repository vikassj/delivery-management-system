import React, { useState, useEffect } from "react";
import axios from "axios";

function AddIssue() {
  const [issue, setIssue] = useState({
    vehicleModel: "",
    componentName: "",
    issueType: "repair",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
  const [message, setMessage] = useState("");
  const [componentData, setComponentData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for API data

  // Fetch component data from API when component mounts
  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/components"
        ); // Adjust endpoint as necessary
        setComponentData(response.data);
      } catch (error) {
        console.error("Error fetching component data:", error);
        setMessage("Failed to load component data.");
      } finally {
        setLoading(false);
      }
    };
    fetchComponentData();
  }, []);

  // Get selected component's details
  const selectedComponent = componentData.find(
    (comp) => comp.name === issue.componentName
  );

  // Update unitPrice and totalPrice based on selected component and issue type
  const updatePrices = () => {
    if (selectedComponent) {
      const unitPrice =
        issue.issueType === "repair"
          ? selectedComponent.repairPrice
          : selectedComponent.newPrice;
      const totalPrice = unitPrice * issue.quantity;
      setIssue((prev) => ({ ...prev, unitPrice, totalPrice }));
    } else {
      setIssue((prev) => ({ ...prev, unitPrice: 0, totalPrice: 0 }));
    }
  };

  useEffect(() => {
    updatePrices();
  }, [issue.componentName, issue.issueType, issue.quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/create_issue",
        {
          ...issue,
          unitPrice: issue.unitPrice, // Include unitPrice
          totalPrice: issue.totalPrice, // Include totalPrice
        }
      ); // Replace with actual endpoint
      console.log("Issue Added:", response.data);
      setMessage("Issue added successfully!");

      // Optionally reset the form after submission
      setIssue({
        vehicleModel: "",
        componentName: "",
        issueType: "repair",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
    } catch (error) {
      console.error("There was an error adding the issue!", error);
      setMessage("Failed to add issue. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Add Issue</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="vehicleModel" className="form-label">
                Vehicle Model
              </label>
              <input
                type="text"
                id="vehicleModel"
                className="form-control"
                placeholder="Enter vehicle model"
                value={issue.vehicleModel}
                onChange={(e) =>
                  setIssue({ ...issue, vehicleModel: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="component" className="form-label">
                Component Name
              </label>
              <select
                id="component"
                className="form-select"
                value={issue.componentName}
                onChange={(e) =>
                  setIssue({ ...issue, componentName: e.target.value })
                }
                required
                disabled={loading || componentData.length === 0}
              >
                <option value="" disabled>
                  {loading ? "Loading components..." : "Select Component"}
                </option>
                {componentData.map((component) => (
                  <option key={component.id} value={component.name}>
                    {component.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Issue Type
              </label>
              <select
                id="type"
                className="form-select"
                value={issue.issueType}
                onChange={(e) =>
                  setIssue({ ...issue, issueType: e.target.value })
                }
              >
                <option value="repair">Repair</option>
                <option value="new">New Purchase</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={issue.quantity}
                onChange={(e) =>
                  setIssue({ ...issue, quantity: parseInt(e.target.value) })
                }
                min="1"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Price</label>
              <input
                type="text"
                className="form-control"
                value={
                  issue.unitPrice
                    ? `$${issue.unitPrice.toFixed(2)}`
                    : "Select a component"
                }
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Price</label>
              <input
                type="text"
                className="form-control"
                value={`$${issue.totalPrice.toFixed(2)}`}
                readOnly
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Add Issue
            </button>
          </form>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default AddIssue;
