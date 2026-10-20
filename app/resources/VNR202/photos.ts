// Ảnh tư liệu giữ nguyên nội dung gốc (không tô màu, không tạo bằng AI).
// Mỗi ảnh ghi rõ nơi lưu giữ / công bố gốc (origin), kèm đường dẫn kiểm chứng.
// Giấy phép chỉ ghi với ảnh Creative Commons vì giấy phép đó yêu cầu ghi công.

export interface ArchivePhoto {
  src: string;
  width: number;
  height: number;
  caption: string;
  taken: string;
  origin: string;
  originUrl?: string;
  author?: string;
  license?: string;
  commonsUrl: string;
  note?: string;
  /** Vị trí lấy khung khi cắt ảnh vào khung tròn / thẻ nhỏ (CSS object-position) */
  focus?: string;
}

const base = "/resources/VNR202/images";
const commons = "https://commons.wikimedia.org/wiki/File:";

const hochiminhVn =
  "https://english.hochiminh.vn/photo/ho-chi-minh/documentary-photos-about-president-ho-chi-minh-before-1930-1";
const tongBiThu = "http://tulieuvankien.dangcongsan.vn/lanh-dao-dang-nha-nuoc/tong-bi-thu";
const ttxvnHcm = "Thông tấn xã Việt Nam (TTXVN), công bố trên Cổng thông tin điện tử Hồ Chí Minh";
const tuLieuVanKien = "Trang Tư liệu – Văn kiện, Báo điện tử Đảng Cộng sản Việt Nam";
const varchiv = "Cục Văn thư và Lưu trữ Nhà nước (VARCHIV)";

