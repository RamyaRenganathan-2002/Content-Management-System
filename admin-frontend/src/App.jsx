import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { hydrateAuth } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import PageEditorPage from './pages/PageEditorPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/new"
        element={
          <ProtectedRoute>
            <PageEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/edit/:id"
        element={
          <ProtectedRoute>
            <PageEditorPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;