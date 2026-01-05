import React from "react";

export const Hero = () => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-black">
      {/* 1. Blurred Background for vertical video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover opacity-40 blur-3xl scale-110"
      >
        <source src="/academy-hero.mp4" type="video/mp4" />
      </video>

      {/* 2. The Main Video */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <video autoPlay loop muted playsInline className="h-full w-auto max-w-none shadow-2xl">
          <source src="/academy-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 3. Dark Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      {/* 4. Text and Buttons */}
      <div className="relative z-30 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-2">
          THE ACADEMY <span className="text-red-600">HUB</span>
        </h1>
        <p className="text-white text-lg md:text-2xl font-light max-w-2xl mb-8 uppercase tracking-[0.2em]">
          Unity • Discipline • Excellence
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-md font-bold uppercase transition-all hover:scale-105 shadow-lg">
            Join the Squad
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-md font-bold uppercase transition-all">
            Our Programs
          </button>
        </div>
      </div>
    </div>
  );
};
