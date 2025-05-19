const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 
// bcrypt.hash('Admin@123',10).then(console.log);

const app = express();
const port = 5000;

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // for JWT_SECRET

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'registration_db',
  password: 'postgres',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());


app.post('/register', async (req, res) => {
    const { name, email, rollNo, section, address, password } = req.body;
    try {
      
      const checkUser = await pool.query(
        'SELECT * FROM registrations WHERE email = $1 OR roll_no = $2',
        [email, rollNo]
      );
  
      if (checkUser.rows.length > 0) {
        return res.status(400).send('Email or Roll No already registered');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10); // hash password
  
      await pool.query(
        'INSERT INTO registrations (name, email, roll_no, section, address, password) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, email, rollNo, section, address, hashedPassword]
      );
  
      res.status(200).send('Registration successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM registrations WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).send('Email not found');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

   const isAdmin = email.toLowerCase() === 'admin@example.com';
res.status(200).json({ message: 'Login successful', isAdmin });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/primary-feedback', async (req, res) => {
  const { email, lessonNumber, rating, feedback, language } = req.body;

  try {
    if (!email || !lessonNumber || !rating || !feedback || !language) {
      return res.status(400).send('All fields including language are required');
    }

    await pool.query(
      'INSERT INTO primary_feedback (email, lesson_number, rating, feedback, language) VALUES ($1, $2, $3, $4, $5)',
      [email, lessonNumber, rating, feedback, language]
    );

    res.status(200).send('Feedback submitted successfully');
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).send('Server error while saving feedback');
  }
});


app.post('/secondary-feedback', async (req, res) => {
  const { email, lessonNumber, rating, feedback, language } = req.body;

  try {
    if (!email || !lessonNumber || !rating || !feedback || !language) {
      return res.status(400).send('All fields including language are required');
    }

    await pool.query(
      'INSERT INTO secondary_feedback (email, lesson_number, rating, feedback, language) VALUES ($1, $2, $3, $4, $5)',
      [email, lessonNumber, rating, feedback, language]
    );

    res.status(200).send('Secondary feedback submitted successfully');
  } catch (err) {
    console.error('Error saving secondary feedback:', err);
    res.status(500).send('Server error while saving secondary feedback');
  }
});

app.post('/seniors-feedback', async (req, res) => {
  const { email, lessonNumber, rating, feedback, language } = req.body;

  try {
    if (!email || !lessonNumber || !rating || !feedback || !language) {
      return res.status(400).send('All fields including language are required');
    }

    await pool.query(
      'INSERT INTO senior_feedback (email, lesson_number, rating, feedback, language) VALUES ($1, $2, $3, $4, $5)',
      [email, lessonNumber, rating, feedback, language]
    );

    res.status(200).send('Feedback submitted successfully');
  } catch (err) {
    console.error('Error saving secondary feedback:', err);
    res.status(500).send('Server error while saving secondary feedback');
  }
});

app.post('/admin/add-video', async (req, res) => {
  const { url, description, language, category } = req.body;

  if (!url || !description || !language || !category) {
    return res.status(400).send('All fields are required');
  }

  try {
    await pool.query(
      'INSERT INTO videos (url, description, language, category) VALUES ($1, $2, $3, $4)',
      [url, description, language, category]
    );
    res.status(200).send('Video added successfully');
  } catch (err) {
    console.error('Error adding video:', err);
    res.status(500).send('Server error while adding video');
  }
});

app.get('/videos', async (req, res) => {
  const { category, language } = req.query;

  if (!category || !language) {
    return res.status(400).send('Category and language are required');
  }

  try {
    const result = await pool.query(
      'SELECT url, description FROM videos WHERE category = $1 AND language = $2 ORDER BY id ASC',
      [category.toLowerCase(), language]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).send('Server error fetching videos');
  }
}); 
