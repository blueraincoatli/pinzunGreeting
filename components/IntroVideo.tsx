
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroVideoProps {
  onVideoEnd: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onVideoEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = "https://res.cloudinary.com/dgrnpxw1r/video/upload/v1767175355/pinzun_u4cf5t.mp4";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.warn("Autoplay blocked, waiting for interaction", e);
      });
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        y: -100,
        transition: { duration: 1, ease: "easeIn" } 
      }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top Decoration */}
      <div className="w-full flex-1 bg-black flex items-end justify-center pb-8 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[#d4af37] text-base tracking-[0.6em] chinese-font z-10"
        >
          品尊国际 · 贺新春
        </motion.div>
      </div>

      {/* Main Video Section */}
      <div className="relative w-full aspect-[4/3] bg-black shadow-[0_0_100px_rgba(0,0,0,1)] z-20">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          onEnded={onVideoEnd}
          playsInline
          muted
          autoPlay
        />
        {/* Subtle inner glow and vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"></div>
        
        {/* Simplified corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#d4af37]/30 m-2"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#d4af37]/30 m-2"></div>
      </div>

      {/* Bottom Decoration */}
      <div className="w-full flex-1 bg-black flex flex-col items-center justify-start pt-12 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="z-10 flex flex-col items-center space-y-8">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60"></div>
          
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[#d4af37] text-4xl font-light tracking-[0.3em] mb-2"
            >
              2026
            </motion.div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onVideoEnd}
            className="px-12 py-3 border border-[#d4af37]/20 text-[#d4af37]/60 text-[10px] rounded-full tracking-[0.5em] uppercase hover:bg-[#d4af37]/5 transition-all"
          >
            跳过 SKIP
          </motion.button>
        </div>
      </div>
      
      {/* Cinematic light sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-full animate-[pulse_8s_infinite]"></div>
    </motion.div>
  );
};

export default IntroVideo;
