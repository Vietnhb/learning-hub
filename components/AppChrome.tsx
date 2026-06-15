"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HelpChatWidget from "@/components/HelpChatWidget";

interface AppChromeProps {
  children: React.ReactNode;
}

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const showHelpWidget =
    pathname === "/" ||
    pathname === "/feedback" ||
    pathname === "/about" ||
    pathname?.startsWith("/resources");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && showHelpWidget && <HelpChatWidget />}
      {!isAdminRoute && <Footer />}
    </>
  );
}
