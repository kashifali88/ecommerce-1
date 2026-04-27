import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Slider() {
  const slides = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    "https://images.unsplash.com/photo-1519741497674-611481863552",

  ];

  const [currentSlider, setCurrentSlider] = useState(0);

  // AUTO SLIDE
 useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlider((prev) => (prev + 1) % slides.length);
    },3000)
    return () => clearInterval(interval);
 }, [slides.length]);

  // MANUAL NAVIGATION
  const prevSlide = () => {
    setCurrentSlider(currentSlider === 0 ? slides.length - 1 : currentSlider - 1);
  };

  const nextSlide = () => {
    setCurrentSlider((currentSlider + 1) % slides.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-6 overflow-hidden rounded-xl">

      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlider * 100}%)` }}
      >
        {slides.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="slide"
            className="w-full h-[250px] md:h-[400px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black"
      >
        <FaChevronLeft />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black"
      >
        <FaChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentSlider === index ? "bg-yellow-400" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}