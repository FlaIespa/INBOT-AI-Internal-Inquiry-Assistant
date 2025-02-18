import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Briefcase } from 'lucide-react';

const WelcomeAboutUs = () => {
  const slides = [
    {
      icon: Briefcase,
      title: "Mission",
      gradient: "from-blue-500 to-purple-600",
      description:
        "At INBOT, our mission is to empower organizations by streamlining workflows, providing quick access to knowledge, and enhancing team collaboration through cutting-edge AI technology.",
    },
    {
      icon: Cpu,
      title: "Innovation",
      gradient: "from-purple-500 to-pink-600",
      description:
        "Our AI-driven platform integrates seamlessly into your company's tools, transforming your data into actionable insights and improving productivity across teams.",
    },
    {
      icon: ShieldCheck,
      title: "Data Security",
      gradient: "from-pink-500 to-red-500",
      description:
        "We prioritize your privacy with enterprise-grade encryption and compliance with GDPR standards, ensuring your sensitive information stays secure.",
    },
  ];

  // Define variants that use a custom value (slide index) to alternate the x offset
  const cardVariants = {
    hidden: (custom) => ({
      opacity: 0,
      x: custom % 2 === 0 ? -100 : 100,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-900 dark:text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-6">
          Why{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            INBOT
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Revolutionizing corporate workflows with AI-powered solutions for seamless knowledge management, collaboration, and data security.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="space-y-12">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon Section */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.8 }}
                className={`p-6 rounded-full bg-gradient-to-br ${slide.gradient} shadow-lg`}
              >
                {React.createElement(slide.icon, {
                  className: "w-12 h-12 text-white",
                })}
              </motion.div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">
                  Our{" "}
                  <span
                    className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}
                  >
                    {slide.title}
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {slide.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeAboutUs;
