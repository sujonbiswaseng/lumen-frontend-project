"use client";
import Link from "next/link";
import React from "react";
import FacebookFillIcon from "../icons/facebook";
import YoutubeFillIcon from "../icons/youtube";
import GithubIcon from "../icons/github";
import Image from "next/image";


const footerLinks = {
  company: [
    { label: "Contact", href: "https://api.whatsapp.com/send/?phone=+8801804935939" },
  ],
  events: [
    { label: "Browse Events", href: "/events" },
    { label: "Create Event", href: "/user/dashboard/create-event" },
    { label: "Upcoming Events", href: "/events?status=UPCOMING" },
  ],
  account: [
    { label: "Login", href: "/login" },
    { label: "Signup", href: "/register" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  support: [
    { label: "Help/support", href: "/help" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          
          {/* Logo + Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href={"/"}>
              <Image
                src="/logo.png"
                alt="Lumen logo"
                width={48}
                height={48}
                className="object-contain rounded-lg shadow-lg border border-gray-800 bg-white p-1 transition-transform duration-200 hover:scale-105"
                priority
              />
        
              </Link>
              <p>Lumen</p>
              
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Discover, create, and join amazing events around you. 
              Your all-in-one platform for managing and exploring events.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
            <div className="flex gap-4">
                {/* <Link href={"/https://facebook.com/sujonbiswasdev"}><FacebookFillIcon/></Link> */}
                {/* <Link href={"/https://youtube.com/nextgenprogrammer01"}><YoutubeFillIcon/></Link>
                <Link href={"/https://linkedin.com/in/sujonbiswasdev"}><YoutubeFillIcon/></Link>
                <Link href={"/https://github.com/in/sujonbiswasdev"}><GithubIcon/></Link> */}
            </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4 capitalize">
                {key}
              </h3>
              <ul className="space-y-2">
                {links.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm hover:text-white transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white">
              Terms
            </a>
            <a href="https://api.whatsapp.com/send/?phone=+8801804935939" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;