"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export const FadeDotComponent = () => {
  const DOT_SIZE = 2; // px
  const GAP_SIZE = 16; // px

  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const cols = Math.floor(width / (DOT_SIZE + GAP_SIZE));
      const rows = Math.floor(height / (DOT_SIZE + GAP_SIZE));
      setGridSize({ cols, rows });
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const dots = useMemo(() => {
    const { cols, rows } = gridSize;
    const centerX = (cols - 1) / 2;
    const centerY = (rows - 1) / 2;
    const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);

    return Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const dist = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);
      const opacity = Math.max(0.1, 1 - (dist / maxDist) ** 2);
      const delay = Math.random() * 2;
      return { opacity, delay };
    });
  }, [gridSize]);

  return (
    <div
      className="absolute   inset-0 grid bg-black"
      style={{
        gridTemplateColumns: `repeat(${gridSize.cols}, ${DOT_SIZE}px)`,
        gap: `${GAP_SIZE}px`,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-white/60"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: dot.opacity,
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror",
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

//"use client";
// //usage eg:
// import React from "react";
// import {  FadeDotComponent } from "./component/bg";

// export default function HomePage() {
//   return (
//     <div className="h-screen relative overflow-hidden">
//       {/* Background Animation */}
//       <FadeDotComponent/>

//       {/* Foreground Content */}
//       <div className="absolute inset-0 z-10 flex items-center justify-center">
//         {/* Your components go here */}
//         <div className="text-center">
//           <p className="text-4xl font-bold text-white">Your Components Go Here</p>
//           <p className="text-lg text-gray-300 mt-2">
//             Replace this with any UI elements, cards, forms, etc.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
