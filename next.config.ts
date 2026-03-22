import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт (для Netlify)
  output: 'export',
  
  // Отключаем оптимизацию изображений (для статического экспорта)
  images: {
    unoptimized: true,
  },
  
  // Добавляем trailing slash для корректной работы
  trailingSlash: true,
  
  // Отключаем серверные компоненты (если есть проблемы)
  // experimental: {
  //   appDir: true,
  // },
};

export default nextConfig;