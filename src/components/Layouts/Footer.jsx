import React from 'react';
import Link from 'next/link';
import Logo from '../Logo/Logo';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
        <Logo />

        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>

        <nav>
          <h6 className="footer-title">Company</h6>
          <Link href="/about" className="link link-hover">About us</Link>
          <Link href="/help" className="link link-hover">Contact</Link>
          <a className="link link-hover">Jobs</a>
          <Link href="/FAQ" className="link link-hover">FAQ</Link>
        </nav>

        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>

      {/* Copyright Bar */}
      <div className="footer footer-center bg-base-300 text-base-content py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
        <p>© {year} Clover Clothing. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/help" className="hover:underline">Contact</Link>
          <Link href="/FAQ" className="hover:underline">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
