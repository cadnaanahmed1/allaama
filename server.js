require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// Replace this line:
// Enhanced CORS configuration
// Add this after your middleware setup
// Configure CORS to allow multiple origins
const whitelist = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Add this pre-flight OPTIONS handler
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('MongoDB Connected');
  initializeDefaultData();
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  console.log('Server will continue running without MongoDB');
});

// Add a connection event listener for better monitoring
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Helper function to validate and fix image URLs
function validateImageUrl(url) {
  if (!url) return null;
  
  // Remove quotes if they exist
  let cleanUrl = url.replace(/^"|"$/g, '');
  
  // Check if it's a valid URL
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch (e) {
    console.error('Invalid image URL:', cleanUrl);
    return null;
  }
}

// Define Schemas and Models
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { 
    type: String, 
    required: [true, 'Course image URL is required'],
    validate: {
      validator: function(v) {
        // Check if it's a valid URL
        try {
          new URL(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Invalid image URL format'
    }
  },
  modules: [{
    title: { type: String, required: true },
    duration: { type: String, required: true },
    lessons: [{
      title: { type: String, required: true },
      duration: { type: String, required: true },
      videoUrl: { type: String }
    }]
  }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'rejected'], default: 'pending' },
  progress: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Password reset storage (keeping this in memory as it's temporary)
const passwordResets = [];

// Helper Functions
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('Email credentials not found. Email functionality will not work.');
    return null;
  }
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
    
    transporter.verify(function(error, success) {
      if (error) {
        console.error('Email transporter verification failed:', error);
      } else {
        console.log('Email transporter is ready to send messages');
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Role-based Authorization
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Initialize database with default data
async function initializeDefaultData() {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, skipping default data initialization');
      return;
    }
    
    console.log('Initializing default data...');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@allaama.com' }).maxTimeMS(5000);
    
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@allaama.com',
        password: bcrypt.hashSync('password', 10),
        role: 'admin',
        createdAt: new Date('2023-01-01')
      });
      
      await adminUser.save();
      console.log('Default admin user created');
    }
    
    // Check if student user exists
    const studentExists = await User.findOne({ email: 'student@allaama.com' }).maxTimeMS(5000);
    
    if (!studentExists) {
      // Create student user
      const studentUser = new User({
        name: 'Student User',
        email: 'student@allaama.com',
        password: bcrypt.hashSync('password', 10),
        role: 'student',
        createdAt: new Date('2023-02-15')
      });
      
      await studentUser.save();
      console.log('Default student user created');
    }
    
    // Check if course exists
    const courseExists = await Course.findOne({ title: 'Advanced Web Development' }).maxTimeMS(5000);
    
    if (!courseExists) {
      // Create default course with explicit image URL
      const defaultCourse = new Course({
        title: "Advanced Web Development",
        description: "Master modern web technologies with this comprehensive course",
        instructor: "Alex Johnson",
        price: 299,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3",
        modules: [
          {
            title: "HTML5 & CSS3 Fundamentals",
            duration: "4 hours",
            lessons: [
              {
                title: "Introduction to HTML5",
                duration: "30 minutes",
                videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE"
              },
              {
                title: "CSS3 Selectors and Properties",
                duration: "45 minutes",
                videoUrl: "https://www.youtube.com/embed/1PnVor36_40"
              }
            ]
          },
          {
            title: "JavaScript ES6+",
            duration: "6 hours",
            lessons: [
              {
                title: "Variables and Data Types",
                duration: "40 minutes",
                videoUrl: "https://www.youtube.com/embed/ZiiirTwyNdw"
              },
              {
                title: "Functions and Scope",
                duration: "50 minutes",
                videoUrl: "https://www.youtube.com/embed/N-wapdCt7pA"
              }
            ]
          },
          {
            title: "React Framework",
            duration: "8 hours",
            lessons: [
              {
                title: "React Components",
                duration: "45 minutes",
                videoUrl: "https://www.youtube.com/embed/Ke90Tj7g0LI"
              },
              {
                title: "State and Props",
                duration: "55 minutes",
                videoUrl: "https://www.youtube.com/embed/0buE1V0gKkY"
              }
            ]
          }
        ]
      });
      
      await defaultCourse.save();
      console.log('Default course created with explicit image URL');
    }
    
    console.log('Default data initialization completed');
  } catch (error) {
    console.error('Error initializing default data:', error);
    // Don't crash the server if initialization fails
  }
}

