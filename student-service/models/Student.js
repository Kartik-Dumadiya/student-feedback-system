import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT'],
    default: 'Computer Science'
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 1
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add index for faster queries
studentSchema.index({ email: 1, rollNumber: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;