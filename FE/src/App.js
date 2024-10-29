// App.js
import React from 'react';
import AppRoutes from './routes/Routes';
import Header from './components/Header/Header.js';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;
