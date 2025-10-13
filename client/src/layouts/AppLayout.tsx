import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import './AppLayout.css'

import useUser from '../hooks/useUser';

export default function AppLayout() {
    const { 
        userAuthorized, 
        userLoading,
    } = useUser();

  if (userLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!userAuthorized) {
    return <Navigate to="/" replace />;
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