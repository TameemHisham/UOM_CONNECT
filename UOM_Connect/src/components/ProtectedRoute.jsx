import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth } from "../utils/auth";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const result = await checkAuth();
      setIsAuth(result);
    };
    verify();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
