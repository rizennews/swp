import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import CurriculumSection from "@/components/curriculum-section";
import DetailsSection from "@/components/details-section";
import InstructorSection from "@/components/instructor-section";
import CtaSection from "@/components/cta-section";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-[#0d0d14]">
      <Navbar />
      <HeroSection />
      {/* About has its own 280vh sticky scroll container for the card fan animation */}
      <AboutSection />
      <CurriculumSection />
      <DetailsSection />
      <InstructorSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
