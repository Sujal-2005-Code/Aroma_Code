import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactSection } from "@/components/landing/contact-section";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 sm:pt-28 lg:pt-32">
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
