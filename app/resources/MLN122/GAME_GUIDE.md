# Hướng dẫn đầy đủ game MLN122: Nông trang tô điền

Tài liệu này giải thích cách chơi game MLN122, người chơi cần làm gì, các thuật ngữ kinh tế trong game có nghĩa là gì, vì sao game tính toán như vậy, và những điểm cần phản biện khi nhìn kết quả.

Game này là một mô phỏng học tập về **địa tô tư bản chủ nghĩa** trong kinh tế chính trị Mác. Người chơi vào vai **nhà tư bản kinh doanh nông nghiệp**: thuê đất của địa chủ, thuê công nhân, đầu tư tư liệu sản xuất, tạo ra nông sản, bán nông sản, sau đó phân chia lợi nhuận giữa nhà tư bản và địa chủ.

## 1. Mục tiêu của game

Mục tiêu chính không phải là "kiếm tiền càng nhiều càng tốt" theo nghĩa game kinh doanh thông thường. Mục tiêu là giúp người học nhìn thấy:

- Giá trị mới trong sản xuất đến từ lao động sống của công nhân và quản lý sản xuất thuê ngoài nếu có.
- Máy móc, hạt giống, công cụ và AI có thể làm tăng năng suất, nhưng không tự tạo ra giá trị thặng dư.
- Đất tốt, vị trí tốt hoặc đầu tư thâm canh có thể tạo ra lợi nhuận phụ trội.
- Lợi nhuận phụ trội trong nông nghiệp có thể chuyển thành địa tô cho địa chủ.
- Nhà tư bản nông nghiệp thường giữ lại lợi nhuận bình quân, còn phần vượt bình quân có thể bị địa chủ thu dưới dạng tô điền.

Nói ngắn gọn: game giúp hiểu vì sao trong lý luận C. Mác, **địa chủ có thể nhận tiền dù không trực tiếp sản xuất**, còn **nhà tư bản giữ lại ít** trong một số trường hợp.

## 2. Vai trò của người chơi

Bạn không đóng vai công nhân, cũng không đóng vai địa chủ. Bạn đóng vai:

**Nhà tư bản kinh doanh nông nghiệp**

Bạn làm các việc sau:

1. Thuê đất.
2. Thuê công nhân.
3. Mua hạt giống, công cụ, có thể thuê quản lý sản xuất hoặc dùng robot AI.
4. Tổ chức sản xuất nông nghiệp.
5. Bán nông sản.
6. Trả địa tô cho địa chủ.
7. Giữ phần lợi nhuận còn lại.

Vì bạn chỉ thuê đất, bạn không có quyền sở hữu ruộng đất. Do đó, nếu sản xuất có lợi nhuận vượt mức bình quân, địa chủ có quyền đòi một phần dưới dạng tô điền.

## 3. Luồng chơi từng màn

### 3.1. Màn bắt đầu

Màn này giới thiệu bối cảnh: nông nghiệp tư bản chủ nghĩa và quan hệ giữa ba nhóm:

- Địa chủ.
- Nhà tư bản kinh doanh nông nghiệp.
- Công nhân nông nghiệp làm thuê.

Bạn bấm bắt đầu để đi qua mô phỏng.

### 3.2. Màn bối cảnh

Màn này giải thích quan hệ xã hội trong game.

Địa chủ sở hữu đất. Nhà tư bản muốn sản xuất thì phải thuê đất. Công nhân bán sức lao động cho nhà tư bản. Sản xuất chỉ diễn ra khi nhà tư bản kết hợp đất đai, tư liệu sản xuất và lao động làm thuê.

### 3.3. Màn chọn đất

Bạn chọn một trong các loại đất:

| Loại đất       | Ý nghĩa trong game               | Tác động                                              |
| -------------- | -------------------------------- | ----------------------------------------------------- |
| Đất tốt        | Đất có độ phì nhiêu cao, gần chợ | Năng suất cao, dễ tạo lợi nhuận phụ trội, tô điền cao |
| Đất trung bình | Điều kiện sản xuất bình thường   | Mức giữa để so sánh trực quan                         |
| Đất xấu        | Đất kém hơn, xa chợ              | Năng suất thấp, ít lợi nhuận phụ trội, tô thấp hơn    |

Điểm quan trọng: đất tốt không tự tạo ra giá trị mới. Đất tốt chỉ giúp cùng một lượng lao động có thể tạo ra nhiều sản phẩm hơn, nhờ đó nhà tư bản có thể bán hàng với lợi thế hơn so với sản xuất trên đất xấu.

