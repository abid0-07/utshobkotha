// Dummy data for events
export const upcomingEvents = [
  {
    id: "1",
    title: "Advanced Machine Learning Workshop",
    description:
      "This workshop will cover advanced topics in machine learning, including deep learning, neural networks, and practical applications. Participants will gain hands-on experience with real-world datasets and state-of-the-art algorithms.",
    date: "2023-06-15",
    time: "10:00 AM - 4:00 PM",
    location: "CSE Building, Room 301",
    category: "Academic",
    capacity: 50,
    registered: 42,
    waitlist: 5,
    organizer: {
      id: "org1",
      name: "Dr. Md. Rahman",
      department: "Computer Science",
    },
    speakers: [
      {
        name: "Dr. Sarah Johnson",
        designation: "AI Research Lead, Google",
        bio: "Dr. Johnson has over 10 years of experience in AI and machine learning research.",
      },
    ],
    price: "Free",
    isFeatured: true,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 42,
  },
  {
    id: "2",
    title: "Annual Cultural Festival 2023",
    description:
      "Join us for a day filled with music, dance, drama, and art exhibitions. Showcase your talent or simply enjoy the performances by fellow students and faculty members.",
    date: "2023-06-20",
    time: "12:00 PM - 8:00 PM",
    location: "DIU Auditorium",
    category: "Cultural",
    capacity: 500,
    registered: 320,
    waitlist: 0,
    organizer: {
      id: "org2",
      name: "Cultural Club",
      department: "Student Affairs",
    },
    speakers: [],
    price: "200 BDT",
    isFeatured: true,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 320,
  },
  {
    id: "3",
    title: "Entrepreneurship Summit",
    description:
      "A platform for aspiring entrepreneurs to learn from successful business leaders. The summit will feature keynote speeches, panel discussions, and networking opportunities.",
    date: "2023-06-25",
    time: "9:00 AM - 5:00 PM",
    location: "Business School Building",
    category: "Business",
    capacity: 200,
    registered: 150,
    waitlist: 10,
    organizer: {
      id: "org3",
      name: "Business & Entrepreneurship Club",
      department: "Business School",
    },
    speakers: [
      {
        name: "Mr. Karim Ahmed",
        designation: "CEO, Tech Ventures",
        bio: "Serial entrepreneur with multiple successful startups.",
      },
      {
        name: "Ms. Fatima Khan",
        designation: "Founder, EcoSolutions",
        bio: "Social entrepreneur focusing on sustainable business models.",
      },
    ],
    price: "500 BDT",
    isFeatured: false,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 150,
  },
  {
    id: "4",
    title: "Inter-University Football Tournament",
    description:
      "Annual football tournament featuring teams from major universities across Bangladesh. Come support the DIU team as they compete for the championship.",
    date: "2023-06-28",
    time: "2:00 PM - 6:00 PM",
    location: "DIU Sports Ground",
    category: "Sports",
    capacity: 1000,
    registered: 800,
    waitlist: 0,
    organizer: {
      id: "org4",
      name: "Sports Club",
      department: "Physical Education",
    },
    speakers: [],
    price: "Free for DIU students, 100 BDT for others",
    isFeatured: true,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 800,
  },
  {
    id: "5",
    title: "Career Fair 2023",
    description:
      "Connect with potential employers, explore job opportunities, and attend career development workshops. Over 50 companies will be participating to recruit DIU students and alumni.",
    date: "2023-07-05",
    time: "10:00 AM - 4:00 PM",
    location: "DIU Convention Center",
    category: "Career",
    capacity: 1500,
    registered: 1200,
    waitlist: 0,
    organizer: {
      id: "org5",
      name: "Career Development Center",
      department: "Administration",
    },
    speakers: [],
    price: "Free",
    isFeatured: false,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 1200,
  },
  {
    id: "6",
    title: "Cybersecurity Workshop",
    description:
      "Learn about the latest threats and best practices in cybersecurity. Hands-on sessions on ethical hacking, network security, and data protection.",
    date: "2023-07-10",
    time: "9:00 AM - 3:00 PM",
    location: "CSE Building, Lab 201",
    category: "Technical",
    capacity: 60,
    registered: 55,
    waitlist: 15,
    organizer: {
      id: "org6",
      name: "Dr. Amir Khan",
      department: "Computer Science",
    },
    speakers: [
      {
        name: "Mr. Rafiq Islam",
        designation: "Chief Security Officer, BankTech",
        bio: "Expert in financial cybersecurity with 15 years of experience.",
      },
    ],
    price: "300 BDT",
    isFeatured: false,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 55,
  },
  {
    id: "7",
    title: "Research Symposium",
    description:
      "Annual research symposium featuring presentations of ongoing and completed research projects by faculty and graduate students.",
    date: "2023-07-15",
    time: "10:00 AM - 5:00 PM",
    location: "Research Building, Conference Hall",
    category: "Academic",
    capacity: 100,
    registered: 80,
    waitlist: 0,
    organizer: {
      id: "org7",
      name: "Research & Development Office",
      department: "Administration",
    },
    speakers: [],
    price: "Free",
    isFeatured: false,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 80,
  },
  {
    id: "8",
    title: "Robotics Competition",
    description:
      "Showcase your robotics skills in this exciting competition. Teams will compete in various challenges, including obstacle courses, object manipulation, and autonomous navigation.",
    date: "2023-07-20",
    time: "11:00 AM - 6:00 PM",
    location: "Engineering Building, Ground Floor",
    category: "Technical",
    capacity: 200,
    registered: 150,
    waitlist: 0,
    organizer: {
      id: "org8",
      name: "Robotics Club",
      department: "Electrical Engineering",
    },
    speakers: [],
    price: "Team registration: 1000 BDT",
    isFeatured: false,
    image: "/placeholder.svg?width=600&height=400",
    attendees: 150,
  },
]

