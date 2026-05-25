CREATE DATABASE IF NOT EXISTS movieticket;
USE movieticket;

SET FOREIGN_KEY_CHECKS=0;

-- =====================
-- GENRES
-- =====================
INSERT IGNORE INTO genres (name) VALUES
('Action'), ('Comedy'), ('Drama'), ('Horror'),
('Sci-Fi'), ('Romance'), ('Animation'), ('Thriller');

-- =====================
-- USERS (password: admin123 / user123)
-- =====================
INSERT IGNORE INTO users (name, email, password, phone, role, enabled, created_at) VALUES
('Admin',       'admin@movieticket.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0123456789', 'ADMIN', true, NOW()),
('Nguyen Van A','user1@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '0901234567', 'USER',  true, NOW()),
('Tran Thi B',  'user2@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '0912345678', 'USER',  true, NOW()),
('Le Van C',    'user3@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '0923456789', 'USER',  true, NOW());

-- =====================
-- MOVIES
-- =====================
INSERT IGNORE INTO movies (title, description, poster_url, trailer_url, duration, release_date, genre_id, status) VALUES
('Avengers: Endgame',       'Sau su kien Thanos tieu diet mot nua vu tru, cac Avengers con lai tap hop de dao nguoc hanh dong cua han.',        'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',              'https://www.youtube.com/watch?v=TcMBFSGVi1c', 181, '2019-04-26', 1, 'NOW_SHOWING'),
('Inception',               'Mot ten trom danh cap bi mat tu tiem thuc cua nguoi khac trong khi ho dang mo.',                                   'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg','https://www.youtube.com/watch?v=YoHD9XEInc0', 148, '2010-07-16', 5, 'NOW_SHOWING'),
('The Dark Knight',         'Batman doi mat voi Joker, mot ten toi pham hon loan muon gieo rac su hon loan o Gotham.',                           'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',       'https://www.youtube.com/watch?v=EXeTwQWrcwY', 152, '2008-07-18', 1, 'NOW_SHOWING'),
('Interstellar',            'Mot nhom phi hanh gia du hanh qua lo sau de tim kiem ngoi nha moi cho nhan loai.',                                  'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',              'https://www.youtube.com/watch?v=zSWdZVtXT7E', 169, '2014-11-07', 5, 'NOW_SHOWING'),
('Parasite',                'Gia dinh ngheo kho dan xam nhap vao cuoc song cua mot gia dinh giau co.',                                           'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',              'https://www.youtube.com/watch?v=5xH0HfJHsaY', 132, '2019-05-30', 8, 'NOW_SHOWING'),
('Spider-Man: No Way Home', 'Peter Parker nho Doctor Strange giup xoa ky uc ve danh tinh cua minh, nhung phep thuat da mo ra da vu tru.',        'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg',        'https://www.youtube.com/watch?v=JfVOs4VSpmA', 148, '2021-12-17', 1, 'NOW_SHOWING'),
('Your Name',               'Hai hoc sinh trung hoc o cac vung khac nhau bong nhien hoan doi co the cho nhau.',                                  'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png',                     'https://www.youtube.com/watch?v=xU47nhruN-Q', 106, '2016-08-26', 6, 'NOW_SHOWING'),
('Dune: Part Two',          'Paul Atreides hop nhat voi nguoi Fremen trong khi theo duoi con duong tra thu nhung ke da huy diet gia dinh minh.', 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',               'https://www.youtube.com/watch?v=Way9Dexny3w', 166, '2024-03-01', 5, 'COMING_SOON'),
('Inside Out 2',            'Riley buoc vao tuoi thieu nien va nhung cam xuc moi xuat hien trong dau co be.',                                    'https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_2_poster.jpg',                  'https://www.youtube.com/watch?v=LEjhY15eCx0', 100, '2024-06-14', 7, 'COMING_SOON'),
('Joker: Folie a Deux',     'Arthur Fleck gap Harley Quinn trong trai tam than va cung nhau buoc vao mot hanh trinh am nhac den toi.',           'https://upload.wikimedia.org/wikipedia/en/e/e9/Joker_Folie_%C3%A0_Deux_poster.jpg',      'https://www.youtube.com/watch?v=_OcFHpSMcpY', 138, '2024-10-04', 3, 'COMING_SOON');

-- =====================
-- ROOMS
-- =====================
INSERT IGNORE INTO rooms (name, rows_count, columns_count) VALUES
('Phong 1',   8, 10),
('Phong 2',   6,  8),
('Phong VIP', 4,  6);

-- =====================
-- SEATS - Phong 1 (8x10, G-H = VIP)
-- =====================
INSERT INTO seats (room_id, seat_row, seat_number, type)
SELECT r.id, h.hang, n.num,
  CASE WHEN h.hang IN ('G','H') THEN 'VIP' ELSE 'STANDARD' END
FROM rooms r,
  (SELECT 'A' hang UNION ALL SELECT 'B' UNION ALL SELECT 'C' UNION ALL SELECT 'D'
   UNION ALL SELECT 'E' UNION ALL SELECT 'F' UNION ALL SELECT 'G' UNION ALL SELECT 'H') h,
  (SELECT 1 num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
   UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
WHERE r.name = 'Phong 1';

-- =====================
-- SEATS - Phong 2 (6x8, E-F = VIP)
-- =====================
INSERT INTO seats (room_id, seat_row, seat_number, type)
SELECT r.id, h.hang, n.num,
  CASE WHEN h.hang IN ('E','F') THEN 'VIP' ELSE 'STANDARD' END
FROM rooms r,
  (SELECT 'A' hang UNION ALL SELECT 'B' UNION ALL SELECT 'C'
   UNION ALL SELECT 'D' UNION ALL SELECT 'E' UNION ALL SELECT 'F') h,
  (SELECT 1 num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
   UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) n
WHERE r.name = 'Phong 2';

-- =====================
-- SEATS - Phong VIP (4x6, tat ca VIP)
-- =====================
INSERT INTO seats (room_id, seat_row, seat_number, type)
SELECT r.id, h.hang, n.num, 'VIP'
FROM rooms r,
  (SELECT 'A' hang UNION ALL SELECT 'B' UNION ALL SELECT 'C' UNION ALL SELECT 'D') h,
  (SELECT 1 num UNION ALL SELECT 2 UNION ALL SELECT 3
   UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) n
WHERE r.name = 'Phong VIP';

-- =====================
-- SHOWTIMES (4 ngay ke tu hom nay)
-- =====================
INSERT INTO showtimes (movie_id, room_id, start_time, end_time, date, price_standard, price_vip)
SELECT
  m.id, r.id,
  CONCAT(DATE_ADD(CURDATE(), INTERVAL d.num DAY), ' ', s.st),
  CONCAT(DATE_ADD(CURDATE(), INTERVAL d.num DAY), ' ', s.et),
  DATE_ADD(CURDATE(), INTERVAL d.num DAY),
  s.ps, s.pv
FROM
  (SELECT 0 num UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) d,
  (SELECT 'Avengers: Endgame'       mt,'Phong 1'   rn,'09:00:00' st,'12:16:00' et, 85000 ps,130000 pv UNION ALL
   SELECT 'Inception',               'Phong 1',      '14:00:00',  '16:43:00',    85000,  130000 UNION ALL
   SELECT 'The Dark Knight',         'Phong 1',      '18:00:00',  '20:37:00',    90000,  140000 UNION ALL
   SELECT 'Interstellar',            'Phong 2',      '09:00:00',  '11:54:00',    75000,  120000 UNION ALL
   SELECT 'Parasite',                'Phong 2',      '13:00:00',  '15:17:00',    75000,  120000 UNION ALL
   SELECT 'Spider-Man: No Way Home', 'Phong 2',      '17:00:00',  '19:43:00',    80000,  125000 UNION ALL
   SELECT 'Your Name',               'Phong 2',      '20:30:00',  '22:16:00',    80000,  125000 UNION ALL
   SELECT 'Avengers: Endgame',       'Phong VIP',    '19:30:00',  '22:46:00',   150000,  220000 UNION ALL
   SELECT 'Inception',               'Phong VIP',    '15:00:00',  '17:43:00',   150000,  220000
  ) s
JOIN movies m ON m.title = s.mt
JOIN rooms  r ON r.name  = s.rn;

SET FOREIGN_KEY_CHECKS=1;