### 3.4. Màn đầu tư

Bạn chọn hoặc điều chỉnh các yếu tố đầu tư:

| Yếu tố           | Trong game là gì                                   | Ý nghĩa lý thuyết                                       |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------- |
| Công nhân        | Người lao động làm thuê                            | Nguồn tạo ra giá trị mới và giá trị thặng dư            |
| Hạt giống        | Đầu vào sản xuất                                   | Vốn không đổi                                           |
| Công cụ          | Tư liệu lao động                                   | Vốn không đổi                                           |
| Quản lý sản xuất | Lao động sống làm thuê để tổ chức sản xuất tốt hơn | Vốn khả biến; làm tăng hiệu quả, tăng năng suất         |
| Robot AI         | Công nghệ hỗ trợ sản xuất                          | Làm tăng năng suất, nhưng không tự tạo giá trị thặng dư |

Trong game, nếu bạn tăng hạt giống, công cụ, quản lý sản xuất hoặc AI, sản lượng có thể tăng. Phần tạo ra giá trị mới vẫn gắn với lao động sống: công nhân trực tiếp và quản lý sản xuất thuê ngoài nếu có bật.

### 3.5. Màn canh tác

Đây là màn mô phỏng trực quan quá trình sản xuất. Công nhân làm việc trên ruộng, cây phát triển và được thu hoạch.

Màn này giúp nhìn thấy rằng sản phẩm không tự xuất hiện từ đất hoặc máy móc. Nó cần quá trình lao động.

### 3.6. Màn kết quả

Màn này là phần quan trọng nhất. Game hiển thị:

- Sản lượng nông sản, tính bằng **đơn vị sản lượng**.
- Doanh thu.
- Tổng chi phí.
- Giá trị thặng dư.
- Tô điền vi phân I.
- Tô điền vi phân II.
- Tô điền tuyệt đối.
- Tổng tô điền trả cho địa chủ.
- Lợi nhuận nhà tư bản giữ lại.

Nếu bạn thấy nhà tư bản giữ lại ít, đó là do công thức mô phỏng đang cho địa chủ thu phần lớn lợi nhuận vượt bình quân do lợi thế đất. Riêng tô vi phân II được ghi là khoản có thể bị thu ở mùa sau.

### 3.7. Màn lý thuyết

Màn này giải thích lại bằng sơ đồ:

1. Lao động sống tạo giá trị mới.
2. Sau khi trừ lương, phần còn lại là giá trị thặng dư.
3. Nếu có lợi thế đất đai hoặc đầu tư, xuất hiện lợi nhuận phụ trội.
4. Địa chủ có thể nhận địa tô từ lợi thế đất và quyền sở hữu đất.
5. Nhà tư bản giữ lại phần lợi nhuận còn lại.

### 3.8. Màn tổng kết

Tổng hợp kết quả cuối cùng: giá trị thặng dư, tô điền, lợi nhuận còn lại.

### 3.9. Màn quiz

Quiz dùng để kiểm tra lại kiến thức. Người chơi bấm bắt đầu quiz thì đồng hồ mới chạy. Thời gian tối đa là 30 phút. Hết giờ sẽ tự nộp bài.

Quiz tập trung vào:

- Tư bản cho vay.
- Lợi tức.
- Tư bản giả.
- Địa tô tư bản chủ nghĩa.
- Tô điền vi phân I.
- Tô điền vi phân II.
- Tô điền tuyệt đối.

Sau khi nộp, người chơi được chuyển sang bảng xếp hạng.

## 4. Các đơn vị trong game

### 4.1. `c` là gì?

Trong game, `c` là đơn vị tiền mô phỏng. Có thể hiểu đơn giản là **xu**.

Ví dụ:

```text
180c = 180 xu
```

Đây không phải tiền thật. Nó là đơn vị để so sánh chi phí, doanh thu, lợi nhuận và tô điền.

### 4.2. Đơn vị sản lượng là gì?

Sản lượng nông sản trong game được hiển thị bằng **đơn vị sản lượng**.

Ví dụ:

```text
235 đơn vị sản lượng
```

Nghĩa là mùa vụ tạo ra 235 đơn vị sản lượng. Đây là đơn vị mô phỏng để tránh hiểu nhầm rằng game đang đo chính xác một loại nông sản cụ thể.

### 4.3. Năng suất phần trăm là gì?

