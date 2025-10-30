import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import './AppLayout.css'

import { useUserContext } from '../context/UserContext';

export default function AppLayout() {
  
  const { 
      userAuthorized, 
      userLoading,
  } = useUserContext();

  if (userLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (userAuthorized == false) {
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