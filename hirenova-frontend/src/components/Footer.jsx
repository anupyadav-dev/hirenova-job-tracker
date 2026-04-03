import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-bold">Hirenova</h2>
          <p className="text-gray-400 mt-2">Find your dream job 🚀</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <div className="flex flex-col gap-1 text-gray-400">
            <Link to="/">Jobs</Link>
            <Link to="/my-applications">My Applications</Link>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <div className="flex flex-col gap-1 text-gray-400">
            <a href="https://github.com/" target="_blank">
              GitHub
            </a>
            <a href="https://linkedin.com/" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Hirenova. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
