import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Community from './pages/Community';
import Settings from './pages/Settings';
import UploadPage from './pages/Upload';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth & Marketing Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAccount />} />

        {/* App Workspace Pages Wrapped in Persistent Layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/library"
          element={
            <Layout>
              <Library />
            </Layout>
          }
        />
        <Route
          path="/community"
          element={
            <Layout>
              <Community />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/upload"
          element={
            <Layout>
              <UploadPage onUploadSuccess={() => {}} />
            </Layout>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Layout>
              <Onboarding onComplete={() => {}} />
            </Layout>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