Năng suất phần trăm là hệ số tổng hợp từ:

- Chất lượng đất.
- Vị trí thị trường.
- Hạt giống.
- Công cụ.
- Quản lý sản xuất.
- Robot AI.

Ví dụ năng suất 210% nghĩa là với cùng số công nhân cơ bản, hệ thống đang tạo ra sản lượng cao hơn mức chuẩn.

## 5. Công thức tính trong game

Các công thức dưới đây dựa trên logic hiện tại trong `core/game-model.ts`.

### 5.1. Chi phí đầu tư

| Khoản               | Giá trị |
| ------------------- | ------: |
| Lương một công nhân |     45c |
| Một phần hạt giống  |     28c |
| Một công cụ         |     42c |
| Quản lý sản xuất    |     70c |
| Robot AI            |    110c |

### 5.2. Vốn bất biến

**Vốn bất biến** là phần vốn dùng để mua tư liệu sản xuất.

Trong game:

```text
Vốn bất biến = chi phí hạt giống + chi phí công cụ + robot AI
```

Nó được gọi là bất biến vì theo lý luận Mác, nó không tự làm tăng giá trị. Nó chỉ chuyển giá trị sẵn có vào sản phẩm.

### 5.3. Vốn khả biến

**Vốn khả biến** là tiền lương trả cho lao động sống làm thuê, gồm công nhân và quản lý sản xuất nếu có thuê.

Trong game:

```text
Vốn khả biến = số công nhân × 45c + quản lý sản xuất nếu thuê × 70c
```

Nó được gọi là khả biến vì khi mua sức lao động, nhà tư bản có thể thu được giá trị mới lớn hơn tiền lương đã trả.

### 5.4. Giá trị lao động sống

Mỗi công nhân trong game tạo ra:

```text
88c giá trị mới
```

Quản lý sản xuất thuê ngoài, nếu bật, cũng được mô phỏng là lao động sống và tạo thêm `88c` giá trị mới trong mô hình đơn giản của game. Đây là lao động tổ chức sản xuất trong quá trình lao động tập thể, không phải chức năng cai quản thuần túy của nhà tư bản.

Do đó:

```text
Giá trị lao động sống = số công nhân × 88c + quản lý sản xuất nếu thuê × 88c
```

### 5.5. Giá trị thặng dư

Giá trị thặng dư là phần giá trị mới còn lại sau khi trả lương.

```text
Giá trị thặng dư = giá trị lao động sống - vốn khả biến
```

Ví dụ 4 công nhân:

```text
Giá trị lao động sống = 4 × 88c = 352c
Vốn khả biến = 4 × 45c = 180c
Giá trị thặng dư = 352c - 180c = 172c
```

Ý nghĩa: công nhân tạo ra 352c giá trị mới, nhưng chỉ nhận 180c tiền lương. Phần 172c còn lại là giá trị thặng dư.

### 5.6. Sản lượng nông sản

Trong game:

```text
Sản lượng = số công nhân × 28 đơn vị × hệ số năng suất
```

Trong đó:

- `28 đơn vị` là sản lượng cơ bản của một công nhân.
- Hệ số năng suất đến từ đất đai, vị trí và đầu tư.

### 5.7. Hệ số năng suất

Hệ số năng suất gồm hai nhóm:

**Năng suất tự nhiên**

```text
Năng suất tự nhiên = độ phì nhiêu đất × lợi thế thị trường
```

**Năng suất thâm canh**

```text
Năng suất thâm canh = quản lý sản xuất × AI × công cụ × hạt giống
```

Trong game:

- Có quản lý sản xuất: nhân 1.14.
- Có AI: nhân 1.22.
- Mỗi công cụ: tăng 6%.
- Mỗi phần hạt giống: tăng 4%.

### 5.8. Giá trị hàng hóa

Trong game:

```text
Giá trị hàng hóa = vốn bất biến + giá trị lao động sống
```

Nghĩa là hàng hóa mang trong nó:

- Giá trị cũ từ tư liệu sản xuất.
- Giá trị mới do lao động sống tạo ra.

### 5.9. Giá thị trường và lợi nhuận phụ trội

Game lấy đất xấu làm mốc để tính giá trị thị trường một đơn vị sản lượng. Nếu lô đất của bạn tạo ra nhiều sản lượng hơn nhờ đất tốt hoặc đầu tư, doanh thu có thể cao hơn giá trị hàng hóa.

