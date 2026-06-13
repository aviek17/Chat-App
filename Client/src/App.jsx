
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';
import { lazy, Suspense, useEffect } from 'react';
import MainContainer from './pages/MainContainer';
import FriendApproval from './pages/FriendApproval';


const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const MainLayoutPage = lazy(() => import('./layouts/MainLayout'));
const MainContainerPage = lazy(() => import('./pages/MainContainer'));
const FriendApprovalPage = lazy(() => import('./pages/FriendApproval'));


function App() {
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayoutPage />}>
            <Route index element={<MainContainerPage />} />
            <Route path="/contact" element={<FriendApprovalPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
    // <>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route element={<PrivateRoute />}>
    //       <Route path="/" element={<MainLayout />}>
    //         <Route index element={<MainContainer />} />
    //         <Route path="/contact" element={<FriendApproval />} />
    //       </Route>
    //     </Route>
    //   </Routes>
    // </>
  )
}

export default App
