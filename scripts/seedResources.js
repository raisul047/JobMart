// Seed learning resources into `resources` collection
// Usage: set MONGODB_URI in .env.local then run: node scripts/seedResources.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in .env.local before running this script.');
  process.exit(1);
}

const ResourceSchema = new mongoose.Schema({
  title: String,
  platform: String,
  url: String,
  relatedSkills: [String],
  cost: String,
  description: String,
  postedAt: Date,
});

const Resource = mongoose.model('Resource', ResourceSchema);

const seedResources = [
  { title: 'HTML Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', relatedSkills: ['HTML', 'CSS'], cost: 'Free', description: 'Beginner-friendly HTML and CSS crash course.', postedAt: new Date() },
  { title: 'Responsive Web Design', platform: 'Coursera', url: 'https://www.coursera.org/learn/responsive-web-design', relatedSkills: ['HTML', 'CSS', 'Responsive Design'], cost: 'Free', description: 'Responsive design fundamentals.', postedAt: new Date() },
  { title: 'JavaScript Basics', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', relatedSkills: ['JavaScript'], cost: 'Free', description: 'Intro to JS concepts.', postedAt: new Date() },
  { title: 'Modern React with Redux', platform: 'Udemy', url: 'https://www.udemy.com/course/react-redux/', relatedSkills: ['React', 'JavaScript'], cost: 'Paid', description: 'React fundamentals and patterns.', postedAt: new Date() },
  { title: 'Frontend Masters - Intro to CSS', platform: 'Frontend Masters', url: 'https://frontendmasters.com/courses/css/', relatedSkills: ['CSS'], cost: 'Paid', description: 'Deep CSS course.', postedAt: new Date() },
  { title: 'Excel Essentials', platform: 'Coursera', url: 'https://www.coursera.org/learn/excel', relatedSkills: ['Excel'], cost: 'Free', description: 'Excel for data tasks.', postedAt: new Date() },
  { title: 'SQL for Data Science', platform: 'Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science', relatedSkills: ['SQL'], cost: 'Free', description: 'SQL basics for analysis.', postedAt: new Date() },
  { title: 'Intro to Data Analysis', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', relatedSkills: ['Data', 'Excel'], cost: 'Free', description: 'Data analysis starter.', postedAt: new Date() },
  { title: 'Effective Communication', platform: 'Coursera', url: 'https://www.coursera.org/learn/wharton-communication', relatedSkills: ['Communication'], cost: 'Free', description: 'Communication skills for work.', postedAt: new Date() },
  { title: 'Copywriting for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/copywriting/', relatedSkills: ['Writing', 'Marketing'], cost: 'Paid', description: 'Writing persuasive copy.', postedAt: new Date() },
  { title: 'Figma UI Design', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', relatedSkills: ['Figma', 'Design'], cost: 'Free', description: 'Figma basics and prototyping.', postedAt: new Date() },
  { title: 'Git & GitHub Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', relatedSkills: ['Git'], cost: 'Free', description: 'Version control essentials.', postedAt: new Date() },
  { title: 'Node.js, Express & MongoDB', platform: 'Udemy', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', relatedSkills: ['Node.js', 'Express', 'MongoDB'], cost: 'Paid', description: 'Backend fundamentals.', postedAt: new Date() },
  { title: 'Intro to Machine Learning', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', relatedSkills: ['Machine Learning'], cost: 'Free', description: 'ML basics (Andrew Ng).', postedAt: new Date() },
  { title: 'SEO Basics', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=7Q1q0b2lvxI', relatedSkills: ['SEO', 'Marketing'], cost: 'Free', description: 'Search engine optimization primer.', postedAt: new Date() },
  { title: 'Customer Support Fundamentals', platform: 'Coursera', url: 'https://www.coursera.org/learn/customer-service-fundamentals', relatedSkills: ['Customer Support', 'Communication'], cost: 'Free', description: 'Support best practices.', postedAt: new Date() },
  { title: 'A/B Testing for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/ab-testing/', relatedSkills: ['A/B testing', 'Product'], cost: 'Paid', description: 'Testing and experimentation basics.', postedAt: new Date() },
  { title: 'Public Speaking Essentials', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=1jx4wqT3R8w', relatedSkills: ['Communication', 'Public Speaking'], cost: 'Free', description: 'Techniques for public speaking.', postedAt: new Date() }
];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'jobmart' });
    console.log('Connected to MongoDB');

    await Resource.deleteMany({});
    console.log('Cleared existing resources collection');

    await Resource.insertMany(seedResources);
    console.log(`Inserted ${seedResources.length} resource documents`);

    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

main();
