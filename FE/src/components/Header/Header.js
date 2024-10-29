// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Create this CSS file for styling

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <h1>Vehicle Service System</h1>
            </div>
            <nav className="header-right">
                <Link to="/">Register Component</Link>
                <Link to="/add-repair">Add Repair</Link>
                <Link to="/add-issue">Add Issue</Link>
                <Link to="/payment">Payment</Link>
                <Link to="/revenue">Revenue Charts</Link>
            </nav>
        </header>
    );
}

export default Header;
