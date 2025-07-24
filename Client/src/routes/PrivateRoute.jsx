import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

const PrivateRoute = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return isAuthenticated ? <Outlet/> : <Login />;
}

export default PrivateRoute;