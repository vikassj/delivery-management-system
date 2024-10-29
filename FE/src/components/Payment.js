import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Payment() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch selected items data from API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                  "http://localhost:4000/api/get_issues"
                ); // Adjust the endpoint as needed
                setSelectedItems(response.data);
            } catch (error) {
                console.error('Error fetching selected items:', error);
                setError('Failed to load items.');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    // Function to calculate the total amount
    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => {
            // Assuming we're calculating total for new purchases
            return total + item.unitPrice * item.quantity;
        }, 0);
    };

    const totalAmount = calculateTotal();

    const handlePayment = () => {
        alert(`Payment of $${totalAmount} completed!`);
    };

    if (loading) return <p>Loading items...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Final Price Calculation</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price per Item</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.componentName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="fw-bold">
              Total Amount:{" "}
              <span className="text-success">${totalAmount.toFixed(2)}</span>
            </p>
            <button className="btn btn-primary" onClick={handlePayment}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    );
}

export default Payment;
