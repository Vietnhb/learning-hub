export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Giới Thiệu
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-10 border dark:border-gray-700">
          {/* Support & Donation Section - Moved to Top */}
          <div className="pb-8 border-b dark:border-gray-700">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 md:p-10 border border-blue-100 dark:border-blue-900/30">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-blue-900 dark:text-blue-400 mb-4">
                    Hỗ Trợ Duy Trì Server
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Để Learning Hub luôn hoạt động mượt mà và miễn phí cho mọi người, tôi cần một khoản chi phí nhỏ để duy trì server và hạ tầng mỗi tháng. 
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Mọi sự ủng hộ của bạn, dù ít hay nhiều, đều là nguồn động lực cực lớn giúp tôi tiếp tục hoàn thiện và cập nhật thêm nhiều học liệu hữu ích. Trân trọng cảm ơn bạn! ❤️
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <img 
                      src="/QR.jpg" 
                      alt="QR Chuyển tiền" 
                      className="w-40 h-40 md:w-48 md:h-48 object-contain rounded"
                    />
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium uppercase tracking-widest">
                      Quét mã ủng hộ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Về Learning Hub
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Learning Hub là nền tảng quản lý tài nguyên học tập được thiết kế
              để giúp bạn tổ chức, lưu trữ và truy cập các tài liệu học tập một
              cách hiệu quả nhất.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Sứ Mệnh
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Chúng tôi tin rằng việc học tập sẽ trở nên hiệu quả hơn khi tài
              liệu được tổ chức khoa học và dễ dàng tiếp cận. Sứ mệnh của chúng
              tôi là cung cấp một không gian học tập tối ưu cho mọi người.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Tính Năng Nổi Bật
            </h2>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
              <li>Quản lý tài liệu đa dạng: PDF, Video, Code, Notes</li>
              <li>Phân loại theo chủ đề và môn học</li>
              <li>Tìm kiếm nhanh chóng và chính xác</li>
              <li>Đánh dấu tài liệu yêu thích</li>
              <li>Theo dõi tiến độ học tập</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
