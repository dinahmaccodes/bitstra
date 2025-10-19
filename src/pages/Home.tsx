import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  return (
    <div className="landing-page-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center z-10">
          {/* Lightning Badge */}
          <div className="flex justify-center mb-6 animate-pulse">
            <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 px-4 py-1.5 text-sm font-medium hover:bg-[#10B981]/20 transition-colors">
              Powered by Bitcoin Lightning
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
            Pay Faster. Pay Smarter. Pay with Bitstra
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed text-lg">
            With Bitstra, your Bitcoin isn't just an investment. Use it for the
            things that matter every day—airtime, internet, and electricity—paid
            instantly over the Lightning Network.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-10 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Airtime Card */}
            <Link to="/airtime" className="group">
              <div className="relative bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#10B981]/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Top Row: BTC Icon (left) and Open Button (right) */}
                  <div className="flex justify-between items-start mb-6">
                    <img
                      src="/btc-in-hand.svg"
                      alt="Bitcoin"
                      className="w-[40px] h-[40px]"
                    />
                    <button className="flex items-center justify-center px-6 py-3 gap-1.5 w-[90px] h-[43px] border border-[#10B981] rounded-[11px] text-[#10B981] font-semibold text-base hover:bg-[#10B981]/5 transition-colors">
                      Open
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-start mb-6">
                    <img
                      src="/airtimelogo.svg"
                      alt="Airtime"
                      className="w-7 h-7"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Airtime
                  </h3>
                  <p className="text-gray-600 mb-4">
                    MTN. Airtel. Glo. 9mobile
                  </p>
                  <p className="text-sm text-gray-500">
                    You can buy your airtime bundles here.
                  </p>
                </div>
              </div>
            </Link>

            {/* Data Card */}
            <Link to="/data" className="group">
              <div className="relative bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#10B981]/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Top Row: BTC Icon (left) and Open Button (right) */}
                  <div className="flex justify-between items-start mb-6">
                    <img
                      src="/btc-in-hand.svg"
                      alt="Bitcoin"
                      className="w-[40px] h-[40px]"
                    />
                    <button className="flex items-center justify-center px-6 py-3 gap-1.5 w-[90px] h-[43px] border border-[#10B981] rounded-[11px] text-[#10B981] font-semibold text-base hover:bg-[#10B981]/5 transition-colors">
                      Open
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-start mb-6">
                    <img src="/datalogo.svg" alt="Data" className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Data
                  </h3>
                  <p className="text-gray-600 mb-4">
                    MTN. Airtel. Glo. 9mobile
                  </p>
                  <p className="text-sm text-gray-500">
                    You can buy your data bundles here.
                  </p>
                </div>
              </div>
            </Link>

            {/* Utility Bills Card */}
            <Link to="/utility-bills" className="group">
              <div className="relative bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#10B981]/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Top Row: BTC Icon (left) and Open Button (right) */}
                  <div className="flex justify-between items-start mb-6">
                    <img
                      src="/btc-in-hand.svg"
                      alt="Bitcoin"
                      className="w-[40px] h-[40px]"
                    />
                    <button className="flex items-center justify-center px-6 py-3 gap-1.5 w-[90px] h-[43px] border border-[#10B981] rounded-[11px] text-[#10B981] font-semibold text-base hover:bg-[#10B981]/5 transition-colors">
                      Open
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-start mb-6">
                    <img
                      src="/utilitylogo.svg"
                      alt="Utility Bills"
                      className="w-7 h-7"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Utility Bills
                  </h3>
                  <p className="text-gray-600 mb-4">Ikedc. dstv. and more...</p>
                  <p className="text-sm text-gray-500">
                    Pay for electricity, water, and internet bills.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative mt-20 py-8 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Links */}
              <div className="flex items-center gap-8">
                <a
                  href="https://x.com/bitstraorg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#10B981] transition-colors"
                  aria-label="Follow us on X (Twitter)"
                >
                  <i className="fa-brands fa-x-twitter text-xl"></i>
                </a>

                <a
                  href="mailto:dinahbtcdev@gmail.com"
                  className="text-gray-700 hover:text-[#10B981] transition-colors"
                  aria-label="Send us an email"
                >
                  <i className="fa-solid fa-inbox text-xl"></i>
                </a>
              </div>

              {/* Copyright */}
              <div className="text-sm text-gray-600">
                © {new Date().getFullYear()} Bitstra. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
