import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Pay Bills with Bitcoin Lightning
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Use Bitcoin Lightning to pay for airtime, data, and utility bills in Nigeria. 
          Fast, secure, and convenient payments with cashback rewards.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link to="/airtime" className="group">
            <div className="bg-surface rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Airtime</h3>
              <p className="text-muted-foreground">Top up your mobile phone with instant airtime</p>
            </div>
          </Link>
          
          <Link to="/data" className="group">
            <div className="bg-surface rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <div className="text-3xl mb-4">📶</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Data</h3>
              <p className="text-muted-foreground">Purchase data bundles for all networks</p>
            </div>
          </Link>
          
          <Link to="/utility-bills" className="group">
            <div className="bg-surface rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Utility Bills</h3>
              <p className="text-muted-foreground">Pay electricity, water, and cable bills</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-12">
          <Button variant="success" size="lg" className="mr-4">
            Connect Wallet
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;