import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center" 
         style={{backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&w=1920&q=80')"}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 text-white px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Explore the World</h1>
        <p className="text-xl md:text-2xl mb-8 font-light">Safe, Reliable, and Luxury Flights at your fingertips.</p>
        <Link to="/flights" className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-4 rounded-full font-bold transition">
          Book Your Flight Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
