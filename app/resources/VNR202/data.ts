import { photos, type ArchivePhoto } from "./photos";

export type NodeKind = "event" | "person" | "document" | "place";

export interface Period {
  id: string;
  label: string;
  range: string;
  color: string;
}

export interface HistoryNode {
  id: string;
  kind: NodeKind;
  title: string;
  date: string;
  period: string;
  summary: string;
  significance?: string;
  photos?: ArchivePhoto[];
}

export interface HistoryLink {
  from: string;
  to: string;
  label: string;
}

export const periods: Period[] = [
  { id: "p1", label: "Chuẩn bị thành lập Đảng", range: "1920 – 1930", color: "#b08d57" },
  { id: "p2", label: "Đấu tranh giành chính quyền", range: "1930 – 1945", color: "#b5443b" },
  { id: "p3", label: "Kháng chiến chống thực dân Pháp", range: "1945 – 1954", color: "#5f7f5a" },
  { id: "p4", label: "Kháng chiến chống Mỹ, thống nhất đất nước", range: "1954 – 1975", color: "#4f6f8f" },
  { id: "p5", label: "Cả nước đi lên chủ nghĩa xã hội", range: "1975 – 1986", color: "#8a6a9a" },
  { id: "p6", label: "Đổi mới và hội nhập", range: "1986 – 2021", color: "#c08a2e" },
];