```text
Lợi nhuận phụ trội = giá trị thị trường của sản lượng - giá trị hàng hóa
```

Nếu kết quả âm, game đưa về 0.

Ý nghĩa: lợi nhuận phụ trội không phải vì máy móc tự sinh giá trị, mà vì lô đất hoặc phương pháp sản xuất của bạn có lợi thế so với điều kiện xấu hơn đang làm mốc thị trường.

### 5.10. Lợi nhuận trước địa tô

```text
Lợi nhuận trước địa tô = doanh thu - vốn bất biến - vốn khả biến
```

Đây là phần nhà tư bản có trước khi trả tô cho địa chủ.

### 5.11. Lợi nhuận bình quân

Trong game:

```text
Lợi nhuận bình quân = 22% × tổng vốn ứng trước
```

Trong đó:

```text
Tổng vốn ứng trước = vốn bất biến + vốn khả biến
```

Nếu lợi nhuận thực tế thấp hơn mức bình quân, game lấy lợi nhuận thực tế làm giới hạn.

### 5.12. Ngân sách địa tô

Game tính:

```text
Ngân sách địa tô = lợi nhuận trước địa tô - lợi nhuận bình quân
```

Ý nghĩa: nhà tư bản được ưu tiên giữ lợi nhuận bình quân. Phần vượt mức bình quân có thể chuyển thành địa tô cho địa chủ.

Đây là lý do nhà tư bản có thể giữ lại ít nếu đất tạo ra lợi nhuận phụ trội lớn.

### 5.13. Địa tô tuyệt đối

Địa tô tuyệt đối là khoản tô phát sinh từ quyền sở hữu ruộng đất.

Trong game, mỗi loại đất có một mức tô tuyệt đối cơ sở:

| Loại đất       | Tô tuyệt đối cơ sở |
| -------------- | -----------------: |
| Đất tốt        |                90c |
| Đất trung bình |                60c |
| Đất xấu        |                35c |

Game chỉ trả tô tuyệt đối nếu còn đủ lợi nhuận vượt mức bình quân.

Lưu ý: mức trong bảng là mức cơ sở để biểu thị quyền sở hữu đất. Nếu sau khi tính tô vi phân I vẫn còn phần lợi nhuận vượt bình quân không thuộc thâm canh của người thuê, game quy phần còn lại đó vào tô tuyệt đối. Cách này giúp kết quả không bị hiểu sai thành "đất xấu làm nhà tư bản lời hơn đất tốt".

### 5.14. Địa tô vi phân I

Địa tô vi phân I đến từ sự khác nhau tự nhiên giữa các mảnh đất.

Ví dụ:

- Đất tốt màu mỡ hơn.
- Đất gần chợ hơn.
- Chi phí vận chuyển thấp hơn.
- Cùng một lượng lao động nhưng sản lượng cao hơn.

Trong game, phần lợi nhuận phụ trội do lợi thế đất đai tự nhiên tạo ra được tính vào tô vi phân I.

### 5.15. Địa tô vi phân II

Địa tô vi phân II đến từ đầu tư thêm trên cùng một mảnh đất.

Ví dụ:

- Mua thêm công cụ.
- Dùng robot AI.

Hạt giống vẫn là vốn không đổi và có thể làm tăng sản lượng, nhưng trong game không tách phần tăng do mua thêm hạt giống vào tô vi phân II. Hạt giống là đầu vào thường xuyên của vụ mùa, không phải cải tiến thâm canh để địa chủ thu riêng dưới mục này.

Nếu công cụ hoặc AI làm năng suất tăng và tạo thêm lợi nhuận phụ trội, phần đó có thể trở thành tô vi phân II. Quản lý sản xuất vẫn có thể tăng hiệu quả, nhưng trong game được phân loại là lao động sống thuộc vốn khả biến nên không tách vào tô vi phân II.

Trong mùa hiện tại, tô vi phân II chỉ được ghi nhận để người chơi thấy nguy cơ địa chủ thu thêm ở mùa sau. Nó không bị trừ khỏi lợi nhuận ngay trong mùa này.

### 5.16. Tổng tô điền

```text
Tổng tô điền mùa này = tô tuyệt đối + tô vi phân I
```

### 5.17. Lợi nhuận nhà tư bản giữ lại

```text
Lợi nhuận giữ lại = lợi nhuận trước địa tô - tổng tô điền mùa này
```

