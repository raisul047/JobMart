import { User } from '@/types/user.type';

// Lightweight demo user for dashboard recommendations and local development
const demoUser: User = {
  id: 'demo-user-1',
  name: 'Aisha Rahman',
  email: 'aisha@example.com',
  isVerified: true,
  profileImageUrl: '',
  educationLevel: 'Bachelor',
  experienceLevel: 'Fresher',
  cvText: '',
  skills: ['React', 'TypeScript', 'Node.js', 'HTML', 'CSS'],
  experiences: [],
  desiredJobRoles: ['Frontend Developer', 'Web Developer'],
  desiredLocations: ['Remote', 'Dhaka'],
};

export default demoUser;
