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
    <nav className="w-full bg-surface border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 relative">
          {/* Logo - positioned on the left */}
          <div className="absolute left-0 flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold text-foreground">
              Bitstra
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
                      ? "text-success bg-success/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
