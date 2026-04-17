-- ============================================================
--  Crime Record Management System — MySQL Schema + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS crime_db;
USE crime_db;

-- ─── POLICE STATION ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS police_station (
  Station_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Station_Name VARCHAR(100) NOT NULL,
  Location     VARCHAR(200),
  Contact_No   VARCHAR(20)
);

-- ─── OFFICER ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS officer (
  Officer_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Officer_Name VARCHAR(100) NOT NULL,
  Officer_Rank VARCHAR(50),
  Phone        VARCHAR(20),
  Station_ID   INT,
  FOREIGN KEY (Station_ID) REFERENCES police_station(Station_ID) ON DELETE SET NULL
);

-- ─── CRIMINAL ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS criminal (
  Criminal_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Criminal_Name VARCHAR(100) NOT NULL,
  Gender        ENUM('Male','Female','Other'),
  DOB           DATE,
  Address       TEXT
);

-- ─── VICTIM ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS victim (
  Victim_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Victim_Name VARCHAR(100) NOT NULL,
  Gender      ENUM('Male','Female','Other'),
  Phone       VARCHAR(20),
  Address     TEXT
);

-- ─── CASES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cases (
  Case_ID     INT AUTO_INCREMENT PRIMARY KEY,
  Case_Date   DATE NOT NULL,
  Case_Status VARCHAR(50) NOT NULL,
  Description TEXT,
  Station_ID  INT,
  Officer_ID  INT,
  FOREIGN KEY (Station_ID) REFERENCES police_station(Station_ID) ON DELETE SET NULL,
  FOREIGN KEY (Officer_ID) REFERENCES officer(Officer_ID) ON DELETE SET NULL
);

-- ─── FIR ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fir (
  FIR_No    INT AUTO_INCREMENT PRIMARY KEY,
  FIR_Date  DATE NOT NULL,
  Case_ID   INT,
  Victim_ID INT,
  FOREIGN KEY (Case_ID) REFERENCES cases(Case_ID) ON DELETE CASCADE,
  FOREIGN KEY (Victim_ID) REFERENCES victim(Victim_ID) ON DELETE SET NULL
);

-- ─── EVIDENCE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evidence (
  Evidence_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Evidence_Type VARCHAR(100),
  Description   TEXT,
  Case_ID       INT,
  FOREIGN KEY (Case_ID) REFERENCES cases(Case_ID) ON DELETE CASCADE
);

-- ─── ARREST ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS arrest (
  Arrest_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Arrest_Date DATE NOT NULL,
  Criminal_ID INT,
  Case_ID     INT,
  FOREIGN KEY (Criminal_ID) REFERENCES criminal(Criminal_ID) ON DELETE SET NULL,
  FOREIGN KEY (Case_ID) REFERENCES cases(Case_ID) ON DELETE SET NULL
);

-- ─── LOGIN ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login (
  Login_ID   INT AUTO_INCREMENT PRIMARY KEY,
  Username   VARCHAR(100) NOT NULL UNIQUE,
  Password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  Role       ENUM('officer','victim','criminal') NOT NULL,
  User_ID    INT NOT NULL,           -- FK to respective role table
  Last_Login DATETIME
);

-- ─── LOGIN LOG ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_log (
  Log_ID     INT AUTO_INCREMENT PRIMARY KEY,
  Username   VARCHAR(100) NOT NULL,
  Login_Time DATETIME NOT NULL
);

-- ============================================================
--  SEED DATA
--  Passwords are bcrypt hashes of: Password@123
-- ============================================================

INSERT INTO police_station (Station_Name, Location, Contact_No) VALUES
('Central Police Station', 'Downtown, City Center', '011-2345678'),
('North Zone Station',     '12 North Avenue',       '011-8765432');

INSERT INTO officer (Officer_Name, Officer_Rank, Phone, Station_ID) VALUES
('Inspector Sharma', 'Inspector', '9876543210', 1),
('SI Verma',         'Sub-Inspector', '9123456780', 2);

INSERT INTO criminal (Criminal_Name, Gender, DOB, Address) VALUES
('Rajan Mehta', 'Male', '1985-06-15', '45 Dark Lane, Old City'),
('Priya Singh', 'Female', '1992-11-22', '7 Slum Block B');

INSERT INTO victim (Victim_Name, Gender, Phone, Address) VALUES
('Amit Gupta',  'Male',   '9000000001', '10 Peaceful St'),
('Sunita Patel','Female', '9000000002', '22 Green Park');

INSERT INTO cases (Case_Date, Case_Status, Description, Station_ID, Officer_ID) VALUES
('2024-01-10', 'Open',   'Armed robbery near central market', 1, 1),
('2024-03-05', 'Closed', 'Vehicle theft case resolved',       2, 2);

INSERT INTO fir (FIR_Date, Case_ID, Victim_ID) VALUES
('2024-01-10', 1, 1),
('2024-03-05', 2, 2);

INSERT INTO evidence (Evidence_Type, Description, Case_ID) VALUES
('CCTV Footage', 'Camera footage from ATM near crime scene', 1),
('Weapon',       'Knife recovered from accused',              1),
('Vehicle',      'Stolen vehicle recovered from warehouse',   2);

INSERT INTO arrest (Arrest_Date, Criminal_ID, Case_ID) VALUES
('2024-01-15', 1, 1),
('2024-03-10', 2, 2);

-- Passwords are bcrypt hash of: Password@123
-- You can generate fresh hashes with: require('bcryptjs').hashSync('Password@123', 10)
INSERT INTO login (Username, Password, Role, User_ID) VALUES
('officer_sharma', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'officer',  1),
('victim_amit',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'victim',   1),
('criminal_rajan', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'criminal', 1);
