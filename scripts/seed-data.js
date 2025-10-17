import axios from 'axios';

// API Base URLs
const STUDENT_API = 'http://localhost:3001/api';
const FEEDBACK_API = 'http://localhost:3002/api';

// Sample Students Data
const students = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    department: "Computer Science",
    year: 3,
    rollNumber: "CS2022001"
  },
  {
    name: "Priya Patel",
    email: "priya.patel@example.com",
    department: "Information Technology",
    year: 2,
    rollNumber: "IT2023015"
  },
  {
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    department: "Electronics",
    year: 4,
    rollNumber: "EC2021032"
  },
  {
    name: "Sneha Desai",
    email: "sneha.desai@example.com",
    department: "Computer Science",
    year: 2,
    rollNumber: "CS2023045"
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    department: "Mechanical",
    year: 3,
    rollNumber: "ME2022018"
  },
  {
    name: "Divya Singh",
    email: "divya.singh@example.com",
    department: "Civil",
    year: 1,
    rollNumber: "CV2024007"
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    department: "Information Technology",
    year: 3,
    rollNumber: "IT2022029"
  },
  {
    name: "Ananya Joshi",
    email: "ananya.joshi@example.com",
    department: "Computer Science",
    year: 4,
    rollNumber: "CS2021056"
  },
  {
    name: "Karan Shah",
    email: "karan.shah@example.com",
    department: "Electrical",
    year: 2,
    rollNumber: "EE2023011"
  },
  {
    name: "Meera Iyer",
    email: "meera.iyer@example.com",
    department: "Electronics",
    year: 3,
    rollNumber: "EC2022067"
  },
  {
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    department: "Computer Science",
    year: 1,
    rollNumber: "CS2024089"
  },
  {
    name: "Pooja Nair",
    email: "pooja.nair@example.com",
    department: "Information Technology",
    year: 4,
    rollNumber: "IT2021043"
  }
];

// Sample Feedback Templates
const feedbackTemplates = [
  {
    subject: "Data Structures and Algorithms",
    feedback: "Excellent teaching methodology! The professor explains complex concepts with clarity. The practical examples really helped in understanding.",
    rating: 5,
    category: "Teaching",
    semester: "3"
  },
  {
    subject: "Database Management Systems",
    feedback: "Good course content but could use more hands-on lab sessions. The theory is well covered.",
    rating: 4,
    category: "Teaching",
    semester: "4"
  },
  {
    subject: "Computer Networks",
    feedback: "Very informative lectures with real-world applications. The instructor is very knowledgeable.",
    rating: 5,
    category: "Teaching",
    semester: "5"
  },
  {
    subject: "Library Facilities",
    feedback: "The library has a good collection of books, but it would be great to have more digital resources and extended hours during exams.",
    rating: 4,
    category: "Facilities",
    semester: "3"
  },
  {
    subject: "Campus Infrastructure",
    feedback: "Well-maintained campus with modern facilities. The WiFi coverage could be improved in some areas.",
    rating: 4,
    category: "Infrastructure",
    semester: "2"
  },
  {
    subject: "Web Development",
    feedback: "Amazing hands-on experience! The project-based learning approach is very effective.",
    rating: 5,
    category: "Teaching",
    semester: "6"
  },
  {
    subject: "Sports Facilities",
    feedback: "Good sports infrastructure. The gym equipment needs regular maintenance.",
    rating: 3,
    category: "Facilities",
    semester: "4"
  },
  {
    subject: "Machine Learning",
    feedback: "Challenging but rewarding course. The professor provides excellent guidance for projects.",
    rating: 5,
    category: "Teaching",
    semester: "7"
  },
  {
    subject: "Hostel Accommodation",
    feedback: "Clean and well-maintained hostel rooms. The mess food quality has improved significantly.",
    rating: 4,
    category: "Facilities",
    semester: "5"
  },
  {
    subject: "Operating Systems",
    feedback: "Good theoretical knowledge but needs more practical labs for better understanding.",
    rating: 4,
    category: "Teaching",
    semester: "4"
  },
  {
    subject: "Examination Process",
    feedback: "Well-organized exam schedule. The online portal for results is very convenient.",
    rating: 4,
    category: "Administration",
    semester: "6"
  },
  {
    subject: "Software Engineering",
    feedback: "Comprehensive coverage of SDLC concepts. The case studies are very helpful.",
    rating: 5,
    category: "Teaching",
    semester: "5"
  },
  {
    subject: "Canteen Services",
    feedback: "Affordable prices and decent food quality. More healthy options would be appreciated.",
    rating: 3,
    category: "Facilities",
    semester: "2"
  },
  {
    subject: "Placement Cell",
    feedback: "Excellent support from the placement team. Good number of companies visiting campus.",
    rating: 5,
    category: "Administration",
    semester: "8"
  },
  {
    subject: "Computer Graphics",
    feedback: "Interesting subject with good visual demonstrations. More project work would enhance learning.",
    rating: 4,
    category: "Teaching",
    semester: "6"
  }
];

// Function to create students
async function createStudents() {
  console.log('📚 Creating students...\n');
  const createdStudents = [];

  for (const student of students) {
    try {
      const response = await axios.post(`${STUDENT_API}/students`, student);
      createdStudents.push(response.data.data);
      console.log(`✅ Created: ${student.name} (${student.rollNumber})`);
    } catch (error) {
      console.error(`❌ Failed to create ${student.name}:`, error.response?.data?.message || error.message);
    }
  }

  return createdStudents;
}

// Function to create feedbacks
async function createFeedbacks(students) {
  console.log('\n💬 Creating feedbacks...\n');
  
  let feedbackCount = 0;

  for (const student of students) {
    // Each student gives 2-4 random feedbacks
    const numFeedbacks = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numFeedbacks; i++) {
      const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
      
      const feedback = {
        studentId: student._id,
        subject: template.subject,
        feedback: template.feedback,
        rating: template.rating,
        category: template.category,
        semester: template.semester,
        isAnonymous: Math.random() > 0.7 // 30% chance of anonymous
      };

      try {
        await axios.post(`${FEEDBACK_API}/feedbacks`, feedback);
        feedbackCount++;
        const displayName = feedback.isAnonymous ? '🎭 Anonymous' : student.name;
        console.log(`✅ Feedback ${feedbackCount}: ${displayName} → ${template.subject}`);
      } catch (error) {
        console.error(`❌ Failed to create feedback:`, error.response?.data?.message || error.message);
      }
    }
  }

  return feedbackCount;
}

// Main function
async function seedDatabase() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌱 Seeding Student Feedback System Database');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Create students
    const createdStudents = await createStudents();
    console.log(`\n📊 Total students created: ${createdStudents.length}`);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create feedbacks
    const feedbackCount = await createFeedbacks(createdStudents);
    console.log(`\n📊 Total feedbacks created: ${feedbackCount}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🌐 Visit your app to see the data:');
    console.log('   Dashboard:  http://localhost:5173/');
    console.log('   Students:   http://localhost:5173/students');
    console.log('   Feedbacks:  http://localhost:5173/feedbacks');
    console.log('   Reports:    http://localhost:5173/reports\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();