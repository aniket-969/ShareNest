import RoomLoader from "@/components/skeleton/Room";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;

  if (isLoading) return null;

  if (isError || !data) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard