"use client";

import { motion } from "framer-motion";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-auto border-t border-gray-700 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-6"
          >
            <motion.a
              href="https://github.com/Vietnhb"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, rotate: -5 }}
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
            >
              <Twitter className="w-5 h-5"></Twitter>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/hoang-bao-viet-nguyen/"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          </motion.div>
          <p className="text-gray-400 dark:text-gray-500 flex items-center gap-2">
            © {new Date().getFullYear()} MyApp. Made with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />{" "}
            by Nguyễn Hoàng Bảo Việt
          </p>
        </div>
      </div>
    </footer>
  );
}
