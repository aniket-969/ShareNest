import RoomLoader from "@/components/skeleton/Room";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;
console.log("at load")
  if (isLoading) return null;
console.log("loaded moving fwd")
  if (isError || !data) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard