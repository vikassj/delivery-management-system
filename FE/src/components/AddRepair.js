import React, { useState } from 'react';
import axios from 'axios';

function AddRepair() {
    const [repair, setRepair] = useState({ vehicleNumber: '',repairDescription: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace 'http://localhost:5000/api/repairs' with your actual endpoint
            const response = await axios.post(
              "http://localhost:4000/api/store_vehicle",
              repair
            );
            console.log('Repair Added:', response.data);
            sessionStorage.setItem("vehicleNumber", repair.vehicleNumber);
            setMessage('Repair added successfully!');

            // Optionally reset the form after successful submission
            setRepair({ vehicleNumber: '',repairDescription: '' });
        } catch (error) {
            console.error('There was an error adding the repair:', error);
            setMessage('Failed to add repair. Please try again.');
        }
    };

    return (
        <div className="container my-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Add Repair</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="vehicleNumber" className="form-label">Vehicle Number</label>
                            <input
                                type="text"
                                id="vehicleNumber"
                                className="form-control"
                                placeholder="Enter Vehicle Number"
                                value={repair.vehicleNumber}
                                onChange={(e) => setRepair({ ...repair, vehicleNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">RepairrepairDescription</label>
                            <textarea
                                id="description"
                                className="form-control"
                                placeholder="Enter RepairrepairDescription"
                                value={repair.description}
                                onChange={(e) => setRepair({ ...repair,repairDescription: e.target.value })}
                                required
                                rows="4"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Repair</button>
                    </form>
                    {message && <div className="mt-3 alert alert-info">{message}</div>}
                </div>
            </div>
        </div>
    );
}

export default AddRepair;
