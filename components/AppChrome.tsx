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
  const isMLN111Route = pathname?.startsWith("/resources/MLN111");
  const isMLN122Route = pathname?.startsWith("/resources/MLN122");
  const showHelpWidget =
    pathname === "/" ||
    pathname === "/feedback" ||
    pathname === "/about" ||
    pathname?.startsWith("/resources");

  return (
    <>
      {!isAdminRoute && !isMLN111Route && !isMLN122Route && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && !isMLN111Route && !isMLN122Route && showHelpWidget && <HelpChatWidget />}
      {!isAdminRoute && !isMLN111Route && !isMLN122Route && <Footer />}
    </>
  );
}
