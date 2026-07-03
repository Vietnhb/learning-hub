# Audit logic game MLN122 theo C. Mác và theo thực tế

Tài liệu này audit riêng phần mô hình kinh tế của game "Nông trang tô điền". Mục tiêu không phải làm game thành mô hình kinh tế lượng hoàn chỉnh, mà kiểm tra xem game có đang dạy sai các phạm trù chính của kinh tế chính trị Mác hay không, đồng thời chỉ ra các điểm còn đơn giản hóa so với thực tế.

## Kết luận ngắn

Lõi mô hình hiện tại **đúng ở khung khái niệm chính của C. Mác**:

- Lao động sống tạo giá trị mới.
- Tiền lương công nhân và quản lý sản xuất thuê ngoài là vốn khả biến.
- Hạt giống, công cụ, máy móc, AI được xử lý như vốn bất biến.
- Giá trị thặng dư là phần giá trị mới vượt quá tiền lương.
- Đất tốt hoặc đầu tư thâm canh tạo lợi nhuận phụ trội.
- Nhà tư bản nông nghiệp giữ lợi nhuận bình quân.
- Phần vượt lợi nhuận bình quân có thể chuyển thành địa tô cho địa chủ.

Điểm đã phải chỉnh lại sau audit: UI và lời giải thích trước đó dễ làm người chơi hiểu `absoluteRent` là "khoản cố định theo lô". Trong code hiện tại, nó không chỉ là mức cố định. Nó là **tô tuyệt đối thực trả**, gồm mức tô cơ sở do quyền sở hữu đất và phần lợi nhuận vượt bình quân chưa phân vào tô vi phân.

Với đầu tư mặc định, game hiện **không còn làm đất xấu giúp nhà tư bản giữ nhiều lợi nhuận hơn**. Cả ba loại đất đều kéo phần tư bản giữ lại về lợi nhuận bình quân `77c`; khác nhau nằm ở sản lượng, lợi nhuận phụ trội và địa tô.

## Công thức đang chạy

Nguồn chính: `app/resources/MLN122/core/game-model.ts`.

### 1. Vốn bất biến

```text
Vốn bất biến = hạt giống + công cụ + AI
```

Trong game:

- Hạt giống: `28c` mỗi phần.
- Công cụ: `42c` mỗi công cụ.
- Robot AI: `110c` nếu bật.

Đánh giá theo Mác: đúng hướng với hạt giống, công cụ, máy móc và AI. Chúng là tư liệu sản xuất hoặc công nghệ đã kết tinh lao động quá khứ, nên trong game chỉ chuyển giá trị cũ và nâng năng suất; chúng không tự tạo giá trị mới.

### 2. Vốn khả biến

```text
Vốn khả biến = số công nhân x 45c + quản lý sản xuất nếu thuê
```

Trong game:

- Công nhân: `45c` mỗi người.
- Quản lý sản xuất: `70c` nếu bật.

Đánh giá theo Mác: đúng hướng. Tiền lương là khoản mua sức lao động. Trong game, nút quản lý phải hiểu là **quản lý sản xuất làm thuê**, tham gia tổ chức quá trình lao động tập thể; vì vậy khoản lương đó thuộc vốn khả biến chứ không phải vốn bất biến. Nếu hiểu quản lý như chức năng giám sát/cai quản đại diện cho quyền lực tư bản thì không nên cho nó tạo giá trị mới; đó không phải nghĩa game đang dùng.

### 3. Giá trị mới do lao động sống

```text
Giá trị lao động sống = số công nhân x 88c + giá trị lao động quản lý sản xuất nếu thuê
```

Đánh giá theo Mác: đúng về mặt phạm trù nếu hiểu quản lý là quản lý sản xuất thuê ngoài thuộc "người lao động tập thể". Game cố định mỗi công nhân tạo `88c` giá trị mới để dễ học; quản lý sản xuất cũng được mô phỏng là lao động sống và cộng `88c` khi bật. Thực tế thì giá trị mới phụ thuộc thời gian lao động xã hội cần thiết, trình độ kỹ thuật, cường độ lao động và điều kiện thị trường.

