// ─── Types ─────────────────────────────────────────────────────────────────

export type Sector = {
  id: number;
  title: string;
  concept1: string;
  concept2: string;
  scenario: string;
  explanation: string;
  quote: string;
  color: string;       // tailwind gradient classes for badge / stripe
  badge: string;
  nebulaGlow: string;  // tailwind gradient for reactor nebula
};

export type PlanetTheme = {
  name: string;
  gradient: string;   // tailwind bg class (radial-gradient)
  ring: boolean;      // show Saturn-like ring?
  beamColor: string;  // hex for SVG stroke
  tagline: string;
  floatClass: string; // animate-float-N
};

export type Connection = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
};

export type ReactorState = "idle" | "synthesizing" | "success" | "error";

export type KnowledgeCard = {
  title: string;
  description: string;
  memoryCue: string;
  color: string;
};

// ─── Data ───────────────────────────────────────────────────────────────────

export const SECTORS: Sector[] = [
  {
    id: 1,
    title: "Tinh Vân Cái Riêng & Cái Chung",
    concept1: "Cái riêng",
    concept2: "Cái chung",
    scenario:
      "Mỗi sinh vật như sư tử, hổ hay báo đều mang những kỹ năng săn mồi độc nhất để sinh tồn thích nghi, nhưng chúng đều thuộc lớp thú có vú và sở hữu bộ xương sống đặc trưng của động vật bậc cao.",
    explanation:
      "Cái chung (thuộc tính lớp thú, xương sống) chỉ tồn tại trong cái riêng (từng cá thể hổ, sư tử) và biểu hiện qua cái riêng. Ngược lại, cái riêng chỉ tồn tại trong mối liên hệ đưa đến cái chung.",
    quote:
      "\u201cCái chung chỉ tồn tại trong cái riêng, thông qua cái riêng mà biểu hiện sự tồn tại của mình. Cái riêng chỉ tồn tại trong mối liên hệ đưa đến cái chung.\u201d",
    color: "from-blue-600 via-indigo-600 to-violet-700",
    badge: "Tinh Vân Nhận Thức",
    nebulaGlow: "from-indigo-600/30 via-violet-600/20 to-transparent",
  },
  {
    id: 2,
    title: "Vòng Xoáy Nguyên Nhân & Kết Quả",
    concept1: "Nguyên nhân",
    concept2: "Kết quả",
    scenario:
      "Khí thải nhà kính tích tụ quá mức hấp thụ thêm bức xạ nhiệt mặt trời, thúc đẩy biến đổi khí hậu toàn cầu khiến băng tan nhanh ở hai cực và dâng mực nước biển.",
    explanation:
      "Hoạt động phát thải là nguyên nhân tạo ra kết quả là biến đổi khí hậu. Trong triết học, nguyên nhân sinh ra kết quả, nhưng kết quả cũng tác động phản hồi ngược lại nguyên nhân (băng tan làm giảm độ phản xạ nhiệt, khiến Trái Đất nóng nhanh hơn).",
    quote:
      "\u201cNguyên nhân sinh ra kết quả. Nhưng kết quả không thụ động mà luôn tác động trở lại nguyên nhân đã sinh ra nó.\u201d",
    color: "from-amber-600 via-orange-600 to-red-700",
    badge: "Vòng Xoáy Nhân Quả",
    nebulaGlow: "from-amber-600/30 via-red-600/20 to-transparent",
  },
  {
    id: 3,
    title: "Vực Sâu Tất Nhiên & Ngẫu Nhiên",
    concept1: "Tất nhiên",
    concept2: "Ngẫu nhiên",
    scenario:
      "Việc gieo quân xúc xắc rơi trúng mặt 6 chấm hoàn toàn là ngẫu nhiên, nhưng việc quân xúc xắc đó chịu sức hút của trọng lực và rơi xuống đất là điều tất nhiên phải xảy ra.",
    explanation:
      "Mặt 6 chấm xuất hiện là cái ngẫu nhiên (chịu tác động của lực ném, góc tung). Việc rơi xuống đất là cái tất nhiên (do định luật vạn vật hấp dẫn). Cái tất nhiên vạch đường đi cho mình thông qua vô số cái ngẫu nhiên.",
    quote:
      "\u201cTất nhiên vạch đường đi cho mình thông qua vô số cái ngẫu nhiên. Ngẫu nhiên là hình thức biểu hiện và là cái bổ sung cho tất nhiên.\u201d",
    color: "from-purple-600 via-fuchsia-600 to-pink-700",
    badge: "Vực Sâu Quy Luật",
    nebulaGlow: "from-fuchsia-600/30 via-pink-600/20 to-transparent",
  },
  {
    id: 4,
    title: "Thiên Hà Nội Dung & Hình Thức",
    concept1: "Nội dung",
    concept2: "Hình thức",
    scenario:
      "Một tác phẩm văn học mang tư tưởng nhân đạo cao cả (cốt lõi ý nghĩa) có thể chọn cách truyền tải qua thể thơ tự do, lục bát hay song thất lục bát.",
    explanation:
      "Tư tưởng nhân đạo là nội dung, còn thể thơ hay vở kịch là hình thức. Nội dung quyết định hình thức. Hình thức không thụ động mà tác động lại nội dung (hình thức phù hợp thúc đẩy nội dung phát triển).",
    quote:
      "\u201cNội dung quyết định hình thức. Hình thức luôn tác động trở lại nội dung, thúc đẩy hoặc kìm hãm sự phát triển của nội dung.\u201d",
    color: "from-emerald-600 via-teal-600 to-cyan-700",
    badge: "Thiên Hà Sáng Tạo",
    nebulaGlow: "from-emerald-600/30 via-teal-600/20 to-transparent",
  },
  {
    id: 5,
    title: "Cực Quang Bản Chất & Hiện Tượng",
    concept1: "Bản chất",
    concept2: "Hiện tượng",
    scenario:
      "Mặt nước sông trôi phẳng lặng và êm đềm ở bề mặt, nhưng sâu bên dưới lòng sông lại ẩn giấu những dòng nước xoáy nguy hiểm cực kỳ khó lường.",
    explanation:
      "Sự phẳng lặng bề mặt chỉ là hiện tượng dễ thấy bên ngoài, còn dòng xoáy ngầm bên dưới mới là bản chất của dòng sông. Bản chất là cái ẩn giấu bên trong, hiện tượng là biểu hiện bên ngoài của bản chất.",
    quote:
      "\u201cBản chất bộc lộ qua hiện tượng. Hiện tượng là sự biểu hiện của bản chất ra bên ngoài, có thể phản ánh đúng hoặc khúc khuỷu bản chất.\u201d",
    color: "from-cyan-600 via-sky-600 to-blue-700",
    badge: "Cực Quang Thấu Suốt",
    nebulaGlow: "from-cyan-600/30 via-sky-600/20 to-transparent",
  },
  {
    id: 6,
    title: "Cực Quang Bản Chất & Hiện Tượng II",
    concept1: "Bản chất",
    concept2: "Hiện tượng",
    scenario:
      "Một cửa hàng có biển quảng cáo rực rỡ, nhân viên niềm nở và không gian sang trọng, nhưng nhiều khách hàng sau khi mua lại phản ánh sản phẩm nhanh hỏng vì quy trình kiểm soát chất lượng bên trong rất lỏng lẻo.",
    explanation:
      "Hình ảnh sang trọng và thái độ phục vụ là hiện tượng dễ quan sát bên ngoài. Quy trình kiểm soát chất lượng lỏng lẻo mới là bản chất chi phối việc sản phẩm nhanh hỏng. Muốn đánh giá đúng sự vật phải đi từ hiện tượng để tìm ra bản chất bên trong.",
    quote:
      "\u201cHiện tượng phong phú và biến đổi, còn bản chất tương đối ổn định hơn, quy định khuynh hướng vận động của sự vật.\u201d",
    color: "from-cyan-600 via-sky-600 to-blue-700",
    badge: "Cực Quang Thấu Suốt",
    nebulaGlow: "from-cyan-600/30 via-sky-600/20 to-transparent",
  },
  {
    id: 7,
    title: "Cực Quang Bản Chất & Hiện Tượng III",
    concept1: "Bản chất",
    concept2: "Hiện tượng",
    scenario:
      "Một học sinh đạt điểm rất cao trong một bài kiểm tra nhờ học tủ đúng phần được hỏi, nhưng khi gặp bài vận dụng mới lại lúng túng vì chưa hiểu sâu kiến thức nền tảng.",
    explanation:
      "Điểm số cao trong một bài kiểm tra là hiện tượng biểu hiện ra bên ngoài. Mức độ hiểu sâu và năng lực vận dụng mới phản ánh bản chất của quá trình học tập. Hiện tượng có thể phản ánh chưa đầy đủ hoặc làm che khuất bản chất.",
    quote:
      "\u201cBản chất không nằm lộ ngay trên bề mặt; nó được nhận thức thông qua phân tích nhiều hiện tượng trong mối liên hệ của chúng.\u201d",
    color: "from-cyan-600 via-sky-600 to-blue-700",
    badge: "Cực Quang Thấu Suốt",
    nebulaGlow: "from-cyan-600/30 via-sky-600/20 to-transparent",
  },
  {
    id: 8,
    title: "Hố Đen Khả Năng & Hiện Thực",
    concept1: "Khả năng",
    concept2: "Hiện thực",
    scenario:
      "Hạt giống lúa chín vàng trĩu hạt mang sẵn các điều kiện bên trong, khi tích tụ đủ lượng nước tưới, mùn đất dinh dưỡng và ánh sáng sẽ nảy mầm sinh trưởng mạnh mẽ.",
    explanation:
      "Tiềm năng nảy mầm là khả năng của hạt giống. Gặp đủ điều kiện, khả năng nảy mầm chuyển hóa thành cây lúa sinh trưởng (hiện thực). Khả năng và hiện thực liên tục chuyển hóa lẫn nhau.",
    quote:
      "\u201cKhả năng là cái chưa có nhưng sẽ có khi có đủ điều kiện. Hiện thực là cái đang tồn tại thực sự. Chúng liên tục chuyển hóa biện chứng.\u201d",
    color: "from-rose-600 via-pink-600 to-purple-700",
    badge: "Hố Đen Chuyển Hóa",
    nebulaGlow: "from-rose-600/30 via-pink-600/20 to-transparent",
  },
  {
    id: 9,
    title: "Hố Đen Khả Năng & Hiện Thực II",
    concept1: "Khả năng",
    concept2: "Hiện thực",
    scenario:
      "Một sinh viên có ý tưởng xây dựng ứng dụng học tập rất hay, có kỹ năng lập trình cơ bản và nhóm bạn hỗ trợ, nhưng ý tưởng đó chỉ trở thành sản phẩm thật khi nhóm lập kế hoạch, viết mã, kiểm thử và phát hành.",
    explanation:
      "Ý tưởng, kỹ năng và đội nhóm tạo nên khả năng hình thành sản phẩm. Khi các điều kiện được tổ chức và thực hiện bằng hành động cụ thể, khả năng chuyển hóa thành hiện thực là ứng dụng có thể sử dụng.",
    quote:
      "\u201cKhả năng muốn trở thành hiện thực cần có những điều kiện thích hợp và hoạt động thực tiễn tương ứng.\u201d",
    color: "from-rose-600 via-pink-600 to-purple-700",
    badge: "Hố Đen Chuyển Hóa",
    nebulaGlow: "from-rose-600/30 via-pink-600/20 to-transparent",
  },
  {
    id: 10,
    title: "Hố Đen Khả Năng & Hiện Thực III",
    concept1: "Khả năng",
    concept2: "Hiện thực",
    scenario:
      "Một khu đất bỏ trống có thể trở thành công viên xanh nếu được quy hoạch, đầu tư và chăm sóc, nhưng cũng có thể biến thành bãi rác tự phát nếu bị buông lỏng quản lý trong thời gian dài.",
    explanation:
      "Khu đất chứa nhiều khả năng phát triển khác nhau. Khả năng nào trở thành hiện thực phụ thuộc vào điều kiện khách quan, sự lựa chọn và hoạt động của con người. Hiện thực mới sau đó lại mở ra những khả năng tiếp theo.",
    quote:
      "\u201cTrong cùng một hiện thực có thể tồn tại nhiều khả năng; sự chuyển hóa phụ thuộc vào điều kiện và hoạt động thực tiễn.\u201d",
    color: "from-rose-600 via-pink-600 to-purple-700",
    badge: "Hố Đen Chuyển Hóa",
    nebulaGlow: "from-rose-600/30 via-pink-600/20 to-transparent",
  },
];

