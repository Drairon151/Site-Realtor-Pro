import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar/Sidebar';

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* <Sidebar /> */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}