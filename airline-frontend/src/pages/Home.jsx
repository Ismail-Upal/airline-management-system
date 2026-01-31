import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, Globe, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[90vh] flex items-center justify-center text-center">
        {/* Animated Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-slowZoom"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&w=1920&q=80')"}}
        ></div>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white"></div>
        
        <div className="relative z-10 text-white px-4 max-w-4xl animate-fadeInUp">
          <div className="flex justify-center mb-6">
             <span className="bg-blue-600/30 backdrop-blur-md border border-blue-400/50 text-blue-100 text-sm py-1 px-4 rounded-full uppercase tracking-widest animate-pulse">
                The Sky is Calling
             </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Journey</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 font-light text-gray-200 leading-relaxed">
            Experience world-class service and luxury travel to over <br className="hidden md:block" /> 150 destinations worldwide.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/flights" className="group relative bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-5 rounded-xl font-bold transition-all hover:scale-105 shadow-2xl shadow-blue-500/20 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Book Your Flight <Plane className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <button className="text-white font-semibold hover:text-blue-300 transition px-8 py-5">
              Explore Destinations
            </button>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION (Floating Cards) --- */}
      <div className="relative z-20 -mt-20 container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-blue-600" size={32}/>, title: "Safety First", desc: "Highest industry standards for your peace of mind." },
            { icon: <Globe className="text-blue-600" size={32}/>, title: "Global Reach", desc: "Connecting you to every corner of the globe." },
            { icon: <Clock className="text-blue-600" size={32}/>, title: "On-Time Guarantee", desc: "We value your time as much as you do." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