export const ALL_CRYSTALS = [
  "Cái riêng",
  "Cái chung",
  "Nguyên nhân",
  "Kết quả",
  "Tất nhiên",
  "Ngẫu nhiên",
  "Nội dung",
  "Hình thức",
  "Bản chất",
  "Hiện tượng",
  "Khả năng",
  "Hiện thực",
];

export const PLANET_THEMES: Record<string, PlanetTheme> = {
  "Cái riêng":   { name: "Tinh Cầu Cái Riêng",   gradient: "bg-[radial-gradient(circle_at_30%_30%,#38bdf8,#0284c7)]", ring: true,  beamColor: "#0ea5e9", tagline: "Cá thể độc nhất",    floatClass: "animate-float-1" },
  "Cái chung":   { name: "Tinh Cầu Cái Chung",    gradient: "bg-[radial-gradient(circle_at_30%_30%,#c084fc,#7c3aed)]", ring: false, beamColor: "#a855f7", tagline: "Bản chất phổ quát", floatClass: "animate-float-2" },
  "Nguyên nhân": { name: "Tinh Cầu Nguyên Nhân",  gradient: "bg-[radial-gradient(circle_at_30%_30%,#f97316,#c2410c)]", ring: false, beamColor: "#f97316", tagline: "Nguồn gốc sinh thành", floatClass: "animate-float-3" },
  "Kết quả":     { name: "Tinh Cầu Kết Quả",      gradient: "bg-[radial-gradient(circle_at_30%_30%,#34d399,#047857)]", ring: true,  beamColor: "#10b981", tagline: "Biến đổi sinh ra",  floatClass: "animate-float-4" },
  "Tất nhiên":   { name: "Tinh Cầu Tất Nhiên",    gradient: "bg-[radial-gradient(circle_at_30%_30%,#fbbf24,#b45309)]", ring: true,  beamColor: "#f59e0b", tagline: "Định luật tất yếu", floatClass: "animate-float-1" },
  "Ngẫu nhiên":  { name: "Tinh Cầu Ngẫu Nhiên",   gradient: "bg-[radial-gradient(circle_at_30%_30%,#f472b6,#be185d)]", ring: false, beamColor: "#ec4899", tagline: "Biến cố tình cờ",   floatClass: "animate-float-2" },
  "Nội dung":    { name: "Tinh Cầu Nội Dung",     gradient: "bg-[radial-gradient(circle_at_30%_30%,#f87171,#b91c1c)]", ring: false, beamColor: "#ef4444", tagline: "Yếu tố cốt lõi",    floatClass: "animate-float-3" },
  "Hình thức":   { name: "Tinh Cầu Hình Thức",    gradient: "bg-[radial-gradient(circle_at_30%_30%,#2dd4bf,#0f766e)]", ring: true,  beamColor: "#14b8a6", tagline: "Cấu trúc liên kết", floatClass: "animate-float-4" },
  "Bản chất":    { name: "Tinh Cầu Bản Chất",     gradient: "bg-[radial-gradient(circle_at_30%_30%,#6366f1,#3730a3)]", ring: false, beamColor: "#6366f1", tagline: "Bên trong ẩn giấu", floatClass: "animate-float-1" },
  "Hiện tượng":  { name: "Tinh Cầu Hiện Tượng",   gradient: "bg-[radial-gradient(circle_at_30%_30%,#38bdf8,#0369a1)]", ring: true,  beamColor: "#06b6d4", tagline: "Biểu hiện ra ngoài", floatClass: "animate-float-2" },
  "Khả năng":    { name: "Tinh Cầu Khả Năng",     gradient: "bg-[radial-gradient(circle_at_30%_30%,#f472b6,#a21caf)]", ring: false, beamColor: "#d946ef", tagline: "Xu hướng phát sinh", floatClass: "animate-float-3" },
  "Hiện thực":   { name: "Tinh Cầu Hiện Thực",    gradient: "bg-[radial-gradient(circle_at_30%_30%,#34d399,#065f46)]", ring: true,  beamColor: "#10b981", tagline: "Thực tế tồn tại",   floatClass: "animate-float-4" },
};

