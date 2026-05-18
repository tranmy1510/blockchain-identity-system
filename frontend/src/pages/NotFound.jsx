import { Link } from "react-router-dom";
import VeriChainLogo from "../components/VeriChainLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
      <VeriChainLogo size={42} showSub={false} />

      <p className="text-[120px] font-medium text-gold-bg leading-none mt-8 select-none"
         style={{ WebkitTextStroke: "1px #3a2e00" }}>
        404
      </p>

      <h2 className="text-xl font-medium text-[#e8e0cc] mt-2">Page not found</h2>
      <p className="text-[#555] text-sm mt-2 mb-8">
        The blockchain page you're looking for doesn't exist.
      </p>

      <Link to="/" className="btn-gold py-2.5 px-6">Back to Home</Link>
    </div>
  );
}