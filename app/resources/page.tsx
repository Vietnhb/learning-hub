"use client";

import { motion } from "framer-motion";
import { Search, Filter, Download, Eye, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFavorites } from "@/hooks/useResourceFavorites";
import { useRouter } from "next/navigation";
import { useResourceFavoriteCounts } from "@/hooks/useResourceFavoriteCounts";

export default function ResourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { favoriteSet, toggleFavorite } = useResourceFavorites(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const resources = [
    {
      id: 1,
      title: "JPD316 - Giáo trình Tiếng Nhật",
      category: "Ngoại ngữ",
      type: "Folder",
      size: "Đã Hoàn Thành",
      downloads: 0,
      rating: 5.0,
      description: "Giáo trình học tiếng Nhật toàn diện",
      link: "/resources/JPD316",
    },
    {
      id: 2,
      title: "JPD326 - Giáo trình Tiếng Nhật",
      category: "Ngoại ngữ",
      type: "Folder",
      size: "Đang cập nhật",
      downloads: 0,
      rating: 5.0,
      description: "Giáo trình Tiếng Nhật Trung Cấp (N4-N3)",
      link: "/resources/JPD326",
    },
    {
      id: 3,
      title: "FPT Software Training - Tiếng Nhật",
      category: "Ngoại ngữ",
      type: "Folder",
      size: "Đang cập nhật",
      downloads: 0,
      rating: 5.0,
      description: "Giáo trình Tiếng Nhật của FPT Software",
      link: "/resources/FsoftTraining",
    },
    {
      id: 4,
      title: "SWD392 - Kiến trúc hệ thống",
      category: "Kỹ thuật phần mềm",
      type: "Quiz",
      size: "Đã Hoàn Thành",
      downloads: 0,
      rating: 5.0,
      description:
        "Luyện tập kiến thức Software Architecture, UML, design strategy, PIM/PSM",
      link: "/resources/SWD392",
    },
  ];

  const resourceIds = useMemo(
    () => resources.map((resource) => String(resource.id)),
    [resources],
  );
  const { counts: favoriteCounts } = useResourceFavoriteCounts(resourceIds);

  // Get unique categories and types
  const categories = useMemo(() => {
    const cats = Array.from(new Set(resources.map(r => r.category)));
    return ["all", ...cats];
  }, []);

  const types = useMemo(() => {
    const typeList = Array.from(new Set(resources.map(r => r.type)));
    return ["all", ...typeList];
  }, []);

  // Filter resources based on search and filters
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
      const matchesType = selectedType === "all" || resource.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedType !== "all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tài Nguyên Học Tập
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Giáo trình Tiếng Nhật và SWD392 (Kiến trúc hệ thống)
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border dark:border-gray-700"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Xóa từ khóa tìm kiếm"
                      title="Xóa từ khóa tìm kiếm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lọc:</span>
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {cat === "all" ? "Tất cả" : cat}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

              {/* Type Filter */}
              <div className="flex gap-2">
                {types.map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedType === type
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type === "all" ? "Tất cả" : type}
                  </button>
                ))}
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{filteredResources.length}</span> / {resources.length} tài liệu
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Không tìm thấy tài liệu nào</p>
              <p className="text-sm mt-2">Thử thay đổi từ khóa hoặc bộ lọc</p>
            </div>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Xóa tất cả bộ lọc
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          {resource.category}
                        </span>
                        <span className="text-gray-500">• {resource.type}</span>
                        <span className="text-gray-500">• {resource.size}</span>
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={
                        favoriteSet.has(String(resource.id))
                          ? "Bỏ yêu thích"
                          : "Đánh dấu yêu thích"
                      }
                      title={
                        favoriteSet.has(String(resource.id))
                          ? "Bỏ yêu thích"
                          : "Đánh dấu yêu thích"
                      }
                      onClick={async () => {
                        if (!user) {
                          router.push("/auth/login?redirect=/resources");
                          return;
                        }

                        const { success, error } = await toggleFavorite(
                          String(resource.id),
                        );
                        if (!success) {
                          alert(error || "Không thể cập nhật yêu thích");
                        }
                      }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          favoriteSet.has(String(resource.id))
                            ? "fill-yellow-400 text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {favoriteCounts[String(resource.id)] || 0}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={resource.link}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Xem
                        </Button>
                      </Link>
                      <Button size="sm" className="gap-2" asChild>
                        <a
                          href="https://drive.google.com/drive/folders/10djG7_z2QVRr6_wx_yVBrFhZcCPaDD-O?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                          Tải về
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
