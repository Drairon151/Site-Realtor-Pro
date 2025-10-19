import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import './AppLayout.css'

import { useUserContext } from '../context/UserContext';

export default function RealtorLayout() {
    const { 
        user,
        userLoading,
    } = useUserContext();

  if (userLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== 'realtor') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}