// Sự kiện theo thứ tự thời gian. Thứ tự này quyết định vị trí trên trục thời gian.
export const events: HistoryNode[] = [
  {
    id: "luan-cuong-lenin",
    kind: "event",
    title: "Nguyễn Ái Quốc đọc Luận cương của V.I. Lênin",
    date: "7/1920",
    period: "p1",
    summary:
      "Nguyễn Ái Quốc đọc bản Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa của V.I. Lênin đăng trên báo L'Humanité.",
    significance:
      "Người tìm thấy con đường giải phóng dân tộc theo khuynh hướng cách mạng vô sản.",
  },
  {
    id: "dai-hoi-tours",
    kind: "event",
    title: "Đại hội Tours",
    date: "12/1920",
    period: "p1",
    summary:
      "Tại Đại hội lần thứ XVIII Đảng Xã hội Pháp ở Tours, Nguyễn Ái Quốc bỏ phiếu tán thành gia nhập Quốc tế III và tham gia sáng lập Đảng Cộng sản Pháp.",
    significance:
      "Đánh dấu bước chuyển từ người yêu nước thành người cộng sản của Nguyễn Ái Quốc.",
    photos: [photos.naqTours1920],
  },
  {
    id: "lien-xo",
    kind: "event",
    title: "Hoạt động tại Liên Xô và Quốc tế Cộng sản",
    date: "1923 – 1924",
    period: "p1",
    summary:
      "Tháng 6/1923 Nguyễn Ái Quốc đến Liên Xô; năm 1924 Người dự Đại hội V Quốc tế Cộng sản, trình bày quan điểm về vấn đề thuộc địa.",
    photos: [photos.naqComintern1924, photos.naq1923],
  },
  {
    id: "thanh-nien",
    kind: "event",
    title: "Thành lập Hội Việt Nam Cách mạng Thanh niên",
    date: "6/1925",
    period: "p1",
    summary:
      "Tại Quảng Châu (Trung Quốc), Nguyễn Ái Quốc thành lập Hội Việt Nam Cách mạng Thanh niên, mở lớp huấn luyện cán bộ và ra báo Thanh niên.",
    significance:
      "Chuẩn bị về chính trị, tư tưởng và tổ chức cho sự ra đời của Đảng.",
    photos: [photos.thanhNien1925, photos.duongKachMenh],
  },
  {
    id: "ba-to-chuc",
    kind: "event",
    title: "Ba tổ chức cộng sản ra đời",
    date: "6 – 9/1929",
    period: "p1",
    summary:
      "Đông Dương Cộng sản Đảng (6/1929), An Nam Cộng sản Đảng (8/1929) và Đông Dương Cộng sản Liên đoàn (9/1929) lần lượt được thành lập.",
    significance:
      "Xu thế thành lập đảng cộng sản là tất yếu, nhưng sự tồn tại riêng rẽ đòi hỏi phải hợp nhất.",
  },
  {
    id: "thanh-lap-dang",
    kind: "event",
    title: "Hội nghị thành lập Đảng Cộng sản Việt Nam",
    date: "6/1 – 7/2/1930",
    period: "p1",
    summary:
      "Dưới sự chủ trì của Nguyễn Ái Quốc, Hội nghị họp tại Cửu Long (Hương Cảng) hợp nhất các tổ chức cộng sản, lấy tên Đảng Cộng sản Việt Nam và thông qua Cương lĩnh chính trị đầu tiên. Đại hội III (1960) quyết định lấy ngày 3/2 làm ngày kỷ niệm thành lập Đảng.",
    significance:
      "Bước ngoặt vĩ đại, chấm dứt khủng hoảng về đường lối và giai cấp lãnh đạo cách mạng Việt Nam.",
    photos: [photos.naq1923],
  },
  {
    id: "hoi-nghi-tw-10-1930",
    kind: "event",
    title: "Hội nghị Trung ương lần thứ nhất",
    date: "10/1930",
    period: "p2",
    summary:
      "Hội nghị họp tại Hương Cảng, đổi tên thành Đảng Cộng sản Đông Dương, thông qua Luận cương chính trị do Trần Phú soạn thảo và bầu Trần Phú làm Tổng Bí thư.",
    photos: [photos.tranPhu],
  },
  {
    id: "xo-viet-nghe-tinh",
    kind: "event",
    title: "Phong trào cách mạng 1930 – 1931",
    date: "1930 – 1931",
    period: "p2",
    summary:
      "Cao trào cách mạng lan rộng cả nước, đỉnh cao là Xô viết Nghệ - Tĩnh; ngày 12/9/1930 hàng nghìn nông dân Hưng Nguyên biểu tình và bị thực dân Pháp ném bom đàn áp.",
    significance:
      "Cuộc tập dượt đầu tiên của Đảng và quần chúng cho Cách mạng Tháng Tám sau này.",
    photos: [photos.boCao1930],
  },
  {
    id: "dai-hoi-1",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ I",
    date: "27 – 31/3/1935",
    period: "p2",
    summary:
      "Đại hội họp tại Ma Cao (Trung Quốc), đánh dấu việc khôi phục hệ thống tổ chức của Đảng sau thời kỳ bị khủng bố; bầu Ban Chấp hành Trung ương do đồng chí Lê Hồng Phong đứng đầu.",
    photos: [photos.leHongPhong],
  },
  {
    id: "dan-chu-1936",
    kind: "event",
    title: "Phong trào dân chủ 1936 – 1939",
    date: "1936 – 1939",
    period: "p2",
    summary:
      "Hội nghị Trung ương 7/1936 chủ trương tạm gác khẩu hiệu cách mạng ruộng đất, đòi tự do, dân chủ, cơm áo, hòa bình; lập Mặt trận nhân dân phản đế, sau đổi thành Mặt trận Dân chủ Đông Dương (3/1938).",
    significance:
      "Cuộc tập dượt thứ hai, xây dựng được đội quân chính trị quần chúng đông đảo.",
    photos: [photos.haHuyTap],
  },
  {
    id: "hoi-nghi-tw-6-1939",
    kind: "event",
    title: "Hội nghị Trung ương 6",
    date: "11/1939",
    period: "p2",
    summary:
      "Họp tại Bà Điểm (Hóc Môn, Gia Định) do Tổng Bí thư Nguyễn Văn Cừ chủ trì, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và thành lập Mặt trận thống nhất dân tộc phản đế Đông Dương.",
    significance: "Mở đầu sự chuyển hướng chỉ đạo chiến lược của Đảng.",
    photos: [photos.nguyenVanCu],
  },
  {
    id: "khoi-nghia-1940",
    kind: "event",
    title: "Khởi nghĩa Bắc Sơn và Nam Kỳ",
    date: "9 – 11/1940",
    period: "p2",
    summary:
      "Khởi nghĩa Bắc Sơn (27/9/1940) và Khởi nghĩa Nam Kỳ (23/11/1940) nổ ra; dù bị đàn áp, các cuộc khởi nghĩa để lại nhiều bài học về khởi nghĩa vũ trang.",
  },
  {
    id: "ve-nuoc-1941",
    kind: "event",
    title: "Nguyễn Ái Quốc về nước",
    date: "28/1/1941",
    period: "p2",
    summary:
      "Sau 30 năm hoạt động ở nước ngoài, Nguyễn Ái Quốc về nước, ở và làm việc tại Pác Bó (Hà Quảng, Cao Bằng) để trực tiếp lãnh đạo cách mạng.",
    photos: [photos.cocBo],
  },
  {
    id: "hoi-nghi-tw-8-1941",
    kind: "event",
    title: "Hội nghị Trung ương 8",
    date: "10 – 19/5/1941",
    period: "p2",
    summary:
      "Do Nguyễn Ái Quốc chủ trì tại Pác Bó; giương cao ngọn cờ giải phóng dân tộc, giải quyết vấn đề dân tộc trong khuôn khổ từng nước, quyết định thành lập Mặt trận Việt Minh (19/5/1941) và bầu Trường Chinh làm Tổng Bí thư.",
    significance:
      "Hoàn chỉnh sự chuyển hướng chỉ đạo chiến lược, chuẩn bị trực tiếp cho Cách mạng Tháng Tám.",
    photos: [photos.cocBo],
  },
  {
    id: "chi-thi-12-3-1945",
    kind: "event",
    title: "Chỉ thị “Nhật – Pháp bắn nhau và hành động của chúng ta”",
    date: "12/3/1945",
    period: "p2",
    summary:
      "Sau khi Nhật đảo chính Pháp (9/3/1945), Ban Thường vụ Trung ương họp tại Đình Bảng (Bắc Ninh) và ra chỉ thị xác định phát xít Nhật là kẻ thù chính, phát động cao trào kháng Nhật cứu nước.",
  },
  {
    id: "tan-trao-1945",
    kind: "event",
    title: "Hội nghị toàn quốc của Đảng và Quốc dân Đại hội",
    date: "14 – 17/8/1945",
    period: "p2",
    summary:
      "Hội nghị toàn quốc của Đảng (14 – 15/8) tại Tân Trào quyết định Tổng khởi nghĩa; Quốc dân Đại hội (16 – 17/8) tán thành chủ trương và cử Ủy ban Dân tộc giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch.",
    photos: [photos.dinhTanTrao, photos.cayDaTanTrao],
  },
  {
    id: "cach-mang-thang-tam",
    kind: "event",
    title: "Tổng khởi nghĩa Cách mạng Tháng Tám",
    date: "14 – 28/8/1945",
    period: "p2",
    summary:
      "Nhân dân cả nước nổi dậy giành chính quyền: Hà Nội (19/8), Huế (23/8), Sài Gòn (25/8). Ngày 30/8/1945 vua Bảo Đại thoái vị.",
    significance:
      "Đập tan ách thống trị thực dân, phát xít và lật đổ chế độ quân chủ, mở ra kỷ nguyên độc lập dân tộc gắn liền với chủ nghĩa xã hội.",
    photos: [photos.nhaHatLon1945],
  },
  {
    id: "tuyen-ngon-doc-lap",
    kind: "event",
    title: "Tuyên ngôn Độc lập",
    date: "2/9/1945",
    period: "p3",
    summary:
      "Tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    photos: [photos.baDinh1945, photos.hcmVng1945],
  },
  {
    id: "khang-chien-kien-quoc",
    kind: "event",
    title: "Chỉ thị “Kháng chiến kiến quốc”",
    date: "25/11/1945",
    period: "p3",
    summary:
      "Ban Chấp hành Trung ương ra chỉ thị xác định kẻ thù chính là thực dân Pháp xâm lược và nêu nhiệm vụ: củng cố chính quyền, chống thực dân Pháp, bài trừ nội phản, cải thiện đời sống nhân dân. Trước đó (11/11/1945), Đảng tuyên bố “tự giải tán”, thực chất rút vào hoạt động bí mật.",
  },
  {
    id: "tong-tuyen-cu-1946",
    kind: "event",
    title: "Tổng tuyển cử bầu Quốc hội khóa I",
    date: "6/1/1946",
    period: "p3",
    summary:
      "Cuộc Tổng tuyển cử đầu tiên trong cả nước bầu ra Quốc hội; ngày 9/11/1946 Quốc hội thông qua Hiến pháp đầu tiên.",
    photos: [photos.chinhPhu1946, photos.hienPhap1946],
  },
  {
    id: "hiep-dinh-so-bo",
    kind: "event",
    title: "Hiệp định Sơ bộ và Tạm ước",
    date: "6/3 và 14/9/1946",
    period: "p3",
    summary:
      "Chủ trương “hòa để tiến”: ký Hiệp định Sơ bộ (6/3/1946) và Tạm ước (14/9/1946) với Pháp nhằm tránh phải đối phó nhiều kẻ thù cùng lúc, tranh thủ thời gian chuẩn bị lực lượng.",
    photos: [photos.hiepDinhSoBo1946, photos.fontainebleau1946],
  },
  {
    id: "toan-quoc-khang-chien",
    kind: "event",
    title: "Toàn quốc kháng chiến",
    date: "19/12/1946",
    period: "p3",
    summary:
      "Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến. Đường lối kháng chiến toàn dân, toàn diện, trường kỳ, tự lực cánh sinh được thể hiện trong Chỉ thị “Toàn dân kháng chiến” (12/12/1946) và tác phẩm “Kháng chiến nhất định thắng lợi” của Trường Chinh.",
    photos: [photos.loiKeuGoi, photos.camTuQuan1946],
  },
  {
    id: "viet-bac-1947",
    kind: "event",
    title: "Chiến dịch Việt Bắc thu – đông",
    date: "10 – 12/1947",
    period: "p3",
    summary:
      "Quân và dân ta đánh bại cuộc tiến công quy mô lớn của Pháp lên căn cứ địa Việt Bắc, bảo vệ cơ quan đầu não kháng chiến.",
    significance: "Làm phá sản chiến lược “đánh nhanh thắng nhanh” của Pháp.",
    photos: [photos.atkDinhHoa],
  },
  {
    id: "bien-gioi-1950",
    kind: "event",
    title: "Chiến dịch Biên giới thu – đông",
    date: "9 – 10/1950",
    period: "p3",
    summary:
      "Chiến dịch tiến công lớn đầu tiên do ta chủ động mở, khai thông biên giới Việt – Trung.",
    significance: "Ta giành được quyền chủ động chiến lược trên chiến trường chính Bắc Bộ.",
    photos: [photos.dongKhe1950],
  },
  {
    id: "dai-hoi-2",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ II",
    date: "11 – 19/2/1951",
    period: "p3",
    summary:
      "Họp tại Chiêm Hóa (Tuyên Quang). Đảng ra hoạt động công khai với tên Đảng Lao động Việt Nam, thông qua Chính cương; bầu Hồ Chí Minh làm Chủ tịch Đảng, Trường Chinh làm Tổng Bí thư.",
    significance: "“Đại hội kháng chiến thắng lợi”.",
    photos: [photos.daiHoi2],
  },
  {
    id: "dien-bien-phu",
    kind: "event",
    title: "Chiến dịch Điện Biên Phủ",
    date: "13/3 – 7/5/1954",
    period: "p3",
    summary:
      "Sau 56 ngày đêm, quân ta do Đại tướng Võ Nguyên Giáp chỉ huy tiêu diệt toàn bộ tập đoàn cứ điểm Điện Biên Phủ.",
    significance:
      "Thắng lợi quyết định, buộc Pháp ký Hiệp định Genève, kết thúc cuộc kháng chiến chống thực dân Pháp.",
    photos: [photos.dienBienPhu1954],
  },
  {
    id: "hiep-dinh-geneve",
    kind: "event",
    title: "Hiệp định Genève về Đông Dương",
    date: "21/7/1954",
    period: "p3",
    summary:
      "Các bên công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia; lấy vĩ tuyến 17 làm giới tuyến quân sự tạm thời, dự kiến tổng tuyển cử thống nhất vào tháng 7/1956.",
    photos: [photos.geneve1954],
  },
  {
    id: "hoi-nghi-tw-10-1956",
    kind: "event",
    title: "Hội nghị Trung ương 10 (khóa II)",
    date: "9/1956",
    period: "p4",
    summary:
      "Hội nghị nghiêm khắc kiểm điểm những sai lầm trong cải cách ruộng đất và chỉnh đốn tổ chức, đề ra chủ trương sửa sai; đồng chí Trường Chinh thôi giữ chức Tổng Bí thư, Chủ tịch Hồ Chí Minh kiêm nhiệm.",
  },
  {
    id: "nghi-quyet-15",
    kind: "event",
    title: "Nghị quyết Trung ương 15",
    date: "1/1959",
    period: "p4",
    summary:
      "Xác định con đường cơ bản của cách mạng miền Nam là khởi nghĩa giành chính quyền về tay nhân dân, sử dụng bạo lực cách mạng, kết hợp đấu tranh chính trị với đấu tranh vũ trang.",
  },
  {
    id: "dong-khoi",
    kind: "event",
    title: "Phong trào Đồng khởi",
    date: "1959 – 1960",
    period: "p4",
    summary:
      "Phong trào nổ ra mạnh mẽ, tiêu biểu là Đồng khởi ở Bến Tre (bắt đầu 17/1/1960).",
    significance:
      "Chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công.",
  },
  {
    id: "dai-hoi-3",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ III",
    date: "5 – 10/9/1960",
    period: "p4",
    summary:
      "Họp tại Hà Nội, hoàn chỉnh đường lối tiến hành đồng thời hai chiến lược cách mạng: cách mạng xã hội chủ nghĩa ở miền Bắc và cách mạng dân tộc dân chủ nhân dân ở miền Nam; bầu Lê Duẩn làm Bí thư thứ nhất.",
    significance: "“Đại hội xây dựng chủ nghĩa xã hội ở miền Bắc và đấu tranh hòa bình thống nhất nước nhà”.",
    photos: [photos.leDuan1951],
  },
  {
    id: "mat-tran-dtgp",
    kind: "event",
    title: "Thành lập Mặt trận Dân tộc Giải phóng miền Nam Việt Nam",
    date: "20/12/1960",
    period: "p4",
    summary:
      "Mặt trận ra đời nhằm đoàn kết các tầng lớp nhân dân miền Nam đấu tranh chống Mỹ và chính quyền Sài Gòn.",
    photos: [photos.coMatTran],
  },
  {
    id: "ap-bac",
    kind: "event",
    title: "Chiến thắng Ấp Bắc",
    date: "2/1/1963",
    period: "p4",
    summary:
      "Quân giải phóng đánh bại cuộc càn có ưu thế lớn về binh lực và phương tiện tại Ấp Bắc (Mỹ Tho).",
    significance:
      "Chứng minh khả năng đánh bại chiến thuật “trực thăng vận”, “thiết xa vận” của chiến lược “Chiến tranh đặc biệt”.",
    photos: [photos.apBac1963],
  },
  {
    id: "hoi-nghi-tw-11-12-1965",
    kind: "event",
    title: "Hội nghị Trung ương 11 và 12",
    date: "3/1965 và 12/1965",
    period: "p4",
    summary:
      "Trước việc Mỹ chuyển sang chiến lược “Chiến tranh cục bộ” và mở rộng chiến tranh phá hoại miền Bắc, Đảng đề ra đường lối kháng chiến chống Mỹ, cứu nước trên phạm vi cả nước.",
  },
  {
    id: "mau-than-1968",
    kind: "event",
    title: "Tổng tiến công và nổi dậy Tết Mậu Thân",
    date: "Đêm 30 rạng 31/1/1968",
    period: "p4",
    summary:
      "Cuộc tổng tiến công đồng loạt vào các đô thị miền Nam, trong đó có Sài Gòn và Huế.",
    significance:
      "Làm lung lay ý chí xâm lược của Mỹ, buộc Mỹ tuyên bố “phi Mỹ hóa” chiến tranh và chấp nhận đàm phán tại Paris.",
    photos: [photos.hue1968],
  },
  {
    id: "bac-ho-mat",
    kind: "event",
    title: "Chủ tịch Hồ Chí Minh từ trần",
    date: "2/9/1969",
    period: "p4",
    summary:
      "Chủ tịch Hồ Chí Minh qua đời tại Hà Nội, để lại bản Di chúc thiêng liêng cho toàn Đảng, toàn dân.",
    photos: [photos.diChuc1969],
  },
  {
    id: "dien-bien-phu-tren-khong",
    kind: "event",
    title: "“Điện Biên Phủ trên không”",
    date: "18 – 29/12/1972",
    period: "p4",
    summary:
      "Quân và dân miền Bắc đánh bại cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ vào Hà Nội, Hải Phòng trong 12 ngày đêm.",
    significance: "Buộc Mỹ trở lại bàn đàm phán và ký Hiệp định Paris.",
    photos: [photos.b52HuuTiep],
  },
  {
    id: "hiep-dinh-paris",
    kind: "event",
    title: "Hiệp định Paris",
    date: "27/1/1973",
    period: "p4",
    summary:
      "Hiệp định về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết; Mỹ cam kết tôn trọng độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ của Việt Nam và rút hết quân trong 60 ngày.",
    photos: [photos.paris1973, photos.kissingerLeDucTho],
  },
  {
    id: "dai-thang-mua-xuan-1975",
    kind: "event",
    title: "Tổng tiến công và nổi dậy mùa Xuân 1975",
    date: "3 – 30/4/1975",
    period: "p4",
    summary:
      "Qua ba chiến dịch Tây Nguyên, Huế – Đà Nẵng và Hồ Chí Minh, trưa 30/4/1975 Sài Gòn được giải phóng; ngày 2/5/1975 miền Nam hoàn toàn giải phóng.",
    significance:
      "Kết thúc 21 năm kháng chiến chống Mỹ, cứu nước, hoàn thành cách mạng dân tộc dân chủ nhân dân trong cả nước, thống nhất đất nước.",
    photos: [photos.xeTang843],
  },
  {
    id: "thong-nhat-nha-nuoc",
    kind: "event",
    title: "Thống nhất đất nước về mặt nhà nước",
    date: "25/4 – 2/7/1976",
    period: "p5",
    summary:
      "Tổng tuyển cử bầu Quốc hội chung cả nước (25/4/1976). Ngày 2/7/1976 Quốc hội quyết định đặt tên nước là Cộng hòa xã hội chủ nghĩa Việt Nam.",
  },
  {
    id: "dai-hoi-4",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ IV",
    date: "14 – 20/12/1976",
    period: "p5",
    summary:
      "Đại hội đổi tên Đảng thành Đảng Cộng sản Việt Nam, đề ra đường lối cách mạng xã hội chủ nghĩa trong phạm vi cả nước; bầu Lê Duẩn làm Tổng Bí thư.",
    photos: [photos.leDuan1978],
  },
  {
    id: "bao-ve-bien-gioi-1979",
    kind: "event",
    title: "Chiến tranh bảo vệ biên giới Tây Nam và phía Bắc",
    date: "1978 – 1979",
    period: "p5",
    summary:
      "Quân và dân ta chiến đấu bảo vệ biên giới Tây Nam, giúp nhân dân Campuchia thoát khỏi chế độ diệt chủng (Phnôm Pênh được giải phóng ngày 7/1/1979), và chiến đấu bảo vệ biên giới phía Bắc (từ 17/2/1979).",
  },
  {
    id: "tw-6-1979",
    kind: "event",
    title: "Hội nghị Trung ương 6 (khóa IV) và Chỉ thị 100",
    date: "8/1979 và 13/1/1981",
    period: "p5",
    summary:
      "Hội nghị Trung ương 6 chủ trương “làm cho sản xuất bung ra”; Chỉ thị 100-CT/TW thực hiện khoán sản phẩm đến nhóm và người lao động trong hợp tác xã nông nghiệp.",
    significance: "Những bước đột phá đầu tiên trong tư duy kinh tế, tiền đề cho Đổi mới.",
  },
  {
    id: "dai-hoi-5",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ V",
    date: "27 – 31/3/1982",
    period: "p5",
    summary:
      "Đại hội xác định hai nhiệm vụ chiến lược là xây dựng thành công chủ nghĩa xã hội và sẵn sàng chiến đấu bảo vệ Tổ quốc; coi nông nghiệp là mặt trận hàng đầu.",
    photos: [photos.leDuan1978],
  },
  {
    id: "tw-8-1985",
    kind: "event",
    title: "Hội nghị Trung ương 8 (khóa V)",
    date: "6/1985",
    period: "p5",
    summary:
      "Chủ trương xóa bỏ cơ chế tập trung quan liêu, hành chính, bao cấp; thực hiện cải cách giá – lương – tiền.",
  },
  {
    id: "dai-hoi-6",
    kind: "event",
    title: "Đại hội VI – Khởi xướng đường lối Đổi mới",
    date: "15 – 18/12/1986",
    period: "p6",
    summary:
      "Với tinh thần “nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật”, Đại hội đề ra đường lối đổi mới toàn diện, trọng tâm là đổi mới kinh tế; thực hiện ba chương trình kinh tế lớn: lương thực – thực phẩm, hàng tiêu dùng, hàng xuất khẩu. Đồng chí Nguyễn Văn Linh được bầu làm Tổng Bí thư.",
    significance: "Bước ngoặt mở ra thời kỳ Đổi mới.",
    photos: [photos.nguyenVanLinh1986],
  },
  {
    id: "khoan-10",
    kind: "event",
    title: "Nghị quyết 10 của Bộ Chính trị (“Khoán 10”)",
    date: "5/4/1988",
    period: "p6",
    summary:
      "Đổi mới quản lý kinh tế nông nghiệp, thừa nhận hộ xã viên là đơn vị kinh tế tự chủ.",
    significance:
      "Tạo động lực lớn cho sản xuất nông nghiệp; từ năm 1989 Việt Nam bắt đầu xuất khẩu gạo.",
  },
  {
    id: "dai-hoi-7",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ VII",
    date: "24 – 27/6/1991",
    period: "p6",
    summary:
      "Thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội và Chiến lược ổn định và phát triển kinh tế – xã hội đến năm 2000; khẳng định lấy chủ nghĩa Mác – Lênin và tư tưởng Hồ Chí Minh làm nền tảng tư tưởng. Đồng chí Đỗ Mười được bầu làm Tổng Bí thư.",
    photos: [photos.doMuoi1995],
  },
  {
    id: "hoi-nhap-1995",
    kind: "event",
    title: "Bình thường hóa quan hệ với Hoa Kỳ và gia nhập ASEAN",
    date: "7/1995",
    period: "p6",
    summary:
      "Ngày 11/7/1995 Việt Nam và Hoa Kỳ tuyên bố bình thường hóa quan hệ; ngày 28/7/1995 Việt Nam trở thành thành viên thứ bảy của ASEAN.",
  },
  {
    id: "dai-hoi-8",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ VIII",
    date: "28/6 – 1/7/1996",
    period: "p6",
    summary:
      "Đại hội nhận định nước ta đã ra khỏi khủng hoảng kinh tế – xã hội và chuyển sang thời kỳ đẩy mạnh công nghiệp hóa, hiện đại hóa đất nước.",
    photos: [photos.doMuoi1995],
  },
  {
    id: "dai-hoi-9",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ IX",
    date: "19 – 22/4/2001",
    period: "p6",
    summary:
      "Xác định nền kinh tế thị trường định hướng xã hội chủ nghĩa là mô hình kinh tế tổng quát trong thời kỳ quá độ; đồng chí Nông Đức Mạnh được bầu làm Tổng Bí thư.",
    photos: [photos.nongDucManh2010],
  },
  {
    id: "dai-hoi-10",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ X",
    date: "18 – 25/4/2006",
    period: "p6",
    summary:
      "Đề ra mục tiêu sớm đưa nước ta ra khỏi tình trạng kém phát triển; cho phép đảng viên làm kinh tế tư nhân.",
    photos: [photos.nongDucManh2010],
  },
  {
    id: "gia-nhap-wto",
    kind: "event",
    title: "Gia nhập Tổ chức Thương mại Thế giới (WTO)",
    date: "11/1/2007",
    period: "p6",
    summary: "Việt Nam chính thức trở thành thành viên thứ 150 của WTO.",
  },
  {
    id: "dai-hoi-11",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ XI",
    date: "12 – 19/1/2011",
    period: "p6",
    summary:
      "Thông qua Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội (bổ sung, phát triển năm 2011) và Chiến lược phát triển kinh tế – xã hội 2011 – 2020; đồng chí Nguyễn Phú Trọng được bầu làm Tổng Bí thư.",
    photos: [photos.nguyenPhuTrong2014],
  },
  {
    id: "dai-hoi-12",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ XII",
    date: "21 – 28/1/2016",
    period: "p6",
    summary:
      "Đại hội nhấn mạnh tăng cường xây dựng, chỉnh đốn Đảng, đẩy mạnh toàn diện, đồng bộ công cuộc đổi mới.",
    photos: [photos.nguyenPhuTrong2014],
  },
  {
    id: "dai-hoi-13",
    kind: "event",
    title: "Đại hội đại biểu toàn quốc lần thứ XIII",
    date: "25/1 – 1/2/2021",
    period: "p6",
    summary:
      "Đề ra tầm nhìn: đến năm 2030 là nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao; đến năm 2045 trở thành nước phát triển, thu nhập cao.",
    photos: [photos.nguyenPhuTrong2018],
  },
];

