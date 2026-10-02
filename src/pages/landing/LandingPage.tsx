import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { FeatureGridSection } from './components/FeatureGridSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SecuritySection } from './components/SecuritySection';
import { AttendanceExperienceSection } from './components/AttendanceExperienceSection';
import { RoleExperienceSection } from './components/RoleExperienceSection';
import { SuperadminCmsPreviewSection } from './components/SuperadminCmsPreviewSection';
import { RbacMatrixSection } from './components/RbacMatrixSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { ReportingSection } from './components/ReportingSection';
import { MobileSection } from './components/MobileSection';
import { WhyAttendanceSection } from './components/WhyAttendanceSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { LandingFooter } from './components/LandingFooter';

interface LandingPageProps {
  onLoginClick: () => void;
  onEnterApp: () => void;
  isLoggedIn?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onEnterApp,
  isLoggedIn = false,
}) => {
  const scrollToWorkflow = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
      {/* 1. Sticky Navigation */}
      <LandingNavbar
        onLoginClick={onLoginClick}
        onEnterApp={onEnterApp}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Interactive Mockup */}
        <HeroSection
          onStartClick={onLoginClick}
          onExploreWorkflow={scrollToWorkflow}
        />

        {/* 3. Problem & Solution Transition */}
        <ProblemSolutionSection />

        {/* 4. 12 Core Enterprise Features */}
        <FeatureGridSection />

        {/* 5. How It Works (Employee 6-Step Workflow) */}
        <HowItWorksSection />

        {/* 6. Multi-Layer Security Architecture */}
        <SecuritySection />

        {/* 7. Attendance Experience (Simulated Phone Check-In) */}
        <AttendanceExperienceSection />

        {/* 8. Role Experience (Employee vs Manager/HR vs Admin) */}
        <RoleExperienceSection />

        {/* 9. Superadmin CMS (Centralized Master Data Management & CRUD Preview) */}
        <SuperadminCmsPreviewSection />

        {/* 10. RBAC Matrix & Granular Permissions */}
        <RbacMatrixSection />

        {/* 11. Integrations (Google, Telegram, Roadmap) */}
        <IntegrationsSection />

        {/* 12. Reporting & Analytics Mockup */}
        <ReportingSection />

        {/* 13. Mobile Accessibility & PWA */}
        <MobileSection />

        {/* 14. Why ATTENDANCE (4 Core Pillars) */}
        <WhyAttendanceSection />

        {/* 15. FAQ (8 Essential Enterprise Questions) */}
        <FaqSection />

        {/* 16. Big CTA Conversion Section */}
        <CtaSection
          onStartClick={onLoginClick}
          onLoginClick={onLoginClick}
        />
      </main>

      {/* 17. Enterprise Footer */}
      <LandingFooter />
    </div>
  );
};
