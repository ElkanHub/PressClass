import { useState, useEffect } from "react";

// Mock Dashboard Component for Hero
const MockDashboard = ({
  images = ["/dashboard1.png", "/dashboard2.png", "/dashboard3.png"],
  interval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]); // images.length removed — use images directly

  return (
    <div className="relative bg-card rounded-t-xl md:rounded-t-2xl shadow-2xl overflow-hidden border border-border">
      {/* Browser Bar */}
      <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="ml-4 bg-background/50 border border-border/50 rounded-md px-3 py-1 w-64 h-6 hidden sm:block" />
      </div>

      {/* Image Slider */}
      <div className="relative w-full aspect-[16/7.5] bg-muted/20 overflow-hidden group">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img}
              alt={`Dashboard View ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Fallback Background */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 -z-10">
          <span className="text-muted-foreground text-sm">
            Loading dashboard...
          </span>
        </div>
      </div>
    </div>
  );
};

export default MockDashboard;
