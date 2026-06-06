import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medic',
  port: 3306, // Ensure this matches the port shown in XAMPP
  waitForConnections: true,
  connectionLimit: 10,
});