import { Routes, Route, } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/Routes';
import NavigationMenu from './components/core/NavigationMenu';

const App = () => {

  return (
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
  );
};

export default App;