// Initialize default data on server start
initializeDefaultData();

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    });
    
    await newUser.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return res.json({ 
        message: 'If your email is registered, you will receive a reset code.',
        fallback: true
      });
    }
    
    const resetCode = generateResetCode();
    const resetEntry = {
      email,
      code: resetCode,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      used: false
    };
    
    // Remove any existing reset codes for this email
    for (let i = passwordResets.length - 1; i >= 0; i--) {
      if (passwordResets[i].email === email) {
        passwordResets.splice(i, 1);
      }
    }
    
    passwordResets.push(resetEntry);
    
    console.log(`Password reset code for ${email}: ${resetCode}`);
    
    const transporter = createEmailTransporter();
    
    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Allaama Academy Password Reset',
          text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 15 minutes.`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.json({ 
              message: 'Reset code generated. Email service unavailable. Please check console for code.',
              fallback: true
            });
          } else {
            console.log('Email sent successfully to:', email);
            res.json({ message: 'Reset code sent successfully to your email' });
          }
        });
      } catch (emailError) {
        console.error('Error in email sending process:', emailError);
        res.json({ 
          message: 'Reset code generated. Email service error. Please check console for code.',
          fallback: true
        });
      }
    } else {
      res.json({ 
        message: 'Reset code generated. Email service not configured. Please check console for code.',
        fallback: true
      });
    }
  } catch (error) {
    console.error('Server error during password reset:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Reset Password Route
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const resetEntry = passwordResets.find(r => 
      r.email === email && 
      r.code === code && 
      !r.used && 
      new Date() < new Date(r.expires)
    );
    
    if (!resetEntry) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    
    resetEntry.used = true;
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Token verification endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin settings endpoint
app.put('/api/admin/settings', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    
    // Find admin user
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, adminUser.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Check if username or email already exists (for other users)
    if (username && username !== adminUser.name) {
      const existingUser = await User.findOne({ 
        name: username, 
        _id: { $ne: adminUser._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    
    if (email && email !== adminUser.email) {
      const existingUser = await User.findOne({ 
        email: email, 
        _id: { $ne: adminUser._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    
    // Update admin settings
    if (username) adminUser.name = username;
    if (email) adminUser.email = email;
    if (newPassword) adminUser.password = bcrypt.hashSync(newPassword, 10);
    
    await adminUser.save();
    
    res.json({ 
      message: 'Settings updated successfully',
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public courses endpoint (for non-logged in users)
app.get('/api/public/courses', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning empty courses array');
      return res.json([]); // Return empty array instead of error
    }
    
    const courses = await Course.find().maxTimeMS(5000);
    res.json(courses);
  } catch (error) {
    console.error('Error loading public courses:', error);
    
    // If MongoDB is not connected, return empty array
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      console.log('MongoDB connection issue, returning empty courses array');
      return res.json([]);
    }
    
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// Admin Routes
app.get('/api/admin/courses', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/courses/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// COURSE CREATION
app.post('/api/admin/courses', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { title, description, modules, price, instructor, imageUrl } = req.body;
    
    console.log('Course creation request:', req.body);
    console.log('Image URL received:', imageUrl);
    
    // Validate required fields
    if (!title || !description || !instructor || price === undefined || price === null) {
      return res.status(400).json({ 
        message: 'Title, description, instructor, and price are required fields.' 
      });
    }
    
    // Validate image URL
    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL is required.' 
      });
    }
    
    // Validate and fix image URL
    const validatedImageUrl = validateImageUrl(imageUrl);
    if (!validatedImageUrl) {
      return res.status(400).json({ 
        message: 'Invalid image URL format.' 
      });
    }
    
    console.log('Validated image URL:', validatedImageUrl);
    
    let parsedModules;
    try {
      parsedModules = modules ? JSON.parse(modules) : [];
      console.log('Parsed modules:', parsedModules);
    } catch (parseError) {
      console.error('Error parsing modules JSON:', parseError);
      return res.status(400).json({ 
        message: 'Invalid modules format. Please ensure modules are valid JSON.' 
      });
    }
    
    // Ensure modules is an array
    if (!Array.isArray(parsedModules)) {
      return res.status(400).json({ 
        message: 'Modules must be an array.' 
      });
    }
    
    // Process modules and ensure they have the required structure
    const processedModules = parsedModules.map(module => {
      // Validate module structure
      if (!module.title || !module.duration) {
        throw new Error('Each module must have a title and duration');
      }
      
      const processedModule = {
        title: module.title,
        duration: module.duration,
        lessons: []
      };
      
      // Process lessons if they exist
      if (module.lessons && Array.isArray(module.lessons)) {
        processedModule.lessons = module.lessons.map(lesson => {
          if (!lesson.title || !lesson.duration) {
            throw new Error('Each lesson must have a title and duration');
          }
          
          return {
            title: lesson.title,
            duration: lesson.duration,
            videoUrl: lesson.videoUrl || ''
          };
        });
      }
      
      return processedModule;
    });
    
    console.log('Processed modules:', processedModules);
    
    // Create course with validated image URL
    const newCourse = new Course({
      title,
      description,
      instructor,
      price: Number(price),
      imageUrl: validatedImageUrl,
      modules: processedModules
    });
    
    console.log('New course object before save:', newCourse);
    
    await newCourse.save();
    
    console.log('Course saved successfully:', newCourse);
    
    // Return the saved course with populated data
    const savedCourse = await Course.findById(newCourse._id);
    
    res.status(201).json({ 
      message: 'Course created successfully', 
      course: savedCourse 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: 'Failed to create course: ' + error.message 
    });
  }
});

// COURSE UPDATE
app.put('/api/admin/courses/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { title, description, modules, price, instructor, imageUrl } = req.body;
    
    console.log('Course update request:', req.body);
    console.log('Image URL received:', imageUrl);
    
    // Find the course first
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Validate required fields
    if (!title || !description || !instructor || price === undefined || price === null) {
      return res.status(400).json({ 
        message: 'Title, description, instructor, and price are required fields.' 
      });
    }
    
    // Validate image URL
    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL is required.' 
      });
    }
    
    // Validate and fix image URL
    const validatedImageUrl = validateImageUrl(imageUrl);
    if (!validatedImageUrl) {
      return res.status(400).json({ 
        message: 'Invalid image URL format.' 
      });
    }
    
    console.log('Validated image URL:', validatedImageUrl);
    
    let parsedModules;
    try {
      parsedModules = modules ? JSON.parse(modules) : [];
      console.log('Parsed modules:', parsedModules);
    } catch (parseError) {
      console.error('Error parsing modules JSON:', parseError);
      return res.status(400).json({ 
        message: 'Invalid modules format. Please ensure modules are valid JSON.' 
      });
    }
    
    // Ensure modules is an array
    if (!Array.isArray(parsedModules)) {
      return res.status(400).json({ 
        message: 'Modules must be an array.' 
      });
    }
    
    // Process modules and ensure they have the required structure
    const processedModules = parsedModules.map(module => {
      // Validate module structure
      if (!module.title || !module.duration) {
        throw new Error('Each module must have a title and duration');
      }
      
      const processedModule = {
        title: module.title,
        duration: module.duration,
        lessons: []
      };
      
      // Process lessons if they exist
      if (module.lessons && Array.isArray(module.lessons)) {
        processedModule.lessons = module.lessons.map(lesson => {
          if (!lesson.title || !lesson.duration) {
            throw new Error('Each lesson must have a title and duration');
          }
          
          return {
            title: lesson.title,
            duration: lesson.duration,
            videoUrl: lesson.videoUrl || ''
          };
        });
      }
      
      return processedModule;
    });
    
    console.log('Processed modules:', processedModules);
    
    // Update course fields with validated image URL
    course.title = title;
    course.description = description;
    course.instructor = instructor;
    course.price = Number(price);
    course.imageUrl = validatedImageUrl;
    course.modules = processedModules;
    
    console.log('Course object before save:', course);
    
    await course.save();
    
    console.log('Course updated successfully:', course);
    
    // Return the updated course
    res.json({ 
      message: 'Course updated successfully', 
      course: course 
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ 
      message: 'Failed to update course: ' + error.message 
    });
  }
});

app.delete('/api/admin/courses/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/enrollments', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title instructor');
    
    // Filter out any enrollments where userId or courseId is null
    const validEnrollments = enrollments.filter(enrollment => 
      enrollment.userId && enrollment.courseId
    );
    
    res.json(validEnrollments);
  } catch (error) {
    console.error('Error loading admin enrollments:', error);
    res.status(500).json({ message: 'Failed to load enrollments' });
  }
});

// FIXED: Update enrollment status with real database
app.put('/api/admin/enrollments/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find enrollment by ID
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update status
    enrollment.status = status;
    await enrollment.save();
    
    // Return updated enrollment with populated data
    const updatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('userId', 'name email')
      .populate('courseId', 'title instructor');
    
    res.json({ 
      message: `Enrollment ${status} successfully`, 
      enrollment: updatedEnrollment 
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ message: 'Failed to update enrollment status' });
  }
});

app.get('/api/admin/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/users/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const enrollments = await Enrollment.find({ userId: req.params.id })
      .populate('courseId', 'title instructor');
    
    res.json({ user, enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Routes
app.get('/api/student/courses', authenticateToken, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning empty courses array');
      return res.json([]); // Return empty array instead of error
    }
    
    const courses = await Course.find().maxTimeMS(5000);
    res.json(courses);
  } catch (error) {
    console.error('Error loading student courses:', error);
    
    // If MongoDB is not connected, return empty array
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      console.log('MongoDB connection issue, returning empty courses array');
      return res.json([]);
    }
    
    res.status(500).json({ message: 'Failed to load courses' });
  }
});

// Add error handling middleware to catch all errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.post('/api/student/enroll', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if courseId is provided and valid
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    // Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    
    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create new enrollment
    const newEnrollment = new Enrollment({
      userId: req.user.id,
      courseId,
      status: 'pending'
    });
    
    await newEnrollment.save();
    
    // Populate course details
    const populatedEnrollment = await Enrollment.findById(newEnrollment._id)
      .populate('courseId');
    
    res.status(201).json({ 
      message: 'Enrollment request submitted successfully', 
      enrollment: populatedEnrollment,
      paymentInfo: {
        contactNumber: '+252 661142158',
        paymentNumber: '+252 0771351394',
        warning: 'Please do not confuse the Contact Number with the Payment Number. Use the Contact Number only for communication. Use the Payment Number only for sending your course fee.',
        instruction: 'After sending the payment, please send your username via WhatsApp to the contact number. The admin will verify your payment and approve your enrollment.'
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid enrollment data' });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    }
    
    res.status(500).json({ message: 'Failed to process enrollment' });
  }
});

app.get('/api/student/dashboard', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate('courseId');
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add endpoint to get course details with videos for enrolled students
app.get('/api/student/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if student is enrolled and has access
    const enrollment = await Enrollment.findOne({ 
      userId: req.user.id, 
      courseId: courseId,
      status: 'active'
    });
    
    if (!enrollment) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/student/progress/:enrollmentId', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      userId: req.user.id
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    enrollment.progress = progress;
    
    if (progress === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.certificateIssued = true;
    }
    
    await enrollment.save();
    
    res.json({ message: 'Progress updated successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to MongoDB`);
  console.log(`Test accounts:`);
  console.log(`Admin: admin@allaama.com / password`);
  console.log(`Student: student@allaama.com / password`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`⚠️ Email service not configured. Set EMAIL_USER and EMAIL_PASS in .env for password reset emails.`);
  }
});
