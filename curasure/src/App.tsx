import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './Routes';
import NavigationMenu from './components/core/NavigationMenu';

const App = () => {

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <NavigationMenu />
            </div>
          }
        />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
