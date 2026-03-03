import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 text-xs text-center py-4 border-t border-stone-700">
      &copy; {new Date().getFullYear()} DiamondDesk. All rights reserved. &nbsp;|&nbsp; Developed by <a href="https://www.web-developer-kp.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">web-developer-kp.com</a>
    </footer>
  );
}