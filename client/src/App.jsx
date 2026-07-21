import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/common/CustomCursor';
import QuoteModal from './components/common/QuoteModal';

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
    // Use a small timeout to allow React to render the new page
    // and for Lenis to stop its current scroll inertia
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
};

// Shared Layout Wrapper with Page Transitions
const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <QuoteModal />
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <CustomCursor />
          <Routes>
            {/* ── Public Routes (Animated) ────────────────────────── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/what-we-do" element={<WhatWeDo />} />
              <Route path="/what-we-do/:slug" element={<WhatWeDo />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Route>

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