Trong mô hình hiện tại, phần lợi nhuận phụ trội do lợi thế đất có thể bị thu trong mùa này. Riêng tô vi phân II do công cụ hoặc AI được ghi là khoản có thể bị thu vào mùa vụ trong tương lai.

## 6. Ví dụ với cấu hình mặc định

Cấu hình mặc định:

- 4 công nhân.
- 3 hạt giống.
- 2 công cụ.
- Không quản lý.
- Không robot AI.

Với đất tốt, kết quả có thể gần như sau:

```text
Sản lượng: 235 đơn vị
Vốn bất biến: 168c
Vốn khả biến: 180c
Giá trị lao động sống: 352c
Giá trị thặng dư: 172c
Lợi nhuận phụ trội: 735c
Lợi nhuận trước địa tô: 907c
Lợi nhuận bình quân mục tiêu: 77c
Tô vi phân II có thể thu mùa sau: 22c
Tổng tô điền mùa này: 808c
Nhà tư bản giữ lại: 99c
```

Nhìn qua có vẻ nhà tư bản bị lấy nhiều. Nhưng theo mô hình, phần lớn 907c không phải lợi nhuận bình quân bình thường. Nó bao gồm lợi nhuận phụ trội do đất tốt, vị trí tốt và năng suất cao. Địa chủ, vì nắm quyền cho thuê đất, có thể thu phần do lợi thế đất thành địa tô trong mùa này; phần vi phân II do công cụ hoặc AI có thể bị thu ở mùa sau.

## 7. Vì sao nhà tư bản giữ lại ít?

Đây là câu hỏi quan trọng nhất khi chơi game.

Game đang mô phỏng theo logic:

```text
Nhà tư bản giữ lợi nhuận bình quân.
Địa chủ thu phần vượt lợi nhuận bình quân do lợi thế đất dưới dạng địa tô.
Tô vi phân II có thể bị thu ở mùa sau.
```

Do đó, khi đất tốt hoặc đầu tư làm lợi nhuận phụ trội tăng mạnh, phần địa tô cũng tăng mạnh.

Nếu chơi bằng tư duy game kinh doanh thông thường, người chơi sẽ nghĩ:

```text
Tôi đầu tư, tôi tổ chức sản xuất, tôi phải giữ phần lớn lợi nhuận.
```

Nhưng theo lý luận địa tô của Mác, trong nông nghiệp tư bản chủ nghĩa:

```text
Nhà tư bản cần đất để sản xuất.
Địa chủ độc quyền quyền sử dụng đất.
Vì vậy địa chủ có thể chiếm phần lợi nhuận phụ trội do điều kiện đất đai tạo ra.
```

Đây là lý do nhà tư bản có thể giữ lại ít hơn cảm giác ban đầu.

## 8. Các thuật ngữ chính

### 8.1. Địa chủ

Người sở hữu ruộng đất. Địa chủ không trực tiếp sản xuất nhưng có quyền cho thuê đất. Vì vậy địa chủ có thể nhận tô điền.

### 8.2. Nhà tư bản kinh doanh nông nghiệp

Người thuê đất, ứng vốn, thuê công nhân, tổ chức sản xuất và bán nông sản. Trong game, người chơi là nhà tư bản kinh doanh nông nghiệp.

### 8.3. Công nhân nông nghiệp

Người bán sức lao động cho nhà tư bản. Trong mô hình Mác, công nhân là lực lượng lao động trực tiếp tạo giá trị mới.

### 8.4. Vốn bất biến

Phần vốn dùng để mua tư liệu sản xuất như hạt giống, công cụ, máy móc, AI. Nó không tự tạo giá trị mới mà chuyển giá trị sẵn có vào sản phẩm.

### 8.5. Vốn khả biến

Phần vốn dùng để mua sức lao động, tức tiền lương trả cho công nhân và quản lý sản xuất thuê ngoài nếu có. Gọi là khả biến vì sức lao động có thể tạo ra giá trị lớn hơn tiền lương.

### 8.6. Lao động sống

Lao động đang diễn ra của con người trong quá trình sản xuất. Đây là nguồn tạo ra giá trị mới trong lý luận Mác. Trong game, lao động sống gồm công nhân trực tiếp và quản lý sản xuất thuê ngoài nếu được bật.

### 8.7. Lao động chết

Giá trị đã kết tinh trong máy móc, công cụ, nguyên liệu. Máy móc và AI thuộc nhóm này trong mô hình game. Chúng hỗ trợ sản xuất nhưng không tự tạo giá trị mới.

