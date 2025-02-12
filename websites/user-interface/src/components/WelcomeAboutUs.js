import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

const WelcomeAboutUs = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: Briefcase,
      title: "Mission",
      gradient: "from-blue-500 to-purple-600",
      description: "At INBOT, our mission is to empower organizations by streamlining workflows, providing quick access to knowledge, and enhancing team collaboration through cutting-edge AI technology.",
    },
    {
      icon: Cpu,
      title: "Innovation",
      gradient: "from-purple-500 to-pink-600",
      description: "Our AI-driven platform integrates seamlessly into your company's tools, transforming your data into actionable insights and improving productivity across teams.",
    },
    {
      icon: ShieldCheck,
      title: "Data Security",
      gradient: "from-pink-500 to-red-500",
      description: "We prioritize your privacy with enterprise-grade encryption and compliance with GDPR standards, ensuring your sensitive information stays secure.",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-900 dark:text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-6">
          Why{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            INBOT
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Revolutionizing corporate workflows with AI-powered solutions for seamless knowledge management, collaboration, and data security.
        </p>
      </motion.div>

      {/* Main Display */}
      <div className="relative">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon Section */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.8 }}
              className={`p-6 rounded-full bg-gradient-to-br ${slides[activeSlide].gradient} shadow-lg`}
            >
              {React.createElement(slides[activeSlide].icon, {
                className: "w-12 h-12 text-white"
              })}
            </motion.div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">
                Our{' '}
                <span className={`bg-gradient-to-r ${slides[activeSlide].gradient} bg-clip-text text-transparent`}>
                  {slides[activeSlide].title}
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {slides[activeSlide].description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          {/* Dots */}
          <div className="flex gap-2 items-center">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full cursor-pointer ${
                  index === activeSlide 
                    ? 'w-6 bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setActiveSlide(index)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAboutUs;
