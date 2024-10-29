import React, { useState } from 'react'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 

// Dummy data for daily, monthly, and yearly revenues 
const revenueData = { 
    daily: [ 
        { name: 'Mon', revenue: 120 }, 
        { name: 'Tue', revenue: 150 }, 
        { name: 'Wed', revenue: 200 }, 
        { name: 'Thu', revenue: 180 }, 
        { name: 'Fri', revenue: 300 }, 
        { name: 'Sat', revenue: 250 }, 
        { name: 'Sun', revenue: 400 }, 
    ], 
    monthly: [ 
        { name: 'Jan', revenue: 400 }, 
        { name: 'Feb', revenue: 800 }, 
        { name: 'Mar', revenue: 700 }, 
        { name: 'Apr', revenue: 600 }, 
        { name: 'May', revenue: 900 }, 
        { name: 'Jun', revenue: 500 }, 
    ], 
    yearly: [ 
        { name: '2020', revenue: 12000 }, 
        { name: '2021', revenue: 15000 }, 
        { name: '2022', revenue: 20000 }, 
        { name: '2023', revenue: 25000 }, 
    ], 
}; 

function RevenueCharts() { 
    const [timeframe, setTimeframe] = useState('monthly'); // Default to monthly 

    const handleTimeframeChange = (e) => { 
        setTimeframe(e.target.value); 
    }; 

    return ( 
        <div className="container my-4"> 
            <h2 className="mb-4">Revenue Charts</h2> 
            <div className="mb-3"> 
                <label htmlFor="timeframeSelect" className="form-label">Select Timeframe:</label> 
                <select 
                    id="timeframeSelect" 
                    className="form-select" 
                    value={timeframe} 
                    onChange={handleTimeframeChange} 
                > 
                    <option value="daily">Daily</option> 
                    <option value="monthly">Monthly</option> 
                    <option value="yearly">Yearly</option> 
                </select> 
            </div> 
            <ResponsiveContainer width="100%" height={400}> 
                <LineChart data={revenueData[timeframe]}> 
                    <CartesianGrid strokeDasharray="3 3" /> 
                    <XAxis dataKey="name" /> 
                    <YAxis /> 
                    <Tooltip /> 
                    <Legend /> 
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" /> 
                </LineChart> 
            </ResponsiveContainer> 
        </div> 
    ); 
} 

export default RevenueCharts;