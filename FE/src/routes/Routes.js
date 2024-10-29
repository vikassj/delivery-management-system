// routes/Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent';
import AddRepair from '../components/AddRepair';
import AddIssue from '../components/AddIssue';
import Payment from '../components/Payment';
import RevenueCharts from '../components/RevenueCharts';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RegisterComponent />} />
            <Route path="/add-repair" element={<AddRepair />} />
            <Route path="/add-issue" element={<AddIssue />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/revenue" element={<RevenueCharts />} />
        </Routes>
    );
}

export default AppRoutes;
