import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  RefreshCw,
  Calendar,
  CalendarCog,
  CalendarClock,
} from "lucide-react";
import { motion } from "motion/react";

const Features = () => {
  const features = [
    {
      title: "Smart Auto-Generation",
      description:
        "Generate optimized timetables instantly. AI-powered scheduling that considers all constraints and preferences.",
      icon: "🤖",
    },
    {
      title: "Conflict Resolution",
      description:
        "Automatically detect and resolve scheduling conflicts. No more overlapping classes or double-booked rooms.",
      icon: "⚡",
    },
    {
      title: "Real-Time Updates",
      description:
        "Make changes on the fly. Instant updates across all devices. Teachers and students stay synced automatically.",
      icon: "🔄",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Everything you need
        </h2>
        <p className="text-gray-500 text-lg">The essentials. Nothing more.</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-gray-50 rounded-2xl p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inner Visual Box */}
      <div className="bg-white rounded-xl p-8 mb-6 h-48 flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">
        {/* Smart Auto-Generation */}
        {index === 0 && (
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conflict Resolution */}
        {index === 1 && (
          <div className="flex flex-col gap-4 w-full items-center relative">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-20 h-20 rounded-full border-2 border-yellow-300"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Updates */}
        {index === 2 && (
          <div className="flex flex-col gap-5 w-full items-center">
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                <CalendarCog className="w-6 h-6 text-white" strokeWidth={2} />
              </div>

              {/* Connection Line with Animated Dots */}
              <div className="relative flex items-center">
                <div className="w-8 h-0.5 bg-yellow-200"></div>
                <motion.div
                  className="absolute left-0 w-1.5 h-1.5 rounded-full bg-yellow-400"
                  animate={{
                    x: [0, 32],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                <CalendarClock className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <RefreshCw className="w-5 h-5 text-yellow-500" strokeWidth={2} />
            </motion.div>
          </div>
        )}
      </div>

      {/* Text Content Below - Inside outer div */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export default Features;