### 4. Giá trị thặng dư

```text
Giá trị thặng dư = giá trị lao động sống - vốn khả biến
```

Với mặc định 4 công nhân:

```text
Giá trị lao động sống = 4 x 88c = 352c
Vốn khả biến = 4 x 45c = 180c
Giá trị thặng dư = 172c
```

Đánh giá theo Mác: đúng. Đây là điểm quan trọng nhất của mô hình.

### 5. Sản lượng

```text
Sản lượng = công nhân x 28 đơn vị x hệ số năng suất
```

Hệ số năng suất gồm:

- Độ phì nhiêu đất.
- Lợi thế thị trường/vị trí.
- Hạt giống.
- Công cụ.
- Lao động quản lý sản xuất.
- AI.

Đánh giá theo Mác: dùng được cho mô phỏng. Nhưng theo thực tế, vị trí gần chợ thường ảnh hưởng đến chi phí vận chuyển hoặc giá bán ròng, không nhất thiết làm tăng sản lượng vật chất. Game đang gộp vị trí vào hệ số năng suất cho dễ nhìn.

### 6. Giá trị hàng hóa

```text
Giá trị hàng hóa = vốn bất biến + giá trị lao động sống
```

Đánh giá theo Mác: đúng với khung "giá trị cũ được chuyển vào sản phẩm + giá trị mới do lao động sống tạo ra".

### 7. Giá trị thị trường và lợi nhuận phụ trội

Game lấy đất xấu làm mốc giá trị thị trường một đơn vị sản lượng:

```text
Giá thị trường mỗi bao = giá trị hàng hóa của lô đất xấu tối thiểu / sản lượng của lô đất xấu tối thiểu
Lợi nhuận phụ trội = giá trị thị trường của sản lượng hiện tại - giá trị hàng hóa hiện tại
```

Đánh giá theo Mác: hợp lý ở mức mô phỏng địa tô vi phân. Trong lý luận địa tô vi phân, điều kiện sản xuất xấu hơn có thể góp phần quyết định giá thị trường, nhờ đó đất tốt thu lợi nhuận phụ trội.

Điểm cần nhớ: `Đất trung bình` trong UI chỉ là mức giữa để người chơi so sánh trực quan. Mốc giá thị trường thật trong code là `Đất xấu`.

### 8. Lợi nhuận bình quân

```text
Lợi nhuận bình quân = 22% x tổng vốn ứng trước
```

Game giới hạn:

```text
Nếu lợi nhuận trước địa tô thấp hơn mức này, lợi nhuận bình quân = lợi nhuận trước địa tô
```

Đánh giá theo Mác: đúng về ý tưởng nhưng đơn giản hóa. Trong Mác, lợi nhuận bình quân hình thành qua cạnh tranh giữa các ngành và chuyển hóa giá trị thặng dư thành lợi nhuận bình quân. Game dùng tỷ lệ cố định `22%` để người học thấy được ý: nhà tư bản chỉ cần mức lợi nhuận bình quân để tiếp tục sản xuất.

### 9. Ngân sách địa tô

```text
Ngân sách địa tô = lợi nhuận trước địa tô - lợi nhuận bình quân
```

Đánh giá theo Mác: đúng với mục tiêu dạy địa tô. Địa chủ có thể chiếm phần lợi nhuận vượt bình quân nhờ độc quyền sở hữu ruộng đất.

### 10. Tô vi phân I

Tô vi phân I đến từ ưu thế tự nhiên hoặc vị trí của lô đất so với đất xấu.

Đánh giá theo Mác: đúng. Đất tốt tạo nhiều sản phẩm hơn với cùng một lượng lao động, từ đó có lợi nhuận phụ trội.

### 11. Tô vi phân II

Tô vi phân II đến từ đầu tư bổ sung trên cùng một lô đất.

