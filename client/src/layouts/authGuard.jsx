import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { sessionQuery } = useAuth();
  const { data, isLoading, isError } = sessionQuery;

  if (isLoading) return <Spinner/>;

  if (isError || !data) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard