import CalanderSVG from "../Logos/CalanderSVG";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand Section */}
          <div className="shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <CalanderSVG size={28} />
              <span className="text-xl font-semibold text-gray-900">
                Auto Gen
              </span>
            </div>
            <div className="inline-flex items-center gap-2 text-gray-700 mb-4 bg-gray-100 rounded-full px-4 py-2 shadow-inner">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></span>
              <span className="font-medium text-xs">
                All systems operational
              </span>
            </div>
            <p className="text-xs text-gray-500">
              © {currentYear} Auto Gen - Smart Timetable Scheduler
            </p>
          </div>

          {/* Right Side Columns */}
          <div className="flex gap-16 md:gap-20">
            {/* Features Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Auto Generation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Schedule Management
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Conflict Resolution
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Tutorial
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-yellow-500 transition-colors text-sm"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
          <p className="text-sm text-gray-500 flex items-center gap-2.5">
            <span>🍪</span>
            <span>No cookies, no tracking. Just a timetable scheduler.</span>
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