Đánh giá theo Mác: đúng hơn sau khi loại hạt giống và quản lý sản xuất khỏi phần phân loại tô vi phân II. Hạt giống là đầu vào thường xuyên của vụ mùa và thuộc vốn bất biến, nên game vẫn cho nó tăng sản lượng nhưng không tách riêng thành tô vi phân II. Quản lý sản xuất thuê ngoài là lao động sống thuộc vốn khả biến, nên cũng không được gom vào tô vi phân II. Phần tô vi phân II trong game chỉ còn đến từ công cụ hoặc AI làm tăng năng suất trên cùng lô đất. Thực tế cần xét thêm khấu hao, thời hạn thuê, ai sở hữu cải tiến, và địa chủ có tăng tô khi tái ký hợp đồng hay không.

### 12. Tô tuyệt đối

Trong code, `plot.absoluteRent` là **mức tô cơ sở** của từng lô:

```text
Đất tốt: 90c
Đất trung bình: 60c
Đất xấu: 35c
```

Nhưng `result.absoluteRent` là **tô tuyệt đối thực trả**, không phải lúc nào cũng bằng bảng trên.

Logic hiện tại:

```text
1. Tính phần vượt lợi nhuận bình quân.
2. Giữ trước một mức tô cơ sở theo lô đất.
3. Phần còn lại phân cho tô vi phân I và II theo nguồn lợi nhuận phụ trội.
4. Nếu vẫn còn phần vượt bình quân chưa phân loại vào tô vi phân, quy về tô tuyệt đối.
```

Đánh giá theo Mác: dùng được cho mục tiêu học tập. Nó phản ánh ý: quyền sở hữu đất có thể chặn quá trình bình quân hóa lợi nhuận và giữ lại một khoản địa tô ngay cả trên đất xấu. Tuy nhiên, cách quy toàn bộ phần vượt bình quân chưa phân loại vào tô tuyệt đối là một quyết định mô phỏng, không phải công thức kinh tế lượng nguyên văn của Mác.

## Kiểm tra số với đầu tư mặc định

Đầu tư mặc định:

```text
Công nhân: 4
Hạt giống: 3
Công cụ: 2
Quản lý: không
AI: không
Vốn bất biến: 168c
Vốn khả biến: 180c
Tổng vốn ứng trước: 348c
Giá trị thặng dư: 172c
Lợi nhuận bình quân: 77c
```

Kết quả audit:

| Đất            |  Sản lượng | Doanh thu | Lợi nhuận phụ trội | Tô tuyệt đối thực trả | Tô vi phân I | Tô vi phân II | Tổng địa tô | Tư bản giữ |
| -------------- | ---------: | --------: | -----------------: | --------------------: | -----------: | ------------: | ----------: | ---------: |
| Đất tốt        | 235 đơn vị |     1255c |               735c |                   95c |         713c |           22c |        830c |        77c |
| Đất trung bình | 140 đơn vị |      748c |               228c |                   95c |         228c |            0c |        323c |        77c |
| Đất xấu        |  89 đơn vị |      520c |                 0c |                   95c |           0c |            0c |         95c |        77c |

Kết luận từ bảng:

- Đất tốt không làm tư bản giữ nhiều hơn, vì phần phụ trội bị chuyển thành địa tô.
- Đất xấu không làm tư bản giữ nhiều hơn, vì phần tư bản giữ vẫn là lợi nhuận bình quân `77c`.
- Đất tốt làm địa chủ nhận nhiều hơn, vì có tô vi phân I và II.
- Đất xấu vẫn có tô tuyệt đối thực trả, vì còn phần giá trị thặng dư vượt lợi nhuận bình quân.

## Trả lời thẳng câu "đất xấu kiếm nhiều lợi nhuận hơn cho tư bản à?"

Không, theo mô hình hiện tại thì **không**.

Nếu cùng đầu tư mặc định, nhà tư bản giữ:

```text
Đất tốt: 77c
Đất trung bình: 77c
Đất xấu: 77c
```

Điều khác nhau là:

```text
Đất tốt: địa chủ nhận rất nhiều địa tô do lợi thế đất.
Đất xấu: địa chủ chỉ nhận phần tô tuyệt đối từ phần vượt lợi nhuận bình quân.
```

Trước khi sửa, cách phân bổ địa tô có thể làm người chơi thấy đất xấu "dễ giữ tiền hơn". Sau audit, logic hiện tại đã kéo tư bản về lợi nhuận bình quân để tránh hiểu sai đó.

## Các điểm đúng theo C. Mác

### Đúng 1: Nguồn giá trị mới là lao động sống

Game không cho AI, công cụ, hạt giống tự tạo giá trị thặng dư. Chúng chỉ làm tăng sản lượng và năng suất. Đây là đúng với khung Mác.

### Đúng 2: Vốn bất biến và vốn khả biến được tách rõ

Tiền lương công nhân nằm ở vốn khả biến. Hạt giống, công cụ, máy móc nằm ở vốn bất biến. Đây là đúng về phạm trù.

### Đúng 3: Đất tốt không tự sinh giá trị

Đất tốt làm cùng một lượng lao động tạo nhiều sản phẩm hơn, từ đó có lợi nhuận phụ trội. Game không nói đất tự tạo giá trị mới.

### Đúng 4: Địa tô là quan hệ phân phối lợi nhuận

Địa chủ nhận địa tô không phải vì trực tiếp lao động, mà vì sở hữu quyền cho thuê đất. Đây là đúng với logic địa tô.

### Đúng 5: Tư bản nông nghiệp giữ lợi nhuận bình quân

Trong lý luận Mác, nhà tư bản kinh doanh nông nghiệp tham gia sản xuất để thu lợi nhuận như các nhà tư bản khác. Phần vượt bình quân có thể bị địa chủ chiếm dưới dạng địa tô. Game đang mô phỏng đúng ý này.

## Các điểm cần lưu ý theo C. Mác

### Lưu ý 1: Tô tuyệt đối trong game đang là cơ chế mô phỏng

Mác giải thích tô tuyệt đối bằng quyền sở hữu ruộng đất, cấu tạo hữu cơ của tư bản trong nông nghiệp và việc độc quyền đất đai cản trở sự bình quân hóa hoàn toàn. Game không mô phỏng đủ quá trình đó. Game dùng quy tắc:

```text
Phần vượt lợi nhuận bình quân chưa vào tô vi phân thì quy về tô tuyệt đối.
```

Đây là cách dạy dễ hiểu, không phải công thức đầy đủ.

### Lưu ý 2: Giá trị thị trường đang lấy đất xấu làm mốc

Điều này phù hợp với trực giác địa tô vi phân, nhưng game không mô phỏng cung cầu thật. Nếu sản lượng xã hội thay đổi, giá thị trường thực tế cũng có thể thay đổi.

### Lưu ý 3: Quản lý sản xuất được xử lý như lao động sống

Sau audit, game không còn xếp quản lý sản xuất thuê ngoài vào vốn bất biến. Nếu người này là lao động làm thuê để điều phối sản xuất, tiền trả cho họ thuộc vốn khả biến và lao động đó là lao động sống. Game phải tránh hiểu sai: chức năng giám sát/cai quản thuần túy đại diện cho nhà tư bản không phải nguồn tạo giá trị mới. Item trong game được khóa nghĩa là lao động tổ chức sản xuất cần thiết trong quá trình lao động tập thể.

### Lưu ý 4: AI là khái niệm hiện đại

C. Mác không bàn AI theo nghĩa hiện nay. Game xử lý AI như máy móc hiện đại, tức lao động chết chuyển giá trị và làm tăng năng suất. Cách này hợp lý để nối lý thuyết cũ với công nghệ mới, nhưng cần nói rõ đây là mở rộng mô phỏng.

