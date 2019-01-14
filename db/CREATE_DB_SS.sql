CREATE TABLE IF NOT EXISTS users(
  userid INT AUTO_INCREMENT,
  PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS times(
  timeid INT AUTO_INCREMENT,
  userid INT NOT NULL,
  timeofperiod INT NOT NULL,
  dateofperiod DATE NOT NULL,
  typeofperiod ENUM('study', 'break'),
  PRIMARY KEY (timeid),
  FOREIGN KEY (userid) REFERENCES users(userid)
);