export const SANDBOX_SYNTHESIS: Record<string, string> = {
  "Cái riêng + Cái chung":
    "Cái riêng là từng sự vật, hiện tượng cụ thể với đặc điểm riêng của nó; cái chung là những thuộc tính, mối liên hệ lặp lại ở nhiều cái riêng. Khi phân tích, đừng tách chúng ra: cái chung chỉ biểu hiện thông qua từng cái riêng, còn cái riêng luôn mang trong mình dấu vết của cái chung. Mẹo nhớ: nhìn một ví dụ cụ thể, rồi hỏi nó thuộc nhóm/quy luật chung nào.",
  "Nguyên nhân + Kết quả":
    "Nguyên nhân là sự tác động làm nảy sinh biến đổi; kết quả là biến đổi được tạo ra từ nguyên nhân đó. Quan hệ này không đứng yên một chiều: kết quả sau khi xuất hiện có thể tác động ngược lại nguyên nhân, hoặc trở thành nguyên nhân cho quá trình mới. Mẹo nhớ: luôn hỏi 'vì sao xảy ra?' và 'nó kéo theo điều gì tiếp theo?'.",
  "Tất nhiên + Ngẫu nhiên":
    "Tất nhiên là cái do quy luật bên trong chi phối, sớm muộn sẽ bộc lộ khi đủ điều kiện; ngẫu nhiên là cái xảy ra do sự giao nhau của nhiều điều kiện cụ thể. Cái tất nhiên không xuất hiện trần trụi mà thường đi qua nhiều biến cố ngẫu nhiên. Mẹo nhớ: đừng xem sự tình cờ là vô nghĩa, hãy tìm quy luật đang đi xuyên qua nó.",
  "Nội dung + Hình thức":
    "Nội dung là toàn bộ yếu tố, quá trình và ý nghĩa bên trong của sự vật; hình thức là cách nội dung được tổ chức và biểu hiện ra ngoài. Nội dung giữ vai trò quyết định, nhưng hình thức phù hợp sẽ giúp nội dung phát triển tốt hơn, còn hình thức lỗi thời có thể kìm hãm nội dung. Mẹo nhớ: ý tưởng hay vẫn cần cách trình bày đúng.",
  "Bản chất + Hiện tượng":
    "Hiện tượng là biểu hiện bên ngoài mà ta dễ quan sát; bản chất là mối liên hệ bên trong, tương đối ổn định, quy định sự vận động của sự vật. Hiện tượng có thể phản ánh bản chất, nhưng cũng có thể làm bản chất bị che khuất hoặc bị hiểu sai nếu chỉ nhìn bề mặt. Mẹo nhớ: thấy biểu hiện bên ngoài thì tiếp tục hỏi cơ chế sâu bên trong là gì.",
  "Khả năng + Hiện thực":
    "Khả năng là cái chưa tồn tại thật nhưng có thể xuất hiện khi đủ điều kiện; hiện thực là cái đang tồn tại thực sự. Một hiện thực thường chứa nhiều khả năng khác nhau, và khả năng nào trở thành hiện thực phụ thuộc vào điều kiện khách quan cùng hoạt động thực tiễn của con người. Mẹo nhớ: tiềm năng chỉ thành kết quả khi có điều kiện và hành động.",
};

