import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Airtime", path: "/airtime" },
    { name: "Data", path: "/data" },
    { name: "Utility bills", path: "/utility-bills" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 relative">
          {/* Logo - positioned on the left */}
          <div className="absolute left-0 flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img
                src="/bitstra-logo.svg"
                alt="Bitstra"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - centered */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    location.pathname === item.path
                      ? "text-[#10B981] bg-[#10B981]/10"
                      : "text-gray-700 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - can be used for future features */}
          <div className="absolute right-0 flex items-center space-x-3"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