## Các điểm chưa sát thực tế

### Thực tế 1: Hợp đồng thuê đất không tự điều chỉnh ngay trong một mùa

Trong đời thực, địa chủ không luôn lấy được toàn bộ phần vượt bình quân ngay lập tức. Nó phụ thuộc hợp đồng, thời hạn thuê, thông tin thị trường và sức mặc cả.

### Thực tế 2: Đầu tư thâm canh có độ trễ

Thêm công cụ, máy móc, hạt giống không phải lúc nào cũng tăng sản lượng tuyến tính. Có giới hạn đất, thời tiết, kỹ thuật, nước, phân bón, bệnh cây và rủi ro mùa vụ.

### Thực tế 3: Máy móc cần khấu hao

Game tính chi phí AI/công cụ như trả một lần trong mùa. Thực tế máy móc có khấu hao nhiều kỳ, chi phí bảo trì, rủi ro hỏng hóc và chi phí năng lượng.

### Thực tế 4: Giá bán không cố định đơn giản

Thực tế có cung cầu, thương lái, vận chuyển, tồn kho, chất lượng nông sản, chính sách nhà nước và biến động thị trường. Game lấy giá trị thị trường từ đất xấu để phục vụ bài học địa tô.

### Thực tế 5: Đất xấu có thể không được canh tác nếu lợi nhuận quá thấp

Trong thực tế, nếu đất xấu không đảm bảo lợi nhuận bình quân hoặc không trả nổi tô, nhà tư bản có thể bỏ không thuê. Game vẫn cho canh tác để người học so sánh ba loại đất.

### Thực tế 6: Lao động không đồng nhất

Game dùng `88c` giá trị mới cho mỗi công nhân. Thực tế năng suất và giá trị sức lao động khác nhau theo kỹ năng, thời gian làm việc, điều kiện kỹ thuật và quan hệ xã hội.

## Các chỉnh sửa sau audit

Đã chỉnh:

- Đổi nhãn UI ở màn chọn đất từ `Tô tuyệt đối` sang `Tô cơ sở`.
- Đổi nhãn bảng điều khiển từ `Tô yêu cầu` sang `Tô cơ sở`.
- Chỉnh mô tả đất trung bình: đây là mức giữa để so sánh trực quan, còn giá thị trường vẫn lấy đất xấu làm mốc.
- Chỉnh giải thích tô tuyệt đối trong màn lý thuyết: không còn ghi là "cố định theo lô".
- Chỉnh giải thích màn kết quả: tô tuyệt đối thực trả gồm mức cơ sở và phần vượt bình quân chưa phân vào tô vi phân.
- Chỉnh hướng dẫn game: bảng tô tuyệt đối ghi rõ là `Tô tuyệt đối cơ sở`.
- Chỉnh quản lý sản xuất: không còn tính vào vốn bất biến; lương quản lý sản xuất thuộc vốn khả biến và được cộng vào lao động sống.
- Chỉnh hạt giống và quản lý sản xuất: vẫn ảnh hưởng sản lượng theo mô hình, nhưng không còn được tách vào tô vi phân II.

## Kết luận audit

Game hiện phù hợp để dạy bài MLN122 về địa tô ở mức nhập môn. Nó không nên được hiểu là mô hình kinh tế thực nghiệm.

Nếu cần nói thật gọn cho người chơi:

```text
Lao động sống tạo giá trị mới.
Nhà tư bản ứng vốn và tổ chức sản xuất, rồi giữ lợi nhuận bình quân.
Địa chủ nắm quyền sở hữu đất, nên có thể lấy phần lợi nhuận vượt bình quân dưới dạng địa tô.
Đất tốt không làm tư bản giữ nhiều hơn; nó chủ yếu làm địa tô của địa chủ tăng.
Đất xấu không "lời hơn" cho tư bản; trong mô hình hiện tại tư bản vẫn chỉ giữ quanh lợi nhuận bình quân.
```
