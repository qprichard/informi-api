--
-- Table structure for table `test`
--
CREATE TABLE IF NOT EXISTS `test` (
  `id`  int PRIMARY KEY
);

--
-- Table structure for table `users`
--
CREATE TABLE IF NOT EXISTS `users` (
  `login` varchar(20) PRIMARY KEY,
  `password` varbinary(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL
);
