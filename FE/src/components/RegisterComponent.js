import React, { useEffect, useState } from "react";
import axios from "axios";

function RegisterComponent() {
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({
    name: "",
    newPrice: 0,
    repairPrice: 0,
  });

  // Fetch components from the API
  const fetchComponents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/components"); // Adjust the API endpoint as needed
      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching components:", error);
      alert("Failed to fetch components.");
    }
  };

  // Add a new component
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, newPrice, repairPrice } = newComponent;

    // Validation
    if (!name || newPrice <= 0 || repairPrice <= 0) {
      alert("Please enter valid component details.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/create_component",
        newComponent
      );
      fetchComponents();
      setComponents([...components, { ...newComponent, id: response.data.id }]); // Assuming your API returns the new component with an id
      setNewComponent({ name: "", newPrice: 0, repairPrice: 0 }); // Clear the form
    } catch (error) {
      console.error("Error adding component:", error);
      alert("Failed to add component.");
    }
  };

  useEffect(() => {
    fetchComponents(); // Fetch components when the component mounts
  }, []);

  return (
    <div className="p-4">
      <h2>Register Component</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="componentName" className="form-label">
            Component Name
          </label>
          <input
            type="text"
            id="componentName"
            value={newComponent.name}
            onChange={(e) =>
              setNewComponent({ ...newComponent, name: e.target.value })
            }
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPrice" className="form-label">
            New Purchase Price
          </label>
          <input
            type="number"
            id="newPrice"
            value={newComponent.newPrice}
            onChange={(e) =>
              setNewComponent({ ...newComponent, newPrice: +e.target.value })
            }
            required
            min="0"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="repairPrice" className="form-label">
            Repair Price
          </label>
          <input
            type="number"
            id="repairPrice"
            value={newComponent.repairPrice}
            onChange={(e) =>
              setNewComponent({ ...newComponent, repairPrice: +e.target.value })
            }
            required
            min="0"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Component
        </button>
      </form>

      <h3>Existing Components</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Component Name</th>
            <th>Price for New Purchase</th>
            <th>Price for Repair</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.id}>
              <td>{component.name}</td>
              <td>${component.newPrice.toFixed(2)}</td>
              <td>${component.repairPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisterComponent;
