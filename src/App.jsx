import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import UrgentRequestForm from './components/UrgentRequestForm';
import LiveRequestTracker from './components/LiveRequestTracker';
import DonorDashboard from './components/DonorDashboard';
import BloodCompatibilityVisualizer from './components/BloodCompatibilityVisualizer';
import HospitalAdminPortal from './components/HospitalAdminPortal';
import ScheduledCarePortal from './components/ScheduledCarePortal';
import LoginOnboardingModal from './components/LoginOnboardingModal';
import PreDonationQuizModal from './components/PreDonationQuizModal';
import WhatsAppSosModal from './components/WhatsAppSosModal';
import SponsorRideModal from './components/SponsorRideModal';
import Footer from './components/Footer';

export default function App() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Language-First Login & Onboarding Gate (with Instant Demo Bypass) */}
      <LoginOnboardingModal />

      {/* 20-Second Pre-Donation Medical Eligibility Quiz Modal (Feature A) */}
      <PreDonationQuizModal />

      {/* One-Tap Auto-Expiring WhatsApp SOS Card Modal (Feature B) */}
      <WhatsAppSosModal />

      {/* Sponsor Donor Ride Modal (Uber/Ola/Rapido) (Feature D) */}
      <SponsorRideModal />

      {/* Top Navbar with Logo, Center Tabs, Theme Picker, User Pill & Demo Switcher */}
      <Navbar />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {activeTab === 'request' && <UrgentRequestForm />}
        {activeTab === 'tracker' && <LiveRequestTracker />}
        {activeTab === 'donor_portal' && <DonorDashboard />}
        {activeTab === 'scheduled_care' && <ScheduledCarePortal />}
        {activeTab === 'compatibility' && <BloodCompatibilityVisualizer />}
        {activeTab === 'admin_portal' && <HospitalAdminPortal />}
      </main>

      {/* Footer with Mandatory Medical Disclaimer */}
      <Footer />
    </div>
  );
}
