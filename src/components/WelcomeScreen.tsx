import React, { useState, useEffect } from "react";
import { Quote, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";

interface InspirationalQuote {
  text: string;
  author: string;
  category: string;
}

interface WelcomeScreenProps {
  isVisible: boolean;
  onComplete: () => void;
  userName?: string;
  darkMode?: boolean;
  enableSounds?: boolean;
  skipIntro?: boolean;
}

const inspirationalQuotes: InspirationalQuote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Innovation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Persistence" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "Hope" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "Excellence" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Beginning" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown", category: "Mindset" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "Motivation" }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isVisible,
  onComplete,
  userName = "User",
  darkMode = false,
  enableSounds = true,
  skipIntro = false
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [geometricShapes, setGeometricShapes] = useState<Array<{id: number, x: number, y: number, size: number, type: string, delay: number}>>([]);
  const [constellationStars, setConstellationStars] = useState<Array<{id: number, x: number, y: number, brightness: number, delay: number}>>([]);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const controls = useAnimation();
  const currentQuote = inspirationalQuotes[currentQuoteIndex];

  // Generate refined particles and shapes
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6
    }));
    setParticles(newParticles);

    const newGeometricShapes = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 30,
      type: 'circle',
      delay: Math.random() * 4
    }));
    setGeometricShapes(newGeometricShapes);

    const newConstellationStars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      brightness: Math.random() * 0.6 + 0.4,
      delay: Math.random() * 3
    }));
    setConstellationStars(newConstellationStars);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: skipIntro ? 0.5 : 1.2,
        staggerChildren: 0.15,
        delayChildren: skipIntro ? 0 : 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: skipIntro ? 0.1 : 0.5
      }
    }
  };

  const sparkleVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    if (!isVisible) return;

    const showTimer = setTimeout(() => {
      controls.start("visible");
      setShowSparkles(true);
    }, 100);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (skipIntro ? 5 : 0.5);
      });
    }, skipIntro ? 250 : 100);

    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
    }, skipIntro ? 1500 : 3500);

    const hideTimer = setTimeout(() => {
      controls.start("exit");
      setTimeout(() => onComplete(), 800);
    }, skipIntro ? 5000 : 20000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(progressInterval);
      clearInterval(quoteInterval);
    };
  }, [isVisible, onComplete, controls, skipIntro]);

  if (!isVisible) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      exit="exit"
      variants={containerVariants}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-black"
          : "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800"
      }`}
    >
      {/* Elegant Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Refined gradient orbs with harmonious movement */}
        <motion.div
          animate={{
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-purple-600/40 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [200, -200, 200],
            y: [150, -150, 150],
            scale: [0.9, 1.4, 0.9],
            opacity: [0.12, 0.35, 0.12],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 2
          }}
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-gradient-to-tr from-cyan-400/25 to-blue-600/35 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [-150, 150, -150],
            y: [100, -100, 100],
            scale: [0.7, 1.1, 0.7],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 4
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-500/30 rounded-full blur-2xl"
        />

        {/* Sophisticated floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 8 + particle.id * 0.2,
              repeat: Infinity,
              delay: particle.delay,
              ease: [0.4, 0.0, 0.2, 1]
            }}
          />
        ))}

        {/* Subtle geometric elements */}
        {geometricShapes.slice(0, 3).map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute pointer-events-none"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size * 0.6}px`,
              height: `${shape.size * 0.6}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 20 + shape.id * 3,
              repeat: Infinity,
              delay: shape.delay,
              ease: "linear"
            }}
          >
            <div
              className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-violet-400/20 border border-white/5 backdrop-blur-sm"
            />
          </motion.div>
        ))}

        {/* Elegant wave system */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
              'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
              'linear-gradient(225deg, transparent 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)',
              'linear-gradient(315deg, transparent 0%, rgba(79, 70, 229, 0.1) 50%, transparent 100%)',
              'linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1]
          }}
        />

        {/* Breathing light effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 30%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Subtle constellation */}
        {constellationStars.slice(0, 12).map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              boxShadow: '0 0 2px rgba(255,255,255,0.5)'
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + star.id * 0.3,
              repeat: Infinity,
              delay: star.delay,
              ease: [0.4, 0.0, 0.2, 1]
            }}
          />
        ))}

        {/* Flowing aurora */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'linear-gradient(0deg, transparent 0%, rgba(139, 92, 246, 0.2) 25%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.1) 75%, transparent 100%)',
              'linear-gradient(60deg, transparent 0%, rgba(59, 130, 246, 0.2) 25%, rgba(168, 85, 247, 0.15) 50%, rgba(139, 92, 246, 0.1) 75%, transparent 100%)',
              'linear-gradient(120deg, transparent 0%, rgba(168, 85, 247, 0.2) 25%, rgba(139, 92, 246, 0.15) 50%, rgba(59, 130, 246, 0.1) 75%, transparent 100%)',
              'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.2) 25%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.1) 75%, transparent 100%)',
              'linear-gradient(0deg, transparent 0%, rgba(139, 92, 246, 0.2) 25%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.1) 75%, transparent 100%)',
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1]
          }}
        />

        {/* Elegant mesh overlay */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(circle at 25% 75%, rgba(79, 70, 229, 0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1]
          }}
        />

        {/* Subtle depth gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-indigo-900/8" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/3 to-transparent" />
        
        {/* Elegant vignette */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0,0,0,0.1) 100%)'
          }} 
        />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
      >
        {/* Enhanced Logo with sparkles */}
        <motion.div variants={itemVariants} className="mb-8 relative">
          <div className="flex justify-center mb-6 relative">
            <motion.div 
              className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sparkle effects around logo */}
              {showSparkles && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      variants={sparkleVariants}
                      animate="visible"
                      className="absolute"
                      style={{
                        left: i === 0 ? '10%' : i === 1 ? '90%' : i === 2 ? '20%' : '80%',
                        top: i === 0 ? '20%' : i === 1 ? '30%' : i === 2 ? '80%' : '70%',
                      }}
                    >
                      <Sparkles className="w-2 h-2 text-yellow-300" />
                    </motion.div>
                  ))}
                </div>
              )}
              
              <motion.img
                src="https://www.whizlabs.com/blog/wp-content/uploads/2019/03/forum-logo.png"
                alt="Whizlabs"
                className="h-16 w-auto mx-auto relative z-10"
                variants={logoVariants}
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-3xl blur-xl opacity-50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Greeting with text effects */}
        <motion.div variants={itemVariants} className="mb-10">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200 mb-4"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: skipIntro ? 0.2 : 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            {getGreeting()}!
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-6"
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: skipIntro ? 0.3 : 1 }}
          >
            Welcome back,{" "}
            <motion.span 
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300"
              style={{
                backgroundSize: "200% 100%"
              }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {userName}
            </motion.span>
          </motion.p>
          
          {/* Enhanced star rating */}
          <motion.div 
            className="flex justify-center items-center mt-4 space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: skipIntro ? 0.4 : 1.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.1 * i,
                  type: "spring",
                  damping: 15,
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: 360,
                  transition: { duration: 0.3 }
                }}
                className="cursor-pointer"
              >
                <Star className="w-6 h-6 text-yellow-300 drop-shadow-lg fill-yellow-300" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Quote Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div 
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02, rotateY: 2 }}
            transition={{ duration: 0.3 }}
          >
            {/* Floating quote icon */}
            <motion.div 
              className="absolute top-6 left-6"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Quote className="w-8 h-8 text-yellow-300/70" />
            </motion.div>

            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5 rounded-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 30, rotateX: 45, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, rotateX: -45, filter: "blur(5px)" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10"
              >
                <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-light leading-relaxed mb-6 italic">
                  "{currentQuote.text}"
                </blockquote>

                <div className="flex items-center justify-center space-x-6">
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent flex-1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <div className="text-center">
                    <cite className="text-sm sm:text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 not-italic">
                      — {currentQuote.author}
                    </cite>
                    <motion.div 
                      className="text-xs text-white/80 mt-1 uppercase tracking-widest font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {currentQuote.category}
                    </motion.div>
                  </div>
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent flex-1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <motion.span 
              className={`text-base font-medium ${
                progress < 100 ? 'text-white/90' : 'text-green-300'
              }`}
              animate={progress === 100 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: progress === 100 ? 3 : 0 }}
            >
              {progress < 100 ? "Preparing your workspace..." : "Ready ✨"}
            </motion.span>
            <span className="text-sm text-white/80 font-mono tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div
              className={`h-full rounded-full relative overflow-hidden ${
                progress === 100 
                  ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600' 
                  : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            >
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatDelay: 1
                }}
                style={{ width: "30%" }}
              />
            </motion.div>
          </div>
          
          {progress === 100 && (
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 20 }}
            >
              <motion.span 
                className="text-green-300 font-bold text-lg"
                animate={{ 
                  textShadow: [
                    "0 0 0px rgba(34,197,94,0.5)",
                    "0 0 20px rgba(34,197,94,0.8)",
                    "0 0 0px rgba(34,197,94,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Ready to go! 🚀✨
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;