export const entities: HistoryNode[] = [
  {
    id: "ho-chi-minh",
    kind: "person",
    title: "Nguyễn Ái Quốc – Hồ Chí Minh",
    date: "1890 – 1969",
    period: "p1",
    summary:
      "Người sáng lập Đảng Cộng sản Việt Nam, Chủ tịch nước Việt Nam Dân chủ Cộng hòa (1945 – 1969), Chủ tịch Đảng (1951 – 1969).",
    photos: [photos.hcmBerlin1957, photos.naq1923],
  },
  {
    id: "tran-phu",
    kind: "person",
    title: "Trần Phú",
    date: "1904 – 1931",
    period: "p2",
    summary:
      "Tổng Bí thư đầu tiên của Đảng (10/1930 – 4/1931), người soạn thảo Luận cương chính trị. Bị thực dân Pháp bắt và hy sinh ngày 6/9/1931 với lời nhắn “Hãy giữ vững chí khí chiến đấu”.",
    photos: [photos.tranPhu],
  },
  {
    id: "le-hong-phong",
    kind: "person",
    title: "Lê Hồng Phong",
    date: "1902 – 1942",
    period: "p2",
    summary:
      "Đứng đầu Ban Chấp hành Trung ương do Đại hội I (1935) bầu ra; chủ trì Hội nghị Trung ương 7/1936. Hy sinh tại nhà tù Côn Đảo năm 1942.",
    photos: [photos.leHongPhong],
  },
  {
    id: "ha-huy-tap",
    kind: "person",
    title: "Hà Huy Tập",
    date: "1906 – 1941",
    period: "p2",
    summary:
      "Tổng Bí thư của Đảng (1936 – 1938), lãnh đạo phong trào dân chủ. Bị thực dân Pháp xử bắn năm 1941.",
    photos: [photos.haHuyTap],
  },
  {
    id: "nguyen-van-cu",
    kind: "person",
    title: "Nguyễn Văn Cừ",
    date: "1912 – 1941",
    period: "p2",
    summary:
      "Tổng Bí thư của Đảng (1938 – 1940), chủ trì Hội nghị Trung ương 6 (11/1939), tác giả “Tự chỉ trích”. Bị thực dân Pháp xử bắn năm 1941.",
    photos: [photos.nguyenVanCu],
  },
  {
    id: "truong-chinh",
    kind: "person",
    title: "Trường Chinh",
    date: "1907 – 1988",
    period: "p2",
    summary:
      "Tổng Bí thư của Đảng (1941 – 1956 và 7 – 12/1986), tác giả “Kháng chiến nhất định thắng lợi”.",
    photos: [photos.truongChinhHoaLo],
  },
  {
    id: "vo-nguyen-giap",
    kind: "person",
    title: "Võ Nguyên Giáp",
    date: "1911 – 2013",
    period: "p3",
    summary:
      "Đại tướng, Tổng Tư lệnh Quân đội nhân dân Việt Nam, Chỉ huy trưởng chiến dịch Điện Biên Phủ.",
    photos: [photos.hcmVng1945],
  },
  {
    id: "le-duan",
    kind: "person",
    title: "Lê Duẩn",
    date: "1907 – 1986",
    period: "p4",
    summary:
      "Bí thư thứ nhất (1960 – 1976) và Tổng Bí thư (1976 – 1986) của Đảng.",
    photos: [photos.leDuan1951, photos.leDuan1978],
  },
  {
    id: "nguyen-van-linh",
    kind: "person",
    title: "Nguyễn Văn Linh",
    date: "1915 – 1998",
    period: "p6",
    summary: "Tổng Bí thư của Đảng (1986 – 1991), gắn với giai đoạn khởi đầu công cuộc Đổi mới.",
    photos: [photos.nguyenVanLinh1986],
  },
  {
    id: "cuong-linh-1930",
    kind: "document",
    title: "Cương lĩnh chính trị đầu tiên",
    date: "2/1930",
    period: "p1",
    summary:
      "Gồm Chánh cương vắn tắt, Sách lược vắn tắt… do Nguyễn Ái Quốc soạn thảo; xác định đường lối “làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản”.",
  },
  {
    id: "luan-cuong-1930",
    kind: "document",
    title: "Luận cương chính trị",
    date: "10/1930",
    period: "p2",
    summary:
      "Do Trần Phú soạn thảo, xác định phương hướng cách mạng Đông Dương; còn hạn chế khi chưa đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.",
  },
  {
    id: "doc-tuyen-ngon",
    kind: "document",
    title: "Tuyên ngôn Độc lập",
    date: "2/9/1945",
    period: "p3",
    summary: "Văn kiện khai sinh nước Việt Nam Dân chủ Cộng hòa, do Chủ tịch Hồ Chí Minh soạn thảo.",
  },
  {
    id: "loi-keu-goi",
    kind: "document",
    title: "Lời kêu gọi toàn quốc kháng chiến",
    date: "19/12/1946",
    period: "p3",
    summary: "“Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ.”",
    photos: [photos.loiKeuGoi],
  },
  {
    id: "di-chuc",
    kind: "document",
    title: "Di chúc của Chủ tịch Hồ Chí Minh",
    date: "1965 – 1969",
    period: "p4",
    summary: "Văn kiện Chủ tịch Hồ Chí Minh để lại cho toàn Đảng, toàn dân, công bố sau khi Người từ trần.",
    photos: [photos.diChuc1969],
  },
  {
    id: "cuong-linh-1991",
    kind: "document",
    title: "Cương lĩnh 1991",
    date: "6/1991",
    period: "p6",
    summary:
      "Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội, được bổ sung, phát triển năm 2011.",
  },
  {
    id: "huong-cang",
    kind: "place",
    title: "Hương Cảng (Hồng Kông)",
    date: "1930",
    period: "p1",
    summary: "Nơi diễn ra Hội nghị thành lập Đảng và Hội nghị Trung ương lần thứ nhất.",
  },
  {
    id: "pac-bo",
    kind: "place",
    title: "Pác Bó (Cao Bằng)",
    date: "1941",
    period: "p2",
    summary: "Nơi Nguyễn Ái Quốc ở và làm việc khi về nước, nơi họp Hội nghị Trung ương 8.",
    photos: [photos.cocBo],
  },
  {
    id: "tan-trao",
    kind: "place",
    title: "Tân Trào (Tuyên Quang)",
    date: "1945",
    period: "p2",
    summary: "Thủ đô khu giải phóng; nơi họp Hội nghị toàn quốc của Đảng và Quốc dân Đại hội 8/1945.",
    photos: [photos.dinhTanTrao],
  },
  {
    id: "ba-dinh",
    kind: "place",
    title: "Quảng trường Ba Đình (Hà Nội)",
    date: "1945",
    period: "p3",
    summary: "Nơi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945.",
    photos: [photos.baDinh1945],
  },
  {
    id: "viet-bac",
    kind: "place",
    title: "Chiến khu Việt Bắc",
    date: "1946 – 1954",
    period: "p3",
    summary: "Căn cứ địa, nơi đặt cơ quan đầu não của cuộc kháng chiến chống thực dân Pháp.",
    photos: [photos.atkDinhHoa],
  },
  {
    id: "dien-bien",
    kind: "place",
    title: "Điện Biên Phủ",
    date: "1954",
    period: "p3",
    summary: "Nơi diễn ra trận quyết chiến chiến lược kết thúc kháng chiến chống Pháp.",
  },
  {
    id: "dinh-doc-lap",
    kind: "place",
    title: "Dinh Độc Lập (Sài Gòn)",
    date: "1975",
    period: "p4",
    summary: "Nơi xe tăng Quân giải phóng tiến vào trưa 30/4/1975.",
  },
];

