import { Heart, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071b49] dark:bg-[#050b18] text-white py-8 mt-auto border-t border-blue-900/40 dark:border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Vietnhb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub của tác giả"
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/hoang-bao-viet-nguyen/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn của tác giả"
              className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
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