### 8.8. Giá trị thặng dư

Phần giá trị mới lao động sống tạo ra vượt quá tiền lương họ nhận.

Ví dụ:

```text
Công nhân tạo ra 352c giá trị mới.
Nhà tư bản trả 180c tiền lương.
Giá trị thặng dư = 172c.
```

### 8.9. Lợi nhuận

Hình thức biểu hiện của giá trị thặng dư trong kinh doanh. Khi nhìn từ phía nhà tư bản, giá trị thặng dư thường xuất hiện như lợi nhuận.

### 8.10. Lợi nhuận bình quân

Mức lợi nhuận thông thường mà nhà tư bản kỳ vọng nhận được so với tổng vốn ứng trước. Trong game, tỷ suất lợi nhuận bình quân là 22%.

### 8.11. Lợi nhuận phụ trội

Lợi nhuận vượt mức bình thường do điều kiện sản xuất tốt hơn.

Trong game, lợi nhuận phụ trội có thể đến từ:

- Đất tốt hơn.
- Vị trí gần chợ hơn.
- Đầu tư thâm canh.
- Công cụ, AI làm năng suất cao hơn; quản lý sản xuất thuê ngoài tổ chức lao động tốt hơn.

### 8.12. Địa tô

Phần lợi nhuận mà nhà tư bản phải trả cho địa chủ để được sử dụng đất.

### 8.13. Địa tô tuyệt đối

Khoản tô phát sinh vì đất thuộc quyền sở hữu tư nhân của địa chủ. Dù đất tốt hay xấu, nếu muốn dùng đất thì vẫn có thể phải trả tô.

### 8.14. Địa tô vi phân I

Khoản tô phát sinh do sự khác nhau tự nhiên giữa các mảnh đất, như độ màu mỡ và vị trí.

### 8.15. Địa tô vi phân II

Khoản tô phát sinh do đầu tư thêm trên cùng một mảnh đất làm tăng năng suất.

### 8.16. Tư bản cho vay

Tư bản tiền tệ được đem cho người khác vay để nhận lợi tức. Người cho vay không trực tiếp sản xuất, nhưng nhận một phần lợi nhuận do người đi vay thu được.

### 8.17. Lợi tức

Phần lợi nhuận mà người đi vay trả cho người cho vay. Theo Mác, lợi tức có nguồn gốc sâu xa từ giá trị thặng dư, không phải từ việc tiền tự sinh ra tiền.

### 8.18. Tỷ suất lợi tức

Tỷ lệ giữa lợi tức và số tư bản cho vay.

```text
Tỷ suất lợi tức = lợi tức / tư bản cho vay
```

### 8.19. Tư bản giả

Các giấy tờ như cổ phiếu, trái phiếu có giá cả riêng và có thể mua bán, nhưng chúng không phải lúc nào cũng tương ứng trực tiếp với tư bản thực đang sản xuất.

## 9. Phản biện và giải thích

### 9.1. Phản biện: Nếu công cụ và AI làm sản lượng tăng, tại sao nói chúng không tạo giá trị mới?

Đây là điểm dễ nhầm.

Công cụ và AI có thể làm năng suất tăng. Một công nhân có thể làm ra nhiều sản lượng hơn trong cùng thời gian. Nhưng theo lý luận Mác, công cụ và AI chỉ chuyển giá trị đã có của chúng vào sản phẩm. Nguồn tạo ra giá trị mới vẫn là lao động sống.

Nói cách khác:

```text
AI làm sản xuất hiệu quả hơn.
Nhưng AI không phải chủ thể tạo ra giá trị thặng dư theo mô hình Mác.
```

Game cố tình tách hai chuyện:

- Tăng sản lượng.
- Tạo giá trị mới.

### 9.2. Phản biện: Đất tốt tạo ra nhiều sản lượng hơn, sao nói đất không tạo giá trị?

Đất tốt giúp lao động hiệu quả hơn. Nhưng đất không tự lao động. Nếu không có công nhân, hạt giống, công cụ và tổ chức sản xuất, đất không tự biến thành hàng hóa đem bán.

Trong game, đất tốt tạo lợi thế sản xuất và lợi nhuận phụ trội, nhưng giá trị mới vẫn gắn với lao động sống.

### 9.3. Phản biện: Nhà tư bản bỏ vốn và tổ chức sản xuất, sao địa chủ lấy nhiều vậy?