export const links: HistoryLink[] = [
  // Chuỗi nhân quả giữa các sự kiện
  { from: "luan-cuong-lenin", to: "dai-hoi-tours", label: "dẫn tới" },
  { from: "dai-hoi-tours", to: "lien-xo", label: "dẫn tới" },
  { from: "lien-xo", to: "thanh-nien", label: "chuẩn bị cho" },
  { from: "thanh-nien", to: "ba-to-chuc", label: "dẫn tới" },
  { from: "ba-to-chuc", to: "thanh-lap-dang", label: "hợp nhất thành" },
  { from: "thanh-lap-dang", to: "hoi-nghi-tw-10-1930", label: "tiếp nối" },
  { from: "thanh-lap-dang", to: "xo-viet-nghe-tinh", label: "lãnh đạo" },
  { from: "xo-viet-nghe-tinh", to: "dai-hoi-1", label: "khôi phục lực lượng" },
  { from: "dai-hoi-1", to: "dan-chu-1936", label: "tiếp nối" },
  { from: "dan-chu-1936", to: "hoi-nghi-tw-6-1939", label: "chuyển hướng" },
  { from: "hoi-nghi-tw-6-1939", to: "khoi-nghia-1940", label: "dẫn tới" },
  { from: "hoi-nghi-tw-6-1939", to: "hoi-nghi-tw-8-1941", label: "được hoàn chỉnh tại" },
  { from: "ve-nuoc-1941", to: "hoi-nghi-tw-8-1941", label: "chủ trì" },
  { from: "hoi-nghi-tw-8-1941", to: "chi-thi-12-3-1945", label: "chuẩn bị cho" },
  { from: "chi-thi-12-3-1945", to: "tan-trao-1945", label: "dẫn tới" },
  { from: "tan-trao-1945", to: "cach-mang-thang-tam", label: "phát lệnh" },
  { from: "cach-mang-thang-tam", to: "tuyen-ngon-doc-lap", label: "dẫn tới" },
  { from: "tuyen-ngon-doc-lap", to: "khang-chien-kien-quoc", label: "bảo vệ thành quả" },
  { from: "tuyen-ngon-doc-lap", to: "tong-tuyen-cu-1946", label: "xây dựng chính quyền" },
  { from: "khang-chien-kien-quoc", to: "hiep-dinh-so-bo", label: "sách lược" },
  { from: "hiep-dinh-so-bo", to: "toan-quoc-khang-chien", label: "dẫn tới" },
  { from: "toan-quoc-khang-chien", to: "viet-bac-1947", label: "dẫn tới" },
  { from: "viet-bac-1947", to: "bien-gioi-1950", label: "dẫn tới" },
  { from: "bien-gioi-1950", to: "dai-hoi-2", label: "dẫn tới" },
  { from: "dai-hoi-2", to: "dien-bien-phu", label: "lãnh đạo" },
  { from: "dien-bien-phu", to: "hiep-dinh-geneve", label: "buộc ký" },
  { from: "hiep-dinh-geneve", to: "hoi-nghi-tw-10-1956", label: "tiếp nối" },
  { from: "hiep-dinh-geneve", to: "nghi-quyet-15", label: "đất nước tạm chia cắt" },
  { from: "nghi-quyet-15", to: "dong-khoi", label: "mở đường cho" },
  { from: "dong-khoi", to: "mat-tran-dtgp", label: "dẫn tới" },
  { from: "dai-hoi-3", to: "mat-tran-dtgp", label: "đường lối" },
  { from: "mat-tran-dtgp", to: "ap-bac", label: "lãnh đạo" },
  { from: "ap-bac", to: "hoi-nghi-tw-11-12-1965", label: "tiếp nối" },
  { from: "hoi-nghi-tw-11-12-1965", to: "mau-than-1968", label: "dẫn tới" },
  { from: "mau-than-1968", to: "hiep-dinh-paris", label: "mở đầu đàm phán" },
  { from: "bac-ho-mat", to: "di-chuc", label: "để lại" },
  { from: "dien-bien-phu-tren-khong", to: "hiep-dinh-paris", label: "buộc ký" },
  { from: "hiep-dinh-paris", to: "dai-thang-mua-xuan-1975", label: "tạo thời cơ" },
  { from: "dai-thang-mua-xuan-1975", to: "thong-nhat-nha-nuoc", label: "dẫn tới" },
  { from: "thong-nhat-nha-nuoc", to: "dai-hoi-4", label: "tiếp nối" },
  { from: "dai-hoi-4", to: "tw-6-1979", label: "điều chỉnh" },
  { from: "tw-6-1979", to: "dai-hoi-5", label: "tiếp nối" },
  { from: "dai-hoi-5", to: "tw-8-1985", label: "tiếp nối" },
  { from: "tw-8-1985", to: "dai-hoi-6", label: "tiền đề" },
  { from: "dai-hoi-6", to: "khoan-10", label: "cụ thể hóa" },
  { from: "dai-hoi-6", to: "dai-hoi-7", label: "tiếp nối" },
  { from: "dai-hoi-7", to: "hoi-nhap-1995", label: "đường lối đối ngoại" },
  { from: "dai-hoi-7", to: "dai-hoi-8", label: "tiếp nối" },
  { from: "dai-hoi-8", to: "dai-hoi-9", label: "tiếp nối" },
  { from: "dai-hoi-9", to: "dai-hoi-10", label: "tiếp nối" },
  { from: "dai-hoi-10", to: "gia-nhap-wto", label: "hội nhập" },
  { from: "dai-hoi-10", to: "dai-hoi-11", label: "tiếp nối" },
  { from: "dai-hoi-11", to: "dai-hoi-12", label: "tiếp nối" },
  { from: "dai-hoi-12", to: "dai-hoi-13", label: "tiếp nối" },

  // Nhân vật
  { from: "ho-chi-minh", to: "luan-cuong-lenin", label: "nhân vật" },
  { from: "ho-chi-minh", to: "dai-hoi-tours", label: "nhân vật" },
  { from: "ho-chi-minh", to: "lien-xo", label: "nhân vật" },
  { from: "ho-chi-minh", to: "thanh-nien", label: "sáng lập" },
  { from: "ho-chi-minh", to: "thanh-lap-dang", label: "chủ trì" },
  { from: "ho-chi-minh", to: "ve-nuoc-1941", label: "nhân vật" },
  { from: "ho-chi-minh", to: "hoi-nghi-tw-8-1941", label: "chủ trì" },
  { from: "ho-chi-minh", to: "tan-trao-1945", label: "Chủ tịch Ủy ban Dân tộc giải phóng" },
  { from: "ho-chi-minh", to: "tuyen-ngon-doc-lap", label: "đọc Tuyên ngôn" },
  { from: "ho-chi-minh", to: "hiep-dinh-so-bo", label: "ký kết" },
  { from: "ho-chi-minh", to: "toan-quoc-khang-chien", label: "ra Lời kêu gọi" },
  { from: "ho-chi-minh", to: "dai-hoi-2", label: "Chủ tịch Đảng" },
  { from: "ho-chi-minh", to: "bac-ho-mat", label: "nhân vật" },
  { from: "tran-phu", to: "hoi-nghi-tw-10-1930", label: "Tổng Bí thư" },
  { from: "tran-phu", to: "luan-cuong-1930", label: "soạn thảo" },
  { from: "le-hong-phong", to: "dai-hoi-1", label: "đứng đầu BCH Trung ương" },
  { from: "le-hong-phong", to: "dan-chu-1936", label: "chủ trì Hội nghị 7/1936" },
  { from: "ha-huy-tap", to: "dan-chu-1936", label: "Tổng Bí thư" },
  { from: "nguyen-van-cu", to: "hoi-nghi-tw-6-1939", label: "chủ trì" },
  { from: "truong-chinh", to: "hoi-nghi-tw-8-1941", label: "được bầu Tổng Bí thư" },
  { from: "truong-chinh", to: "toan-quoc-khang-chien", label: "“Kháng chiến nhất định thắng lợi”" },
  { from: "truong-chinh", to: "dai-hoi-2", label: "Tổng Bí thư" },
  { from: "truong-chinh", to: "hoi-nghi-tw-10-1956", label: "thôi chức Tổng Bí thư" },
  { from: "vo-nguyen-giap", to: "cach-mang-thang-tam", label: "nhân vật" },
  { from: "vo-nguyen-giap", to: "viet-bac-1947", label: "chỉ huy" },
  { from: "vo-nguyen-giap", to: "dien-bien-phu", label: "Chỉ huy trưởng" },
  { from: "vo-nguyen-giap", to: "dai-thang-mua-xuan-1975", label: "chỉ đạo" },
  { from: "le-duan", to: "dai-hoi-3", label: "Bí thư thứ nhất" },
  { from: "le-duan", to: "dai-hoi-4", label: "Tổng Bí thư" },
  { from: "le-duan", to: "dai-hoi-5", label: "Tổng Bí thư" },
  { from: "nguyen-van-linh", to: "dai-hoi-6", label: "Tổng Bí thư" },

  // Văn kiện
  { from: "thanh-lap-dang", to: "cuong-linh-1930", label: "thông qua" },
  { from: "hoi-nghi-tw-10-1930", to: "luan-cuong-1930", label: "thông qua" },
  { from: "tuyen-ngon-doc-lap", to: "doc-tuyen-ngon", label: "công bố" },
  { from: "toan-quoc-khang-chien", to: "loi-keu-goi", label: "công bố" },
  { from: "dai-hoi-7", to: "cuong-linh-1991", label: "thông qua" },
  { from: "dai-hoi-11", to: "cuong-linh-1991", label: "bổ sung, phát triển" },

  // Địa danh
  { from: "thanh-lap-dang", to: "huong-cang", label: "diễn ra tại" },
  { from: "hoi-nghi-tw-10-1930", to: "huong-cang", label: "diễn ra tại" },
  { from: "ve-nuoc-1941", to: "pac-bo", label: "diễn ra tại" },
  { from: "hoi-nghi-tw-8-1941", to: "pac-bo", label: "diễn ra tại" },
  { from: "tan-trao-1945", to: "tan-trao", label: "diễn ra tại" },
  { from: "tuyen-ngon-doc-lap", to: "ba-dinh", label: "diễn ra tại" },
  { from: "viet-bac-1947", to: "viet-bac", label: "diễn ra tại" },
  { from: "dai-hoi-2", to: "viet-bac", label: "diễn ra tại" },
  { from: "dien-bien-phu", to: "dien-bien", label: "diễn ra tại" },
  { from: "dai-thang-mua-xuan-1975", to: "dinh-doc-lap", label: "diễn ra tại" },
];

export const allNodes: HistoryNode[] = [...events, ...entities];
