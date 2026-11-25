import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ContactSection from "./ContactSection";
import { WhatsAppFloat } from "./Social";
import { CallbackWidget } from "./CallbackWidget";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <ContactSection />
      <Footer />
      <CallbackWidget />
      <WhatsAppFloat />
    </>
  );
}
