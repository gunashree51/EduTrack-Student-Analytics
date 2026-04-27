export const DEMO_STUDENTS = [
  { id:1, fullName:"Arjun Sharma",  rollNumber:"S001", email:"arjun@school.com",  className:"10th Grade", section:"A", status:"ACTIVE",   parentName:"Rajesh Sharma" },
  { id:2, fullName:"Priya Patel",   rollNumber:"S002", email:"priya@school.com",  className:"10th Grade", section:"A", status:"ACTIVE",   parentName:"Suresh Patel"  },
  { id:3, fullName:"Rohit Verma",   rollNumber:"S003", email:"rohit@school.com",  className:"10th Grade", section:"B", status:"ACTIVE",   parentName:"Anil Verma"    },
  { id:4, fullName:"Sneha Gupta",   rollNumber:"S004", email:"sneha@school.com",  className:"9th Grade",  section:"A", status:"INACTIVE", parentName:"Mohan Gupta"   },
  { id:5, fullName:"Kavya Nair",    rollNumber:"S005", email:"kavya@school.com",  className:"9th Grade",  section:"B", status:"ACTIVE",   parentName:"Sunil Nair"    },
  { id:6, fullName:"Aarav Mehta",   rollNumber:"S006", email:"aarav@school.com",  className:"11th Grade", section:"A", status:"ACTIVE",   parentName:"Dinesh Mehta"  },
  { id:7, fullName:"Zara Khan",     rollNumber:"S007", email:"zara@school.com",   className:"11th Grade", section:"B", status:"ACTIVE",   parentName:"Imran Khan"    },
  { id:8, fullName:"Dev Sharma",    rollNumber:"S008", email:"dev@school.com",    className:"12th Grade", section:"A", status:"ACTIVE",   parentName:"Rakesh Sharma" },
];

export const DEMO_ATTENDANCE = [
  { id:1, student:{fullName:"Arjun Sharma"}, date:"2024-01-15", subject:"Mathematics", status:"PRESENT", remarks:"" },
  { id:2, student:{fullName:"Priya Patel"},  date:"2024-01-15", subject:"Mathematics", status:"PRESENT", remarks:"" },
  { id:3, student:{fullName:"Rohit Verma"},  date:"2024-01-15", subject:"Mathematics", status:"ABSENT",  remarks:"Sick leave" },
  { id:4, student:{fullName:"Sneha Gupta"},  date:"2024-01-16", subject:"Science",     status:"LATE",    remarks:"Bus delay" },
  { id:5, student:{fullName:"Kavya Nair"},   date:"2024-01-16", subject:"Science",     status:"PRESENT", remarks:"" },
  { id:6, student:{fullName:"Aarav Mehta"},  date:"2024-01-17", subject:"English",     status:"PRESENT", remarks:"" },
  { id:7, student:{fullName:"Zara Khan"},    date:"2024-01-17", subject:"History",     status:"PRESENT", remarks:"" },
  { id:8, student:{fullName:"Dev Sharma"},   date:"2024-01-18", subject:"Physics",     status:"ABSENT",  remarks:"Medical appointment" },
];

export const DEMO_GRADES = [
  { id:1, student:{fullName:"Arjun Sharma"}, subject:"Mathematics",  examType:"Midterm",    marksObtained:85, totalMarks:100, grade:"A",  academicYear:"2024-25", remarks:"Excellent" },
  { id:2, student:{fullName:"Priya Patel"},  subject:"Mathematics",  examType:"Midterm",    marksObtained:92, totalMarks:100, grade:"A+", academicYear:"2024-25", remarks:"Outstanding" },
  { id:3, student:{fullName:"Rohit Verma"},  subject:"Science",      examType:"Final",      marksObtained:65, totalMarks:100, grade:"C+", academicYear:"2024-25", remarks:"Needs improvement" },
  { id:4, student:{fullName:"Sneha Gupta"},  subject:"English",      examType:"Quiz",       marksObtained:78, totalMarks:100, grade:"B+", academicYear:"2024-25", remarks:"Good effort" },
  { id:5, student:{fullName:"Kavya Nair"},   subject:"History",      examType:"Assignment", marksObtained:88, totalMarks:100, grade:"A",  academicYear:"2024-25", remarks:"" },
  { id:6, student:{fullName:"Aarav Mehta"},  subject:"Computer Sci", examType:"Final",      marksObtained:96, totalMarks:100, grade:"A+", academicYear:"2024-25", remarks:"Top of class" },
  { id:7, student:{fullName:"Zara Khan"},    subject:"Physics",      examType:"Unit Test",  marksObtained:73, totalMarks:100, grade:"B",  academicYear:"2024-25", remarks:"Steady progress" },
  { id:8, student:{fullName:"Dev Sharma"},   subject:"Chemistry",    examType:"Midterm",    marksObtained:81, totalMarks:100, grade:"A",  academicYear:"2024-25", remarks:"Well done" },
];
