export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Giới Thiệu</h1>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Về Learning Hub
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Learning Hub là nền tảng quản lý tài nguyên học tập được thiết kế
              để giúp bạn tổ chức, lưu trữ và truy cập các tài liệu học tập một
              cách hiệu quả nhất.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Sứ Mệnh</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Chúng tôi tin rằng việc học tập sẽ trở nên hiệu quả hơn khi tài
              liệu được tổ chức khoa học và dễ dàng tiếp cận. Sứ mệnh của chúng
              tôi là cung cấp một không gian học tập tối ưu cho mọi người.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Tính Năng Nổi Bật
            </h2>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
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