Vì trong quan hệ ruộng đất tư bản chủ nghĩa, địa chủ độc quyền quyền sử dụng đất. Nhà tư bản muốn sản xuất phải thuê đất. Nếu đất đó tạo lợi nhuận phụ trội, địa chủ có thể nâng tô để chiếm phần vượt bình quân.

Game mô phỏng mạnh điểm này, nên nhà tư bản có thể chỉ còn lại gần lợi nhuận bình quân.

### 9.4. Phản biện: Có phải địa chủ luôn lấy hết phần vượt bình quân không?

Không nhất thiết trong đời thực.

Đời thực phụ thuộc vào:

- Hợp đồng thuê đất.
- Thời hạn thuê.
- Sức mặc cả giữa địa chủ và nhà tư bản.
- Cạnh tranh giữa các địa chủ.
- Cạnh tranh giữa các nhà tư bản thuê đất.
- Chính sách thuế và pháp luật.
- Mức phát triển thị trường.

Game đơn giản hóa bằng cách giả định địa chủ có quyền thu phần lớn lợi nhuận vượt bình quân. Đây là mô hình học tập, không phải mô hình dự báo kinh tế thực nghiệm.

### 9.5. Phản biện: Vì sao đất xấu vẫn có tô tuyệt đối?

Theo lý luận địa tô tuyệt đối, quyền sở hữu tư nhân về đất tạo ra một rào cản. Dù đất không tốt, nhà tư bản vẫn phải trả tiền để được quyền sử dụng. Vì vậy đất xấu vẫn có thể có tô tuyệt đối.

Trong game, đất xấu có mức tô tuyệt đối cơ sở thấp hơn đất tốt. Tuy nhiên, nếu vẫn còn phần lợi nhuận vượt bình quân chưa chuyển thành tô vi phân, phần đó được quy về tô tuyệt đối để nhà tư bản không giữ nhiều hơn lợi nhuận bình quân chỉ vì chọn đất xấu.

### 9.6. Phản biện: Lợi nhuận phụ trội có phải luôn chuyển thành địa tô không?

Không phải ngay lập tức trong mọi hoàn cảnh. Nhưng trong mô hình địa tô, khi địa chủ nắm quyền sở hữu đất và biết đất có lợi thế, họ có xu hướng biến lợi nhuận phụ trội đó thành địa tô.

Game thể hiện xu hướng lý thuyết này bằng công thức:

```text
Địa tô mùa này lấy từ phần lợi nhuận vượt lợi nhuận bình quân do lợi thế đất. Tô vi phân II được ghi riêng như khoản có thể thu ở mùa sau.
```

### 9.7. Phản biện: Nếu nhà tư bản còn quá ít, họ có còn động lực sản xuất không?

Trong mô hình hiện tại, nhà tư bản vẫn giữ lợi nhuận bình quân và có thể giữ thêm phần tô vi phân II trong mùa hiện tại. Nếu lợi nhuận còn lại thấp hơn mức bình quân hoặc âm, đó sẽ là dấu hiệu mô hình cần cân bằng lại.

Với cấu hình hiện tại, nhà tư bản thường không mất hết lợi nhuận. Họ giữ phần gần lợi nhuận bình quân và phần vi phân II chưa thu ngay nếu có.

### 9.8. Phản biện: Game có đúng hoàn toàn với C. Mác không?

Game đúng ở khung khái niệm chính:

- Lao động sống tạo giá trị mới.
- Vốn bất biến chỉ chuyển giá trị.
- Giá trị thặng dư là phần vượt tiền lương.
- Đất tốt tạo lợi nhuận phụ trội.
- Quyền sở hữu đất cho phép địa chủ thu địa tô.
- Địa tô có thể gồm tô tuyệt đối, tô vi phân I và tô vi phân II.

Nhưng game có giản lược:

- Chỉ dùng một mùa vụ.
- Không mô phỏng cạnh tranh đầy đủ giữa nhiều nhà tư bản.
- Không mô phỏng thị trường giá cả phức tạp.
- Không mô phỏng thời hạn hợp đồng thuê đất.
- Không mô phỏng khấu hao máy móc chi tiết.
- AI được đưa vào như yếu tố năng suất hiện đại, không phải khái niệm gốc trong thời Mác.

Vì vậy, game nên được hiểu là **mô hình minh họa lý thuyết**, không phải bản sao hoàn chỉnh của nền kinh tế.

## 10. Cách đọc kết quả cho đúng

Khi xem màn kết quả, nên đọc theo thứ tự sau:

1. Sản lượng là bao nhiêu?
2. Vốn bất biến đã ứng ra bao nhiêu?
3. Vốn khả biến, tức lương công nhân, là bao nhiêu?
4. Lao động sống tạo ra bao nhiêu giá trị mới?
5. Giá trị thặng dư là bao nhiêu?
6. Đất và đầu tư có tạo lợi nhuận phụ trội không?
7. Lợi nhuận bình quân của nhà tư bản là bao nhiêu?
8. Phần nào chuyển thành địa tô?
9. Địa chủ nhận bao nhiêu?
10. Nhà tư bản giữ lại bao nhiêu?

Đừng chỉ nhìn dòng cuối "lợi nhuận còn lại". Dòng đó chỉ có ý nghĩa khi đặt trong toàn bộ quá trình phân chia giá trị.

## 11. Cách chơi để thấy rõ lý thuyết

### 11.1. Thử cùng đầu tư, đổi loại đất

Giữ nguyên công nhân, hạt giống, công cụ. Chỉ đổi đất tốt, đất trung bình, đất xấu.

Bạn sẽ thấy:

- Đất tốt có sản lượng cao hơn.
- Lợi nhuận phụ trội cao hơn.
- Tô vi phân I cao hơn.
- Địa chủ nhận nhiều hơn.

Điều này minh họa tô vi phân I.

### 11.2. Thử cùng đất, tăng đầu tư

Giữ nguyên loại đất. Tăng công cụ hoặc AI.

Bạn sẽ thấy:

- Sản lượng tăng.
- Năng suất tăng.
- Lợi nhuận phụ trội có thể tăng.
- Tô vi phân II có thể tăng.

Điều này minh họa tô vi phân II.

Nếu chỉ tăng hạt giống, bạn vẫn có thể thấy sản lượng và chi phí thay đổi, nhưng phần đó không được tách riêng thành tô vi phân II.

Nếu bật quản lý sản xuất, sản lượng và giá trị lao động sống có thể thay đổi, nhưng phần đó thuộc lao động sống chứ không phải tô vi phân II.

### 11.3. Thử giảm công nhân

Giảm số công nhân.

Bạn sẽ thấy:

- Giá trị lao động sống giảm.
- Giá trị thặng dư giảm.
- Tổng kết quả sản xuất yếu đi.

Điều này minh họa vai trò của lao động sống.

### 11.4. Thử bật AI

Bật robot AI.

Bạn sẽ thấy:

- Năng suất tăng.
- Sản lượng tăng.
- Nhưng lý thuyết vẫn giải thích rằng AI không phải nguồn tạo giá trị thặng dư.

Điều này giúp phân biệt tăng năng suất và tạo giá trị mới.

## 12. Câu hỏi ôn tập sau khi chơi

1. Ai là người tạo ra giá trị mới trong game?
2. Vì sao máy móc và AI không được xem là nguồn tạo giá trị thặng dư?
3. Vì sao đất tốt có thể tạo lợi nhuận phụ trội?
4. Tô vi phân I khác tô vi phân II ở đâu?
5. Vì sao đất xấu vẫn có thể có tô tuyệt đối?
6. Vì sao nhà tư bản giữ lại ít khi đất tốt tạo lợi nhuận phụ trội lớn?
7. Vì sao địa chủ có thể nhận tiền dù không trực tiếp sản xuất?
8. Game đã giản lược những yếu tố nào của đời thực?

## 13. Kết luận ngắn

Game MLN122 không chỉ là trò chơi trồng trọt. Nó là một mô hình học tập về cách giá trị được tạo ra và phân chia trong nông nghiệp tư bản chủ nghĩa.

Thông điệp cốt lõi:

```text
Lao động sống tạo giá trị mới.
Nhà tư bản tổ chức sản xuất và giữ lợi nhuận bình quân.
Địa chủ nắm quyền sở hữu đất và có thể thu địa tô.
Đất tốt tạo lợi nhuận phụ trội có thể chuyển thành địa tô mùa này.
Tô vi phân II từ công cụ hoặc AI có thể bị thu ở mùa sau.
```

Nếu thấy nhà tư bản giữ lại ít, đó không nhất thiết là lỗi. Đó là điểm mà game muốn làm nổi bật: trong quan hệ địa tô, quyền sở hữu đất có thể giúp địa chủ chiếm phần lợi nhuận phụ trội do điều kiện sản xuất nông nghiệp tạo ra.
