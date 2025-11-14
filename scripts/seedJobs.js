/**
 * Run this script to seed the `jobs` collection:
 *
 * Set env var `MONGODB_URI` first, then:
 *   node scripts/seedJobs.js
 */

// Prefer .env.local (Next.js convention) but fall back to default .env
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI environment variable (or add it to .env.local) and re-run the script.');
  process.exit(1);
}

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  requiredSkills: [String],
  experienceLevel: String,
  type: String,
  description: String,
  postedAt: Date,
});

const Job = mongoose.model('Job', JobSchema);

const seedJobs = [
  {
    title: 'Frontend Intern',
    company: 'Tech Youth Lab',
    location: 'Remote',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
    track: 'Web Development',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Work with the frontend team building UI components and landing pages.',
    postedAt: new Date(),
  },
  {
    title: 'Junior Web Developer',
    company: 'Dhaka Web Studio',
    location: 'Dhaka (Hybrid)',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'Git'],
    track: 'Web Development',
    experienceLevel: 'Junior',
    type: 'Full-time',
    description: 'Assist in building and maintaining client websites.',
    postedAt: new Date(),
  },
  {
    title: 'Communication & Content Intern',
    company: 'Youth Impact Org',
    location: 'Remote',
    requiredSkills: ['Communication', 'Writing', 'English'],
    track: 'Communications',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Write social content and help manage communications.',
    postedAt: new Date(),
  },
  {
    title: 'Data Entry Assistant',
    company: 'Campus Services',
    location: 'Onsite - Dhaka',
    requiredSkills: ['Excel', 'Attention to detail'],
    track: 'Administration',
    experienceLevel: 'Fresher',
    type: 'Part-time',
    description: 'Support data cleaning and entry tasks for research projects.',
    postedAt: new Date(),
  },
  {
    title: 'Support Engineer (Junior)',
    company: 'Startup HelpDesk',
    location: 'Remote',
    requiredSkills: ['Customer Support', 'Communication', 'Troubleshooting'],
    track: 'Support',
    experienceLevel: 'Fresher',
    type: 'Full-time',
    description: 'First-line support answering user queries and troubleshooting simple issues.',
    postedAt: new Date(),
  },
  {
    title: 'Graphic Design Intern',
    company: 'DesignWorks',
    location: 'Remote',
    requiredSkills: ['Figma', 'Illustrator', 'Creativity'],
    track: 'Design',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Produce marketing creatives and assist the design team.',
    postedAt: new Date(),
  },
  {
    title: 'Content Writer (Part-time)',
    company: 'EduContent',
    location: 'Remote',
    requiredSkills: ['Writing', 'Research'],
    track: 'Content',
    experienceLevel: 'Fresher',
    type: 'Part-time',
    description: 'Write short articles and learning materials for students.',
    postedAt: new Date(),
  },
  {
    title: 'QA Tester (Entry)',
    company: 'QualitySoft',
    location: 'Dhaka (Onsite)',
    requiredSkills: ['Testing', 'Attention to detail', 'Basic scripting'],
    track: 'Quality Assurance',
    experienceLevel: 'Fresher',
    type: 'Full-time',
    description: 'Execute test cases and report bugs for web applications.',
    postedAt: new Date(),
  },
  {
    title: 'Sales Intern',
    company: 'Campus Sales',
    location: 'Remote',
    requiredSkills: ['Communication', 'CRM basics'],
    track: 'Sales',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Help outreach to potential clients and support sales operations.',
    postedAt: new Date(),
  },
  {
    title: 'Social Media Assistant',
    company: 'BrandUp',
    location: 'Remote',
    requiredSkills: ['Social Media', 'Content Creation'],
    track: 'Marketing',
    experienceLevel: 'Fresher',
    type: 'Part-time',
    description: 'Manage social accounts and schedule posts.',
    postedAt: new Date(),
  },
  {
    title: 'Backend Intern (Node.js)',
    company: 'API Labs',
    location: 'Remote',
    requiredSkills: ['Node.js', 'Express', 'Databases'],
    track: 'Backend',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Work on API endpoints and database interactions.',
    postedAt: new Date(),
  },
  {
    title: 'Junior Data Analyst',
    company: 'Insight Analytics',
    location: 'Hybrid - Dhaka',
    requiredSkills: ['Excel', 'SQL', 'Data visualization'],
    track: 'Data',
    experienceLevel: 'Junior',
    type: 'Full-time',
    description: 'Support data reporting and dashboard creation.',
    postedAt: new Date(),
  },
  {
    title: 'IT Support Intern',
    company: 'University IT',
    location: 'Onsite - Campus',
    requiredSkills: ['Hardware basics', 'Troubleshooting'],
    track: 'IT',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Assist with campus IT support tickets and maintenance.',
    postedAt: new Date(),
  },
  {
    title: 'Junior Product Analyst',
    company: 'Productify',
    location: 'Remote',
    requiredSkills: ['Product thinking', 'SQL', 'A/B testing basics'],
    track: 'Product',
    experienceLevel: 'Junior',
    type: 'Full-time',
    description: 'Help analyze product metrics and user behavior.',
    postedAt: new Date(),
  },
  {
    title: 'Marketing Intern',
    company: 'GrowthStart',
    location: 'Remote',
    requiredSkills: ['Marketing basics', 'Analytics', 'Copywriting'],
    track: 'Marketing',
    experienceLevel: 'Fresher',
    type: 'Internship',
    description: 'Support campaigns, analytics and creative briefs.',
    postedAt: new Date(),
  },
  {
    title: 'Research Assistant (Part-time)',
    company: 'EduLab',
    location: 'Remote',
    requiredSkills: ['Research', 'Documentation'],
    track: 'Research',
    experienceLevel: 'Fresher',
    type: 'Part-time',
    description: 'Assist academic research with data collection and notes.',
    postedAt: new Date(),
  },
  {
    title: 'Freelance Web Content Creator',
    company: 'Freelance',
    location: 'Remote',
    requiredSkills: ['Writing', 'SEO', 'Content strategy'],
    track: 'Content',
    experienceLevel: 'Fresher',
    type: 'Freelance',
    description: 'Produce web articles and SEO content for clients.',
    postedAt: new Date(),
  }
];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'jobmart' });
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    console.log('Cleared existing jobs collection');

    await Job.insertMany(seedJobs);
    console.log(`Inserted ${seedJobs.length} job documents`);

    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

main();
