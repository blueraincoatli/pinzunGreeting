
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from './types';
import IntroVideo from './components/IntroVideo';
import FireworksCanvas, { FireworksCanvasRef } from './components/FireworksCanvas';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [fireworkCount, setFireworkCount] = useState(0);
  const [showFinale, setShowFinale] = useState(false);
  const canvasRef = useRef<FireworksCanvasRef>(null);
  const swipeStartY = useRef<number | null>(null);

  const startExperience = useCallback(() => {
    setAppState(AppState.INTERACTIVE);
  }, []);

  // Transition to finale after several fireworks
  useEffect(() => {
    if (fireworkCount >= 6 && !showFinale) {
      setTimeout(() => setShowFinale(true), 1200);
    }
  }, [fireworkCount, showFinale]);

  const handleReset = useCallback(() => {
    setAppState(AppState.INTRO);
    setFireworkCount(0);
    setShowFinale(false);
  }, []);

  const handleSwipe = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (appState !== AppState.INTERACTIVE && appState !== AppState.FINALE) return;

    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (e.type === 'touchstart' || e.type === 'mousedown') {
      swipeStartY.current = y;
    } else if (e.type === 'touchend' || e.type === 'mouseup') {
      if (swipeStartY.current !== null && swipeStartY.current - y > 50) {
        // Successful swipe up
        canvasRef.current?.launch(x);
        
        // Occasionally launch a double firework
        if (Math.random() > 0.6) {
          setTimeout(() => canvasRef.current?.launch(x + (Math.random() * 80 - 40)), 250);
        }
        setFireworkCount(prev => prev + 1);
      }
      swipeStartY.current = null;
    }
  }, [appState]);

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onTouchStart={handleSwipe}
      onTouchEnd={handleSwipe}
      onMouseDown={handleSwipe}
      onMouseUp={handleSwipe}
    >
      <AnimatePresence mode="wait">
        {appState === AppState.INTRO && (
          <IntroVideo key="intro" onVideoEnd={startExperience} />
        )}
      </AnimatePresence>

      <FireworksCanvas ref={canvasRef} />

      {/* UI Overlay */}
      <AnimatePresence>
        {(appState === AppState.INTERACTIVE || appState === AppState.FINALE) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
          >
            {/* Guide */}
            {!showFinale && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: [0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute bottom-24 flex flex-col items-center"
              >
                <div className="w-12 h-12 border-2 border-[#d4af37]/30 rounded-full flex items-center justify-center mb-3">
                   <div className="w-1.5 h-4 bg-[#d4af37]/60 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[#d4af37]/60 text-[11px] tracking-[0.4em] font-medium chinese-font">上滑点亮星空</span>
              </motion.div>
            )}

            {/* Finale Elements */}
            <AnimatePresence>
              {showFinale && (
                <div className="flex flex-col items-center justify-center text-center space-y-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="space-y-6"
                  >
                    <div className="text-[#d4af37] text-6xl font-bold tracking-[0.4em] chinese-font drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
                      新年快乐
                    </div>
                    <div className="text-white text-8xl font-black tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                      2026
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="text-[#d4af37]/80 text-2xl font-medium tracking-[0.6em] chinese-font">
                       品尊国际
                    </div>
                    <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="pointer-events-auto px-14 py-4 bg-transparent border-2 border-[#d4af37]/50 text-[#d4af37] font-bold text-sm rounded-full tracking-[0.5em] backdrop-blur-sm active:scale-95 transition-all hover:bg-[#d4af37]/20"
                  >
                    再看一遍
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
