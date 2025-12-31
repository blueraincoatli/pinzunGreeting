
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from './types';
import IntroVideo from './components/IntroVideo';
import FireworksCanvas, { FireworksCanvasRef } from './components/FireworksCanvas';

const SOUNDS = {
  // User provided high-quality BGM uploaded to Cloudinary
  BGM: 'https://res.cloudinary.com/dgrnpxw1r/video/upload/v1767190863/greeting_frpuny.mp3',
  // User provided 31s high-quality firework explosion soundscape
  EXPLODE: 'https://res.cloudinary.com/dgrnpxw1r/video/upload/v1767188787/yanhua_01_hns9ig.mp3'
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [fireworkCount, setFireworkCount] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<FireworksCanvasRef>(null);
  const swipeStartY = useRef<number | null>(null);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Initialize BGM and preload
  useEffect(() => {
    bgmRef.current = new Audio(SOUNDS.BGM);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.5;
    bgmRef.current.preload = 'auto';
    bgmRef.current.crossOrigin = "anonymous";

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleActivate = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.play().catch(e => {
        console.warn("Autoplay interaction requirement: ", e);
      });
    }
    setAppState(AppState.INTRO);
  }, []);

  const playExplosionSFX = useCallback(() => {
    if (isMuted) return;
    const sfx = new Audio(SOUNDS.EXPLODE);
    sfx.volume = 0.8;
    sfx.play().catch(() => {});
    
    // Auto-terminate the individual SFX instance to keep memory clean
    setTimeout(() => {
      sfx.pause();
      sfx.remove();
    }, 4000);
  }, [isMuted]);

  const startInteraction = useCallback(() => {
    setAppState(AppState.INTERACTIVE);
    // Double check BGM is playing after intro video finishes
    if (bgmRef.current && bgmRef.current.paused && !isMuted) {
      bgmRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    if (fireworkCount >= 6 && !showFinale) {
      setTimeout(() => setShowFinale(true), 1200);
    }
  }, [fireworkCount, showFinale]);

  const handleReset = useCallback(() => {
    setAppState(AppState.LANDING);
    setFireworkCount(0);
    setShowFinale(false);
    if (bgmRef.current) {
      bgmRef.current.currentTime = 0;
      bgmRef.current.pause();
    }
  }, []);

  const handleSwipe = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Ensure BGM plays on user interaction if blocked initially by browser policy
    if (bgmRef.current && bgmRef.current.paused && !isMuted && appState !== AppState.LANDING) {
        bgmRef.current.play().catch(() => {});
    }

    if (appState !== AppState.INTERACTIVE && appState !== AppState.FINALE) return;

    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (e.type === 'touchstart' || e.type === 'mousedown') {
      swipeStartY.current = y;
    } else if (e.type === 'touchend' || e.type === 'mouseup') {
      if (swipeStartY.current !== null && swipeStartY.current - y > 50) {
        canvasRef.current?.launch(x);
        // Add a small probability for a secondary firework for more density
        if (Math.random() > 0.5) {
          setTimeout(() => canvasRef.current?.launch(x + (Math.random() * 100 - 50)), 200);
        }
        setFireworkCount(prev => prev + 1);
      }
      swipeStartY.current = null;
    }
  }, [appState, isMuted]);

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onTouchStart={handleSwipe}
      onTouchEnd={handleSwipe}
      onMouseDown={handleSwipe}
      onMouseUp={handleSwipe}
    >
      <AnimatePresence mode="wait">
        {appState === AppState.LANDING && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="z-10 flex flex-col items-center"
            >
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="text-[#d4af37] text-3xl tracking-[0.8em] chinese-font mb-6"
              >
                品尊国际
              </motion.div>
              
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mb-16"></div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleActivate}
                className="group relative flex flex-col items-center justify-center"
              >
                <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                
                <div className="w-24 h-24 rounded-full border border-[#d4af37]/40 flex items-center justify-center mb-8 group-hover:border-[#d4af37]/80 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <div className="w-20 h-20 rounded-full bg-[#d4af37]/5 flex items-center justify-center relative overflow-hidden">
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="absolute inset-0 bg-[#d4af37]/10"
                     />
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 translate-x-1">
                        <path d="M5 3L19 12L5 21V3Z" fill="#d4af37" className="drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                     </svg>
                  </div>
                </div>
                
                <div className="space-y-2">
                    <span className="text-[#d4af37] text-xl tracking-[0.6em] chinese-font font-light block">开启新篇章</span>
                    <span className="text-white/30 text-[9px] tracking-[0.4em] uppercase font-sans">Enter 2026 Journey</span>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {appState === AppState.INTRO && (
          <IntroVideo key="intro" onVideoEnd={startInteraction} />
        )}
      </AnimatePresence>

      <FireworksCanvas 
        ref={canvasRef} 
        onExplodeSound={playExplosionSFX}
      />

      {(appState === AppState.INTERACTIVE || appState === AppState.FINALE) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 right-8 z-[60] pointer-events-auto"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 bg-black/30 backdrop-blur-xl transition-all hover:bg-black/50 hover:text-white/80"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            ) : (
              <svg className="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {(appState === AppState.INTERACTIVE || appState === AppState.FINALE) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
          >
            {!showFinale && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-24 flex flex-col items-center"
              >
                <div className="w-12 h-12 border border-[#d4af37]/20 rounded-full flex items-center justify-center mb-4">
                   <motion.div 
                     animate={{ y: [0, 8, 0] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="w-1 h-3 bg-gradient-to-b from-[#d4af37] to-transparent rounded-full"
                   />
                </div>
                <span className="text-[#d4af37]/70 text-[11px] tracking-[0.5em] font-medium chinese-font">上滑绽放璀璨</span>
              </motion.div>
            )}

            <AnimatePresence>
              {showFinale && (
                <div className="flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="space-y-4"
                  >
                    <div className="text-[#d4af37] text-xl font-bold tracking-[0.6em] chinese-font drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                      新年快乐
                    </div>
                    <div className="text-white text-3xl font-black tracking-[0.2em] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                      2026
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="text-[#d4af37]/50 text-sm font-medium tracking-[0.8em] chinese-font">
                       品尊国际
                    </div>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="pointer-events-auto px-10 py-2.5 bg-black/10 border border-[#d4af37]/10 text-[#d4af37]/60 text-[9px] font-bold rounded-full tracking-[0.4em] backdrop-blur-sm active:scale-95 transition-all hover:bg-[#d4af37]/5"
                  >
                    重温美好 REPLAY
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
