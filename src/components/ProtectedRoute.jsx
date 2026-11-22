import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If user is not authenticated, redirect to /login with attempted destination
  if (!isAuthenticated && !token) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: 'Please sign in to access or join this meeting.',
        }}
        replace
      />
    );
  }

  return children;
}