export const CORE_PRINCIPLES: KnowledgeCard[] = [
  {
    title: "Nguyên lý về mối liên hệ phổ biến",
    description:
      "Mọi sự vật, hiện tượng đều tồn tại trong mạng lưới liên hệ, tác động và quy định lẫn nhau.",
    memoryCue: "Nhìn sự vật như một mạng lưới, không tách rời từng mảnh.",
    color: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    title: "Nguyên lý về sự phát triển",
    description:
      "Thế giới luôn vận động, biến đổi và phát triển thông qua giải quyết mâu thuẫn bên trong.",
    memoryCue: "Không hỏi vật đứng yên ra sao, hãy hỏi nó đang biến đổi thế nào.",
    color: "from-emerald-500 via-teal-500 to-cyan-600",
  },
];

export const DIALECTICAL_LAWS: KnowledgeCard[] = [
  {
    title: "Quy luật lượng - chất",
    description:
      "Sự thay đổi dần về lượng đến điểm nút sẽ tạo ra bước nhảy, làm biến đổi chất của sự vật.",
    memoryCue: "Tích lũy đủ nhiều sẽ tạo bước ngoặt.",
    color: "from-amber-500 via-orange-500 to-red-600",
  },
  {
    title: "Quy luật thống nhất và đấu tranh của các mặt đối lập",
    description:
      "Mâu thuẫn giữa các mặt đối lập là nguồn gốc, động lực bên trong của sự vận động và phát triển.",
    memoryCue: "Mâu thuẫn không chỉ gây xung đột, nó tạo động lực phát triển.",
    color: "from-fuchsia-500 via-purple-500 to-indigo-600",
  },
  {
    title: "Quy luật phủ định của phủ định",
    description:
      "Phát triển diễn ra qua những lần phủ định biện chứng, kế thừa cái hợp lý và tạo trình độ mới cao hơn.",
    memoryCue: "Vượt qua cái cũ nhưng không xóa sạch mọi giá trị của nó.",
    color: "from-rose-500 via-pink-500 to-purple-600",
  },
];