// Volunteer opportunities
export const volunteerOpportunities = [
  {
    id: "v1",
    eventId: "1",
    title: "Technical Assistant",
    description: "Assist with setting up technical equipment and helping participants during the workshop.",
    skills: ["Technical knowledge", "Communication", "Problem-solving"],
    slots: 5,
    applied: 3,
    status: "Open",
  },
  {
    id: "v2",
    eventId: "2",
    title: "Stage Management",
    description: "Coordinate performances and manage backstage activities during the cultural festival.",
    skills: ["Organization", "Time management", "Communication"],
    slots: 10,
    applied: 8,
    status: "Open",
  },
  {
    id: "v3",
    eventId: "2",
    title: "Registration Desk",
    description: "Handle attendee registration and distribute event materials.",
    skills: ["Communication", "Attention to detail"],
    slots: 8,
    applied: 8,
    status: "Closed",
  },
  {
    id: "v4",
    eventId: "4",
    title: "Referee Assistant",
    description: "Assist the main referee during football matches.",
    skills: ["Knowledge of football rules", "Quick decision-making"],
    slots: 6,
    applied: 4,
    status: "Open",
  },
  {
    id: "v5",
    eventId: "5",
    title: "Company Liaison",
    description: "Guide company representatives and help them set up their booths.",
    skills: ["Communication", "Organization", "Professionalism"],
    slots: 15,
    applied: 12,
    status: "Open",
  },
]

// User registrations
export const userRegistrations = [
  {
    id: "reg1",
    userId: "4", // student
    eventId: "1",
    registrationDate: "2023-05-20",
    status: "Confirmed",
    ticketType: "Standard",
    ticketCode: "ABC123456",
  },
  {
    id: "reg2",
    userId: "4", // student
    eventId: "2",
    registrationDate: "2023-05-22",
    status: "Confirmed",
    ticketType: "Standard",
    ticketCode: "DEF789012",
  },
  {
    id: "reg3",
    userId: "3", // faculty
    eventId: "3",
    registrationDate: "2023-05-25",
    status: "Confirmed",
    ticketType: "VIP",
    ticketCode: "GHI345678",
  },
]

// User volunteer applications
export const volunteerApplications = [
  {
    id: "app1",
    userId: "4", // student
    opportunityId: "v1",
    applicationDate: "2023-05-15",
    status: "Approved",
    message: "I have experience with technical workshops and can assist participants effectively.",
  },
  {
    id: "app2",
    userId: "4", // student
    opportunityId: "v5",
    applicationDate: "2023-05-18",
    status: "Pending",
    message: "I'm interested in gaining experience in corporate communications and networking.",
  },
]

// Event categories
export const eventCategories = [
  {
    id: "cat1",
    name: "Academic",
    count: 25,
    icon: "BookOpen",
    color: "bg-blue-500",
  },
  {
    id: "cat2",
    name: "Cultural",
    count: 18,
    icon: "Music",
    color: "bg-pink-500",
  },
  {
    id: "cat3",
    name: "Sports",
    count: 12,
    icon: "Trophy",
    color: "bg-green-500",
  },
  {
    id: "cat4",
    name: "Technical",
    count: 20,
    icon: "Code",
    color: "bg-purple-500",
  },
  {
    id: "cat5",
    name: "Business",
    count: 15,
    icon: "Briefcase",
    color: "bg-amber-500",
  },
  {
    id: "cat6",
    name: "Career",
    count: 8,
    icon: "GraduationCap",
    color: "bg-teal-500",
  },
]

// Mock analytics data
export const analyticsData = {
  eventAttendance: [
    { event: "Advanced ML Workshop", registered: 42, attended: 38 },
    { event: "Cultural Festival", registered: 320, attended: 290 },
    { event: "Entrepreneurship Summit", registered: 150, attended: 135 },
    { event: "Football Tournament", registered: 800, attended: 780 },
    { event: "Career Fair", registered: 1200, attended: 1100 },
  ],
  attendeeStats: {
    totalRegistered: 2512,
    totalAttended: 2343,
    averageAttendanceRate: 93.2,
    departmentBreakdown: [
      { department: "Computer Science", count: 620 },
      { department: "Business", count: 480 },
      { department: "Engineering", count: 350 },
      { department: "Arts & Humanities", count: 280 },
      { department: "Others", count: 613 },
    ],
    roleBreakdown: [
      { role: "Students", percentage: 78 },
      { role: "Faculty", percentage: 15 },
      { role: "Staff", percentage: 5 },
      { role: "External", percentage: 2 },
    ],
  },
  volunteerStats: {
    totalVolunteers: 120,
    totalHours: 560,
    topDepartments: [
      { department: "Computer Science", volunteers: 35 },
      { department: "Business", volunteers: 28 },
      { department: "Engineering", volunteers: 25 },
    ],
  },
  feedbackStats: {
    averageRating: 4.2,
    totalResponses: 842,
    sentimentBreakdown: [
      { sentiment: "Very Positive", percentage: 35 },
      { sentiment: "Positive", percentage: 40 },
      { sentiment: "Neutral", percentage: 15 },
      { sentiment: "Negative", percentage: 8 },
      { sentiment: "Very Negative", percentage: 2 },
    ],
    topFeedbackThemes: [
      { theme: "Organization", score: 4.5 },
      { theme: "Content Quality", score: 4.3 },
      { theme: "Venue", score: 3.8 },
      { theme: "Time Management", score: 3.9 },
      { theme: "Speaker Quality", score: 4.7 },
    ],
  },
}

