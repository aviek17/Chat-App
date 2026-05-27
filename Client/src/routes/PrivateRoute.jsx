import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";

const PrivateRoute = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />;
}

export default PrivateRoute;