export const CATEGORY_PAIR_GUIDES: KnowledgeCard[] = [
  {
    title: "Cái riêng & Cái chung",
    description: "Cái chung biểu hiện trong từng cái riêng; cái riêng tồn tại trong liên hệ với cái chung.",
    memoryCue: "Một cá thể luôn mang dấu vết của nhóm/lớp mà nó thuộc về.",
    color: "from-blue-600 via-indigo-600 to-violet-700",
  },
  {
    title: "Nguyên nhân & Kết quả",
    description: "Nguyên nhân sinh ra kết quả; kết quả có thể tác động trở lại và trở thành tiền đề mới.",
    memoryCue: "Đừng chỉ hỏi chuyện gì xảy ra, hãy hỏi vì sao và nó kéo theo gì.",
    color: "from-amber-600 via-orange-600 to-red-700",
  },
  {
    title: "Tất nhiên & Ngẫu nhiên",
    description: "Cái tất nhiên thể hiện thông qua vô số cái ngẫu nhiên; ngẫu nhiên bổ sung cho tất nhiên.",
    memoryCue: "Quy luật đi qua nhiều biến cố tưởng như tình cờ.",
    color: "from-purple-600 via-fuchsia-600 to-pink-700",
  },
  {
    title: "Nội dung & Hình thức",
    description: "Nội dung quyết định hình thức; hình thức phù hợp thúc đẩy nội dung phát triển.",
    memoryCue: "Ý nghĩa bên trong cần một cách biểu hiện phù hợp.",
    color: "from-emerald-600 via-teal-600 to-cyan-700",
  },
  {
    title: "Bản chất & Hiện tượng",
    description: "Bản chất bộc lộ qua hiện tượng; hiện tượng có thể phản ánh đúng hoặc che khuất bản chất.",
    memoryCue: "Đừng dừng ở bề mặt, hãy lần ra cơ chế bên trong.",
    color: "from-cyan-600 via-sky-600 to-blue-700",
  },
  {
    title: "Khả năng & Hiện thực",
    description: "Khả năng chuyển thành hiện thực khi có đủ điều kiện và hoạt động thực tiễn phù hợp.",
    memoryCue: "Tiềm năng cần điều kiện để thành kết quả thật.",
    color: "from-rose-600 via-pink-600 to-purple-700",
  },
];
