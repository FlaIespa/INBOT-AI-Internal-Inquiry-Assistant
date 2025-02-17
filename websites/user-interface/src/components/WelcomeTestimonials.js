import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Lewis Kyron',
    title: 'Software Engineer at Service Now',
    content:
      'INBOT is the best way to organize my knowledge. I can use it to create a personal folders and manage my own files. I can query the bot on my own personal files. It’s the perfect tool for my personal knowledge management and',
  },
  {
    name: 'Danny Geitz',
    title: 'CS Student at Berkeley',
    content:
      'INBOT is like a hardcore drug, except when you get hopelessly addicted to it your life is more organized and you\'re probably smarter.',
  },
  {
    name: 'Savannah Feder',
    title: 'Student at UNC',
    content:
      'INBOT has quickly become one of my favorite products of all time. I used to forget nearly all the information captured into my knowledge base — but now I find I have this superpower to remember anything I find important. Super satisfying to go through flashcards too :) For any students out there, I scored top marks with half as much prep the term I switched to INBOT. Works like magic!',
  },
];

const WelcomeTestimonials = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-gray-900 dark:text-white">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-center mb-12"
      >
        Hear from Our{' '}
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Satisfied Users
        </span>
      </motion.h2>

      {/* Testimonials Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg p-6 
            transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            {/* User Info */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white 
              flex items-center justify-center text-lg font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
              </div>
            </div>

            {/* Testimonial Content */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {testimonial.content}
            </p>

            {/* Decorative Hover Line */}
            <div
              className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 
              transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeTestimonials;