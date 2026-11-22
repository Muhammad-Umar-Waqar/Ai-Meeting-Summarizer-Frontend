import { useEffect } from 'react';
import AppRoutes from './app/routes';
import { useAppDispatch } from './app/hooks';
import { fetchCurrentUser } from './features/auth/authSlice';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('meet_token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <AppRoutes />;
}
