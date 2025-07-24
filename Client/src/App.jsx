
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<MainLayout />}>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
