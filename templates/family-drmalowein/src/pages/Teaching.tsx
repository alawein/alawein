import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Calendar, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dr. M. Alowein Teaching
 * Academic Portfolio - Family Platform
 */
const currentCourses = [
  {
    code: 'CS 584',
    name: 'Machine Learning for Science',
    semester: 'Fall 2024',
    students: 45,
    schedule: 'Tue/Thu 2:00-3:30 PM',
    location: 'Engineering Hall 302',
    rating: 4.8,
    description: 'Introduction to ML methods for scientific applications. Topics include neural networks, GNNs, and transformers for molecular and materials science.',
  },
  {
    code: 'CS 789',
    name: 'Quantum Computing',
    semester: 'Fall 2024',
    students: 28,
    schedule: 'Mon/Wed 10:00-11:30 AM',
    location: 'Physics Building 105',
    rating: 4.9,
    description: 'Graduate seminar on quantum algorithms. Focus on VQE, QAOA, quantum ML, and applications to chemistry and optimization.',
  },
];

const pastCourses = [
  { code: 'CS 584', name: 'Machine Learning for Science', semesters: ['Spring 2024', 'Fall 2023', 'Spring 2023'], avgRating: 4.7 },
  { code: 'CS 789', name: 'Quantum Computing', semesters: ['Spring 2024', 'Fall 2023'], avgRating: 4.9 },
  { code: 'CS 410', name: 'Introduction to AI', semesters: ['Fall 2022', 'Spring 2022'], avgRating: 4.5 },
  { code: 'CS 680', name: 'Deep Learning', semesters: ['Spring 2023'], avgRating: 4.6 },
];

const students = [
  { name: 'Sarah Chen', degree: 'PhD', year: '4th Year', topic: 'Graph Neural Networks for Materials' },
  { name: 'Michael Park', degree: 'PhD', year: '3rd Year', topic: 'Quantum Machine Learning' },
  { name: 'Emily Rodriguez', degree: 'PhD', year: '2nd Year', topic: 'Drug Discovery with RL' },
  { name: 'David Kim', degree: 'MS', year: 'Graduated 2024', topic: 'Crystal Structure Prediction' },
];

export default function Teaching() {
  return (
    <div className="container pt-24 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">TEACHING</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Teaching & Mentoring</h1>
        <p className="text-muted-foreground mb-8">Courses, student supervision, and academic mentorship</p>
      </motion.div>

      {/* Current Courses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold mb-6">Current Courses</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {currentCourses.map((course, index) => (
            <motion.div key={course.code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.1 }}
              className="glass-card p-6 hover-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-primary">{course.code}</span>
                  <h3 className="text-xl font-bold">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.semester}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-current" /> {course.rating}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> {course.students} students</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /> {course.schedule}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Past Courses */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold mb-6">Course History</h2>
        <div className="glass-card overflow-hidden mb-12">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Semesters Taught</th>
                <th className="p-4 font-semibold text-center">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {pastCourses.map((course) => (
                <tr key={course.code} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <span className="text-primary font-medium">{course.code}</span> - {course.name}
                  </td>
                  <td className="p-4 text-muted-foreground">{course.semesters.join(', ')}</td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /> {course.avgRating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Current Students */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold mb-6">Graduate Students</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {students.map((student, index) => (
            <motion.div key={student.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{student.name}</h4>
                <p className="text-sm text-muted-foreground">{student.degree} • {student.year}</p>
                <p className="text-sm text-primary">{student.topic}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Office Hours CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 text-center">
        <Calendar className="w-10 h-10 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Office Hours</h2>
        <p className="text-muted-foreground mb-4">Thursdays 3:30-5:00 PM • Engineering Hall 420</p>
        <p className="text-sm text-muted-foreground mb-6">No appointment needed. Graduate students and postdocs welcome.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
          Schedule Meeting <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