export const photos = {
  naqTours1920: {
    src: `${base}/naq-tours-1920.jpg`,
    width: 588,
    height: 424,
    caption:
      "Nguyễn Ái Quốc phát biểu tại Đại hội lần thứ XVIII Đảng Xã hội Pháp ở thành phố Tours.",
    taken: "12/1920",
    origin: ttxvnHcm,
    originUrl: hochiminhVn,
    commonsUrl: `${commons}Comrade_Nguyen_Ai_Quoc_at_the_national_congress_of_the_Socialist_Party_of_France_in_the_city_of_Tous,_France_in_December_1920.jpg`,
  },
  naq1923: {
    src: `${base}/naq-1923.jpg`,
    width: 405,
    height: 561,
    caption: "Chân dung Nguyễn Ái Quốc tại Liên Xô.",
    taken: "1923",
    origin: ttxvnHcm,
    originUrl: hochiminhVn,
    commonsUrl: `${commons}Comrade_Nguyen_Ai_Quoc_in_the_Soviet_Union_in_1923.jpg`,
  },
  naqComintern1924: {
    src: `${base}/naq-comintern-1924.jpg`,
    width: 413,
    height: 295,
    caption:
      "Nguyễn Ái Quốc tại diễn đàn Đại hội V Quốc tế Cộng sản ở Mátxcơva.",
    taken: "1924",
    origin: ttxvnHcm,
    originUrl: hochiminhVn,
    commonsUrl: `${commons}Comrade_Nguyen_Ai_Quoc_(1924).jpg`,
  },
  tranPhu: {
    src: `${base}/tran-phu.jpg`,
    width: 960,
    height: 1254,
    caption: "Chân dung đồng chí Trần Phú, Tổng Bí thư đầu tiên của Đảng.",
    taken: "Trước năm 1930",
    origin: tuLieuVanKien,
    originUrl: tongBiThu,
    commonsUrl: `${commons}Tran_Phu.gif`,
  },
  boCao1930: {
    src: `${base}/bo-cao-1930.jpg`,
    width: 960,
    height: 712,
    caption:
      "Bố cáo song song tiếng Pháp, chữ Hán và chữ Quốc ngữ của chính quyền bảo hộ Pháp và triều đình Huế, ban hành để đối phó phong trào Xô viết Nghệ - Tĩnh.",
    taken: "3/9/1930",
    origin: "Văn bản gốc do Tòa Khâm sứ Trung Kỳ và triều đình Huế ban hành",
    commonsUrl: `${commons}Bố_cáo_của_khâm_sứ_Pháp_và_đại_diện_triều_đình_Đại_Nam_(Anhxua.vn).jpg`,
    note: "Đây là văn bản của phía đối phương, cho thấy quy mô của phong trào buộc chính quyền thực dân phải ra bố cáo.",
  },
  leHongPhong: {
    src: `${base}/le-hong-phong.jpg`,
    width: 326,
    height: 500,
    caption: "Chân dung đồng chí Lê Hồng Phong.",
    taken: "Trước năm 1940",
    origin: tuLieuVanKien,
    originUrl: tongBiThu,
    commonsUrl: `${commons}Le_Hong_Phong.gif`,
  },
  haHuyTap: {
    src: `${base}/ha-huy-tap.jpg`,
    width: 336,
    height: 521,
    caption: "Chân dung đồng chí Hà Huy Tập.",
    taken: "Trước năm 1941",
    origin: tuLieuVanKien,
    originUrl: tongBiThu,
    commonsUrl: `${commons}Ha_Huy_Tap.png`,
  },
  nguyenVanCu: {
    src: `${base}/nguyen-van-cu.jpg`,
    width: 336,
    height: 496,
    caption: "Chân dung đồng chí Nguyễn Văn Cừ.",
    taken: "Trước năm 1941",
    origin: tuLieuVanKien,
    originUrl: tongBiThu,
    commonsUrl: `${commons}Nguyen_Van_Cu.gif`,
  },
  cocBo: {
    src: `${base}/coc-bo.jpg`,
    width: 960,
    height: 541,
    caption:
      "Hang Cốc Bó (Pác Bó, Cao Bằng), nơi Nguyễn Ái Quốc ở và làm việc sau khi về nước năm 1941.",
    taken: "8/1/2016 (ảnh hiện trạng di tích)",
    origin: "Ảnh chụp tại Khu di tích quốc gia đặc biệt Pác Bó",
    author: "Tycho (shansov.net)",
    license: "CC BY-SA 3.0",
    commonsUrl: `${commons}Cốc_Bó.jpg`,
    note: "Ảnh chụp di tích ngày nay, không phải ảnh năm 1941.",
  },
  truongChinhHoaLo: {
    focus: "78% 40%",
    src: `${base}/truong-chinh-hoa-lo.jpg`,
    width: 960,
    height: 640,
    caption:
      "Ảnh căn cước của đồng chí Trường Chinh (tên khai sinh Đặng Xuân Khu) trong hồ sơ nhà tù Hỏa Lò sau khi bị thực dân Pháp bắt.",
    taken: "Giai đoạn 1930 – 1936",
    origin:
      "Hồ sơ nhà tù Hỏa Lò của chính quyền thực dân Pháp; hiện vật trưng bày trong triển lãm về Tổng Bí thư Trường Chinh (VnExpress đưa tin)",
    originUrl: "https://vnexpress.net/trung-bay-hon-200-ky-vat-ve-tong-bi-thu-truong-chinh-3530990.html",
    commonsUrl: `${commons}Truong_Chinh_mugshot.jpg`,
  },
  nhaHatLon1945: {
    src: `${base}/nha-hat-lon-17-8-1945.jpg`,
    width: 960,
    height: 583,
    caption:
      "Cuộc mít tinh trước Nhà hát Lớn Hà Nội ngày 17/8/1945, hai ngày trước khi Hà Nội giành chính quyền.",
    taken: "17/8/1945",
    origin: varchiv,
    commonsUrl: `${commons}Rencontre_au_Grand_Opéra_de_Hanoï_le_17_août_1945.jpg`,
  },
  baDinh1945: {
    src: `${base}/ba-dinh-2-9-1945.jpg`,
    width: 628,
    height: 855,
    caption:
      "Lễ đài tại Quảng trường Ba Đình, nơi Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập.",
    taken: "2/9/1945",
    origin: varchiv,
    commonsUrl: `${commons}Président_Ho-chi-Minh_lit_la_Proclamation-d'indépendance_sur_la_place_Ba-dinh_le_2nd_Sep_1945.jpg`,
  },
  hcmVng1945: {
    focus: "72% 30%",
    src: `${base}/hcm-vng-2-9-1945.jpg`,
    width: 440,
    height: 592,
    caption:
      "Chủ tịch Hồ Chí Minh và đồng chí Võ Nguyên Giáp trên xe tại Quảng trường Ba Đình (ảnh có bút tích lời chào của Chủ tịch Hồ Chí Minh).",
    taken: "2/9/1945",
    origin: "Báo Thái Bình",
    originUrl:
      "https://www.wp.baothaibinh.com.vn/tin-tuc/45/1609/buc-anh-co-mot-khong-hai-ve-cu-ho-va-tuong-giap-1609",
    author: "Nghệ sĩ nhiếp ảnh Võ An Ninh",
    commonsUrl: `${commons}Ho_Chi_Minh_and_Vo_Nguyen_Giap,_Sept._2,_1945.jpg`,
  },
  hiepDinhSoBo1946: {
    src: `${base}/hiep-dinh-so-bo-1946.jpg`,
    width: 960,
    height: 640,
    caption:
      "Lễ ký Hiệp định Sơ bộ. Từ trái sang: Chủ tịch Hồ Chí Minh, Hoàng Minh Giám, Jean Sainteny, Léon Pignon và Louis Caput.",
    taken: "6/3/1946",
    origin: "Báo Thế giới & Việt Nam (Bộ Ngoại giao)",
    originUrl:
      "https://baoquocte.vn/hiep-dinh-so-bo-631946-qua-hoi-ky-cua-co-bo-truong-hoang-minh-giam-ky-1-138305.html",
    commonsUrl: `${commons}Ho–Sainteny_agreement,_March_6,_1946.jpg`,
  },
  fontainebleau1946: {
    src: `${base}/fontainebleau-1946.jpg`,
    width: 500,
    height: 321,
    caption:
      "Phái đoàn Chính phủ Việt Nam Dân chủ Cộng hòa tại Hội nghị Fontainebleau (Pháp); Bộ trưởng Nguyễn Văn Huyên ngồi thứ hai từ trái sang.",
    taken: "1946",
    origin: "Nhà lưu niệm Bộ trưởng Nguyễn Văn Huyên",
    originUrl: "https://nguyenvanhuyen.org.vn/trung-bay/dau-an-cua-bo-truong/",
    commonsUrl: `${commons}Bộ_trưởng_Nguyễn_Văn_Huyên_(thứ_hai,_từ_trái_sang)_trong_phái_đoàn_Chính_phủ_Việt_Nam_đàm_phán_tại_Fontainebleau_(Pháp)_năm_1946.jpg`,
  },
  daiHoi2: {
    src: `${base}/dai-hoi-2-1951.jpg`,
    width: 480,
    height: 469,
    caption:
      "Đại hội đại biểu toàn quốc lần thứ II của Đảng tại Chiêm Hóa, Tuyên Quang.",
    taken: "2/1951",
    origin: "Bảo tàng Lịch sử Quốc gia",
    originUrl:
      "https://baotanglichsu.vn/vi/Articles/2002/67964/djai-hoi-djai-bieu-toan-quoc-lan-thu-ii-11-19-2-1951.html",
    commonsUrl: `${commons}ICP_1951a,_second_Party_Congress.gif`,
  },
  dienBienPhu1954: {
    src: `${base}/dien-bien-phu-1954.jpg`,
    width: 960,
    height: 583,
    caption:
      "Lá cờ “Quyết chiến quyết thắng” tung bay trên nóc hầm chỉ huy của tướng De Castries.",
    taken: "5/1954",
    origin: "Hệ thống Bảo tàng Quân đội nhân dân Việt Nam",
    commonsUrl: `${commons}Victory_in_Battle_of_Dien_Bien_Phu.jpg`,
    note: "Theo nhiều tư liệu, đây là cảnh được quay, chụp tái hiện ngay sau trận đánh trong phim tài liệu của đạo diễn Liên Xô Roman Karmen. Sự kiện chiến thắng chiều 7/5/1954 là có thật; bức ảnh là cảnh dựng lại.",
  },
  geneve1954: {
    src: `${base}/geneve-1954.jpg`,
    width: 960,
    height: 762,
    caption:
      "Phiên họp toàn thể cuối cùng về Đông Dương tại Cung Quốc liên, Genève; phía trước là phái đoàn Việt Nam Dân chủ Cộng hòa.",
    taken: "21/7/1954",
    origin: "Hãng thông tấn Associated Press (AP)",
    commonsUrl: `${commons}1stIndochinaWar003.jpg`,
  },
  leDuan1951: {
    src: `${base}/le-duan-1951.jpg`,
    width: 823,
    height: 1200,
    caption: "Chân dung đồng chí Lê Duẩn.",
    taken: "1951",
    origin:
      "Sách “The Vietnam War: An Intimate History” (G. C. Ward & K. Burns, NXB Knopf, 2017)",
    commonsUrl: `${commons}Le_Duan.jpg`,
  },
  coMatTran: {
    src: `${base}/co-mat-tran-dtgp.png`,
    width: 960,
    height: 640,
    caption:
      "Lá cờ của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam: nửa trên đỏ, nửa dưới xanh, sao vàng ở giữa.",
    taken: "Hình vẽ lại theo mẫu cờ",
    origin: "Hình đồ họa vẽ theo mẫu cờ của Mặt trận",
    commonsUrl: `${commons}Flag_of_the_National_Liberation_Front_of_South_Vietnam,_Flag_of_South_Vietnam_(1975–1976).svg`,
    note: "Đây là hình vẽ đồ họa theo đúng mẫu cờ, không phải ảnh chụp.",
  },
  hue1968: {
    src: `${base}/hue-1968.jpg`,
    width: 960,
    height: 1357,
    caption:
      "Người dân Huế vượt sông Hương bên cầu Trường Tiền bị đánh sập để rời khu vực giao tranh.",
    taken: "1968",
    origin: "Cục Lưu trữ Quốc gia Hoa Kỳ (NARA), mã lưu trữ 541870",
    originUrl: "https://catalog.archives.gov/id/541870",
    commonsUrl: `${commons}The_old_and_the_young_flee_Tet_offensive_fighting_in_Hue,_managing_to_reach_the_south_shore_of_the_Perfume_River_despite_-_NARA_-_541870.tif`,
  },
  paris1973: {
    src: `${base}/paris-1973.jpg`,
    width: 960,
    height: 651,
    caption:
      "Ngoại trưởng Hoa Kỳ William Rogers ký Hiệp định Paris tại khách sạn Majestic.",
    taken: "27/1/1973",
    origin: "Văn phòng Nhiếp ảnh Nhà Trắng, lưu tại Cục Lưu trữ Quốc gia Hoa Kỳ (NARA), mã 194482",
    originUrl: "https://catalog.archives.gov/id/194482",
    author: "Robert L. Knudsen",
    commonsUrl: `${commons}Vietnam_peace_agreement_signing.jpg`,
    note: "Ảnh chụp màu gốc, không phải ảnh được tô màu lại.",
  },
  xeTang843: {
    src: `${base}/xe-tang-843.jpg`,
    width: 960,
    height: 474,
    caption:
      "Xe tăng T-54B số hiệu 843, một trong hai xe tăng đầu tiên tiến vào Dinh Độc Lập trưa 30/4/1975, nay trưng bày tại Bảo tàng Lịch sử Quân sự Việt Nam.",
    taken: "3/4/2025 (ảnh hiện vật)",
    origin: "Ảnh chụp hiện vật tại Bảo tàng Lịch sử Quân sự Việt Nam",
    author: "kitmasterbloke (Flickr)",
    license: "CC BY 2.0",
    commonsUrl: `${commons}843_T-54B_tank_-_one_of_two_that_breached_the_Independence_Palace_30th_April_1975.jpg`,
    note: "Ảnh chụp hiện vật gốc trong bảo tàng, không phải ảnh năm 1975.",
  },
  nguyenVanLinh1986: {
    focus: "50% 22%",
    src: `${base}/nguyen-van-linh-1986.jpg`,
    width: 960,
    height: 1505,
    caption: "Đồng chí Nguyễn Văn Linh, Tổng Bí thư được bầu tại Đại hội VI.",
    taken: "12/1986",
    origin: "Hãng thông tấn Associated Press (AP)",
    commonsUrl: `${commons}Nguyen_Van_Linh_1986.jpg`,
  },
  hcmBerlin1957: {
    focus: "62% 22%",
    src: `${base}/hcm-berlin-1957.jpg`,
    width: 503,
    height: 800,
    caption:
      "Chủ tịch Hồ Chí Minh và Chủ tịch nước Cộng hòa Dân chủ Đức Wilhelm Pieck trong chuyến thăm Berlin.",
    taken: "25/7/1957",
    origin: "Cục Lưu trữ Liên bang Đức (Bundesarchiv), Bild 183-48539-0002",
    author: "Walter Heilig (ADN-Zentralbild)",
    license: "CC BY-SA 3.0 DE",
    commonsUrl: `${commons}Bundesarchiv_Bild_183-48539-0002,_Berlin,_Besuch_Ho_Chi_Minh_bei_Wilhelm_Pieck.jpg`,
  },
  loiKeuGoi: {
    src: `${base}/loi-keu-goi-ban-thao.jpg`,
    width: 960,
    height: 737,
    caption:
      "Bản thảo viết tay “Lời kêu gọi toàn quốc kháng chiến” của Chủ tịch Hồ Chí Minh, Bảo vật quốc gia.",
    taken: "12/1946",
    origin: varchiv,
    originUrl:
      "https://luutru.gov.vn/cong-bo-gioi-thieu-tai-lieu/ban-thao-viet-tay-%E2%80%9Cloi-keu-goi-toan-quoc-khang-chien%E2%80%9D-cua-chu-tich-ho-chi-minh.htm",
    commonsUrl: `${commons}Bản_thảo_gốc_“Lời_kêu_gọi_toàn_quốc_kháng_chiến”_của_Chủ_tịch_Hồ_Chí_Minh_–_Bảo_vật_quốc_gia.jpg`,
  },
  camTuQuan1946: {
    src: `${base}/cam-tu-quan-1946.jpg`,
    width: 640,
    height: 452,
    caption: "Chiến sĩ cảm tử quân ôm bom ba càng chiến đấu trên đường phố Hà Nội.",
    taken: "1946 – 1947",
    origin: "Bảo tàng Lịch sử Quốc gia",
    originUrl:
      "https://baotanglichsu.vn/vi/Articles/3096/72763/loi-keu-goi-toan-quoc-khang-chien-ket-tinh-va-lan-toa-suc-manh-chinh-tri-tinh-than-dan-toc.html",
    commonsUrl: `${commons}Cảm_tử_quân_ôm_bom_ba_càng_chiến_đấu_trên_đường_phố_Hà_Nội_(1946).jpg`,
  },
  duongKachMenh: {
    src: `${base}/duong-kach-menh.jpg`,
    width: 960,
    height: 720,
    caption:
      "Bản in gốc tác phẩm “Đường Kách mệnh” (1927), tập hợp bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện ở Quảng Châu; Bảo vật quốc gia.",
    taken: "8/2/2017 (ảnh hiện vật)",
    origin: "Ảnh chụp hiện vật trưng bày tại Bảo tàng Lịch sử Quốc gia",
    author: "Hoangkid",
    commonsUrl: `${commons}Duong_Kach_Menh_(Original).jpg`,
    focus: "50% 40%",
  },
  thanhNien1925: {
    src: `${base}/thanh-nien-1925.jpg`,
    width: 960,
    height: 639,
    caption:
      "Lý Tự Trọng cùng học viên Việt Nam trường Quân sự Hoàng Phố và cán bộ Tổng bộ Hội Việt Nam Cách mạng Thanh niên viếng mộ liệt sĩ Phạm Hồng Thái (Quảng Châu).",
    taken: "1925",
    origin: "Bảo tàng Tuổi trẻ Việt Nam",
    originUrl:
      "https://baotangtuoitre.vn/2024/07/26/giai-doan-1911-1945-tuoi-tre-viet-nam-khat-vong-doc-lap-thong-nhat-non-song-1/",
    commonsUrl: `${commons}Vietnamese_revolutionaries_in_China,_1925.jpg`,
  },
  diChuc1969: {
    src: `${base}/di-chuc-1969.jpg`,
    width: 666,
    height: 960,
    caption:
      "Trang Di chúc viết tay năm 1969 của Chủ tịch Hồ Chí Minh, có phần sửa đoạn mở đầu.",
    taken: "10/5/1969",
    origin: "Ban Quản lý Lăng Chủ tịch Hồ Chí Minh",
    originUrl:
      "https://bqllang.gov.vn/chu-tich-ho-chi-minh/tac-pham/8930-di-chuc-cua-chu-tich-ho-chi-minh-qua-cac-nam.html",
    commonsUrl: `${commons}Ho_Chi_Minh%27s_will_1969_handwriting_version_correcting_the_opening.png`,
    focus: "50% 15%",
  },
  hienPhap1946: {
    src: `${base}/hien-phap-1946.jpg`,
    width: 744,
    height: 552,
    caption:
      "Bản Hiến pháp đầu tiên của nước Việt Nam Dân chủ Cộng hòa, được Quốc hội thông qua ngày 9/11/1946.",
    taken: "1946",
    origin: varchiv,
    originUrl: "https://luutru.gov.vn/su-ra-doi-cua-cac-ban-hien-phap-qua-tai-lieu-luu-tru.htm",
    commonsUrl: `${commons}Hiến_pháp_Việt_Nam_Dân_chủ_Cộng_hòa_năm_1946_-_Cục_Văn_thư_và_Lưu_trữ_nhà_nước.jpg`,
  },
  chinhPhu1946: {
    src: `${base}/chinh-phu-1946.jpg`,
    width: 960,
    height: 640,
    caption: "Các thành viên Chính phủ Việt Nam Dân chủ Cộng hòa do Quốc hội khóa I bầu ra.",
    taken: "1946",
    origin: "Trung tâm Lưu trữ Quốc gia III, công bố trên trang của Cục Văn thư và Lưu trữ Nhà nước",
    originUrl:
      "https://luutru.gov.vn/cong-bo-gioi-thieu-tai-lieu/mot-so-tai-lieu-luu-tru-ve-bo-truong-dai-su-le-van-hien.htm",
    commonsUrl: `${commons}Các_vị_trong_Chính_phủ_Việt_Nam_Dân_chủ_Cộng_hòa_do_Quốc_hội_khóa_I_bầu,_năm_1946_(đồng_chí_Lê_Văn_Hiến,_đứng_hàng_thứ_2,_người_thứ_3_từ_phải_sang).jpg`,
  },
  kissingerLeDucTho: {
    src: `${base}/kissinger-le-duc-tho.jpg`,
    width: 500,
    height: 323,
    caption:
      "Hai đoàn đàm phán do Cố vấn đặc biệt Lê Đức Thọ và Cố vấn Henry Kissinger dẫn đầu tại Paris, ngày ký tắt văn bản Hiệp định.",
    taken: "23/1/1973",
    origin: "Văn phòng Sử học, Bộ Ngoại giao Hoa Kỳ",
    originUrl: "https://history.state.gov/conferences/2010-southeast-asia/photos",
    commonsUrl: `${commons}Le_duc_Tho_and_Henry_Kissinger_White_House_photo.jpg`,
  },
  apBac1963: {
    src: `${base}/ap-bac-1963.jpg`,
    width: 578,
    height: 283,
    caption: "Trực thăng CH-21 của Mỹ bị bắn rơi trong trận Ấp Bắc.",
    taken: "1/1963",
    origin: "Quân đội Hoa Kỳ – Bảo tàng Vận tải Lục quân Hoa Kỳ",
    commonsUrl: `${commons}Downed_choppers_at_Ap_Bac.jpg`,
  },
  dongKhe1950: {
    src: `${base}/dong-khe-1950.jpg`,
    width: 909,
    height: 960,
    caption: "Chủ tịch Hồ Chí Minh quan sát mặt trận Đông Khê trong Chiến dịch Biên giới.",
    taken: "9/1950",
    origin:
      "In trong sách “Geschichte Vietnams” của Jean Chesneaux (NXB Rütten & Loening, Berlin, 1963)",
    commonsUrl: `${commons}Ho_Chi_Minh_in_Dong_Khe,_1950.jpg`,
    focus: "50% 25%",
  },
  dinhTanTrao: {
    src: `${base}/dinh-tan-trao.jpg`,
    width: 960,
    height: 640,
    caption: "Đình Tân Trào (Sơn Dương, Tuyên Quang), nơi họp Quốc dân Đại hội 16/8/1945.",
    taken: "13/4/2016 (ảnh hiện trạng di tích)",
    origin: "Ảnh chụp tại Khu di tích quốc gia đặc biệt Tân Trào",
    author: "Bùi Thụy Đào Nguyên",
    license: "CC BY-SA 4.0",
    commonsUrl: `${commons}Đình_Tân_Trào.jpg`,
    note: "Ảnh chụp di tích ngày nay, không phải ảnh năm 1945.",
  },
  cayDaTanTrao: {
    src: `${base}/cay-da-tan-trao.jpg`,
    width: 960,
    height: 720,
    caption: "Cây đa Tân Trào, nơi Giải phóng quân làm lễ xuất phát ngày 16/8/1945.",
    taken: "12/12/2008 (ảnh hiện trạng di tích)",
    origin: "Ảnh chụp tại Khu di tích quốc gia đặc biệt Tân Trào",
    author: "Liftold",
    license: "CC BY-SA 3.0",
    commonsUrl: `${commons}Cây_Đa_lịch_sử_Tân_Trào.JPG`,
    note: "Ảnh chụp di tích ngày nay.",
  },
  atkDinhHoa: {
    src: `${base}/atk-dinh-hoa.jpg`,
    width: 960,
    height: 720,
    caption:
      "Khu di tích An toàn khu (ATK) Định Hóa, Thái Nguyên, một trong những nơi đặt cơ quan đầu não kháng chiến.",
    taken: "19/11/2009 (ảnh hiện trạng di tích)",
    origin: "Ảnh chụp tại Khu di tích ATK Định Hóa",
    author: "Minhminh284",
    license: "CC BY-SA 3.0",
    commonsUrl: `${commons}ATK_DINH_HOA.JPG`,
    note: "Ảnh chụp di tích ngày nay.",
  },
  b52HuuTiep: {
    src: `${base}/b52-huu-tiep.jpg`,
    width: 960,
    height: 722,
    caption:
      "Xác máy bay B-52 bị bắn rơi tháng 12/1972, còn nằm tại hồ Hữu Tiệp (Ba Đình, Hà Nội).",
    taken: "6/2/2012 (ảnh di tích)",
    origin: "Ảnh chụp di tích hồ Hữu Tiệp, Hà Nội",
    author: "calflier001 (Flickr)",
    license: "CC BY-SA 2.0",
    commonsUrl: `${commons}B52_WRECKAGE_B52_VICTORY_CENTRE_HUU_TIEP_LAKE_BA_DINH_DISTRICT_HANOI_FEB_2012_(6817999066).jpg`,
    note: "Ảnh chụp di tích ngày nay, không phải ảnh năm 1972.",
  },
  doMuoi1995: {
    src: `${base}/do-muoi-1995.jpg`,
    width: 165,
    height: 247,
    caption: "Tổng Bí thư Đỗ Mười trong chuyến thăm Nhật Bản.",
    taken: "4/1995",
    origin: "Lưu trữ Quốc gia Nhật Bản – Văn phòng Nội các Nhật Bản",
    originUrl: "http://www.archives.go.jp/event/jp_vn45/english/ch04.html",
    license: "CC BY 4.0",
    commonsUrl: `${commons}Mr._Do_Muoi.jpg`,
  },
  nongDucManh2010: {
    src: `${base}/nong-duc-manh-2010.jpg`,
    width: 720,
    height: 960,
    caption: "Tổng Bí thư Nông Đức Mạnh trong chuyến thăm Liên bang Nga.",
    taken: "9/7/2010",
    origin: "Văn phòng Báo chí Tổng thống Nga (kremlin.ru)",
    license: "CC BY 4.0",
    commonsUrl: `${commons}Nong_Duc_Manh_2010.jpg`,
    focus: "50% 25%",
  },
  nguyenPhuTrong2014: {
    src: `${base}/nguyen-phu-trong-2014.jpg`,
    width: 960,
    height: 592,
    caption: "Tổng Bí thư Nguyễn Phú Trọng trong chuyến thăm Liên bang Nga.",
    taken: "25/11/2014",
    origin: "Văn phòng Báo chí Tổng thống Nga (kremlin.ru)",
    originUrl: "http://en.kremlin.ru/events/president/transcripts/47075/photos",
    license: "CC BY 4.0",
    commonsUrl: `${commons}Nguyen_Phu_Trong_3.jpg`,
    focus: "45% 30%",
  },
  nguyenPhuTrong2018: {
    src: `${base}/nguyen-phu-trong-2018.jpg`,
    width: 491,
    height: 644,
    caption: "Tổng Bí thư Nguyễn Phú Trọng trong chuyến thăm chính thức Liên bang Nga.",
    taken: "6/9/2018",
    origin: "Văn phòng Báo chí Tổng thống Nga (kremlin.ru)",
    originUrl: "http://kremlin.ru/events/president/news/58472",
    license: "CC BY 4.0",
    commonsUrl: `${commons}Nguyen_Phu_Trong_2.jpg`,
    focus: "50% 25%",
  },
  leDuan1978: {
    src: `${base}/le-duan-1978.jpg`,
    width: 232,
    height: 323,
    caption: "Tổng Bí thư Lê Duẩn.",
    taken: "5/1978",
    origin: "Lưu trữ Quốc gia Romania (Fototeca online a comunismului românesc, ảnh BA397)",
    originUrl: "http://fototeca.iiccr.ro/",
    commonsUrl: `${commons}Le_Duan(cropped).jpg`,
    focus: "50% 30%",
  },
} satisfies Record<string, ArchivePhoto>;
