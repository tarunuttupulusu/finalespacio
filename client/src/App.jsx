import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/common/CustomCursor';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import WhatWeDo from './pages/WhatWeDo';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Admin / CMS Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout, { AdminDashboardHome } from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProducts from './pages/admin/AdminProducts';
import { AdminTestimonials, AdminFAQs, AdminSettings, AdminMedia } from './pages/admin/AdminCMS';

// ── Scroll to top on every route change ─────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Shared Layout Wrapper
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <CustomCursor />
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────── */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
            <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
            <Route path="/projects/:slug" element={<MainLayout><ProjectDetails /></MainLayout>} />
            <Route path="/what-we-do" element={<MainLayout><WhatWeDo /></MainLayout>} />
            <Route path="/what-we-do/:slug" element={<MainLayout><WhatWeDo /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/products/:slug" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />

            {/* ── Admin Routes (No Navbar/Footer) ───────────────────── */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardHome /></AdminLayout>} />
            <Route path="/admin/enquiries" element={<AdminLayout><AdminEnquiries /></AdminLayout>} />
            <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
            <Route path="/admin/testimonials" element={<AdminLayout><AdminTestimonials /></AdminLayout>} />
            <Route path="/admin/gallery" element={<AdminLayout><AdminMedia /></AdminLayout>} />
            <Route path="/admin/faqs" element={<AdminLayout><AdminFAQs /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            {/* 404 fallback */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

const NotFound = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center text-center px-6 space-y-5">
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold mb-4">404</p>
      <h1 className="font-editorial text-5xl font-bold text-charcoal mb-4">Page Not Found</h1>
      <p className="font-sans text-sm text-walnut mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="inline-flex items-center space-x-2 bg-charcoal text-cream font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button hover:bg-gold hover:text-charcoal transition-all duration-300">
        Back to Home
      </a>
    </div>
  </div>
);

export default App;
