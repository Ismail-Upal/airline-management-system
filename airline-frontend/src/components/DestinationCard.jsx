import { useNavigate } from "react-router-dom";

function DestinationCard({ city, code, img, href }) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative h-[320px] overflow-hidden rounded-2xl cursor-pointer"
      onClick={() => navigate(href)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${img})` }}
      />

      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition duration-300" />

      <div className="relative z-10 flex h-full flex-col items-start justify-between px-7 py-6 text-white lg:p-4">
        <div>
          <h3 className="text-2xl font-bold">{city}</h3>
          <p className="text-sm opacity-90">
            {city} ({code})
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(href);
          }}
          className="translate-y-6 opacity-0 pointer-events-none rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default DestinationCard;
