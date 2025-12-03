-- Create grade_requests table
CREATE TABLE IF NOT EXISTS grade_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  grade_level VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  teacher_name VARCHAR(255) NOT NULL,
  request_type ENUM('edit', 'rewrite') NOT NULL,
  reason TEXT NOT NULL,
  quarter INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL, -- NULL for all admins
  user_type ENUM('admin', 'teacher', 'student') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'grade_request', 'delete_request', etc.
  reference_id INT NULL, -- ID of the related item
  `read` BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_type (user_type),
  INDEX `idx_read` (`read`),
  INDEX idx_created_at (created_at)
);
