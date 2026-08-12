export interface CourseUnit {
  code: string;
  title: string;
  credits: number;
}

export interface School {
  name: string;
  courseUnits: CourseUnit[];
}

export interface College {
  name: string;
  schools: School[];
}

export interface University {
  slug: string;
  name: string;
  acronym: string;
  location: string;
  description: string;
  colleges: College[];
}

export const UNIVERSITIES: University[] = [
  {
    slug: 'makerere-university',
    name: 'Makerere University',
    acronym: 'MAK',
    location: 'Kampala',
    description: 'Uganda’s oldest and largest public university, offering a broad range of academic and professional programs across humanities, sciences, business, engineering, medicine, law, and education.',
    colleges: [
      {
        name: 'College of Humanities and Social Sciences',
        schools: [
          {
            name: 'School of Psychology',
            courseUnits: [
              { code: 'PSY2101', title: 'Research Methods in Psychology', credits: 3 },
              { code: 'PSY2202', title: 'Social Psychology', credits: 3 },
            ],
          },
          {
            name: 'School of Arts',
            courseUnits: [
              { code: 'ART1101', title: 'Introduction to Creative Arts', credits: 3 },
              { code: 'HIS1201', title: 'East African History', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'College of Computing and Information Sciences',
        schools: [
          {
            name: 'School of Computing',
            courseUnits: [
              { code: 'CSC2101', title: 'Database Systems', credits: 3 },
              { code: 'CSC1101', title: 'Programming I', credits: 4 },
            ],
          },
          {
            name: 'School of Information Technology',
            courseUnits: [
              { code: 'BIT2202', title: 'Web Development', credits: 3 },
              { code: 'INF2301', title: 'Information Systems Design', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'kyambogo-university',
    name: 'Kyambogo University',
    acronym: 'KYU',
    location: 'Kampala',
    description: 'A leading public university focused on teacher education, engineering, agriculture, special needs education, and vocational training.',
    colleges: [
      {
        name: 'College of Education',
        schools: [
          {
            name: 'School of Vocational Studies',
            courseUnits: [
              { code: 'VTE1101', title: 'Technical Drawing', credits: 3 },
              { code: 'EDU1201', title: 'Foundations of Teaching', credits: 3 },
            ],
          },
          {
            name: 'School of Special Needs Education',
            courseUnits: [
              { code: 'SNE2101', title: 'Inclusive Education', credits: 3 },
              { code: 'SNE2202', title: 'Learning Difficulties', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'College of Engineering',
        schools: [
          {
            name: 'School of Industrial Engineering',
            courseUnits: [
              { code: 'ENG2301', title: 'Statics and Dynamics', credits: 4 },
              { code: 'ENG2402', title: 'Engineering Materials', credits: 3 },
            ],
          },
          {
            name: 'School of Electrical Engineering',
            courseUnits: [
              { code: 'EEL2101', title: 'Circuit Theory', credits: 4 },
              { code: 'EEL2202', title: 'Electronics I', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'mbarara-university-of-science-and-technology',
    name: 'Mbarara University of Science and Technology',
    acronym: 'MUST',
    location: 'Mbarara',
    description: 'A specialized university with strong programs in medicine, science, technology, and agriculture.',
    colleges: [
      {
        name: 'Faculty of Medicine',
        schools: [
          {
            name: 'School of Medicine',
            courseUnits: [
              { code: 'MED2101', title: 'Clinical Anatomy', credits: 5 },
              { code: 'MED2202', title: 'Pharmacology', credits: 4 },
            ],
          },
          {
            name: 'School of Biomedical Sciences',
            courseUnits: [
              { code: 'BIO2301', title: 'Microbiology', credits: 4 },
              { code: 'BIO2402', title: 'Biochemistry', credits: 4 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Science',
        schools: [
          {
            name: 'School of Computing',
            courseUnits: [
              { code: 'CSC2102', title: 'Data Structures and Algorithms', credits: 4 },
              { code: 'CSC2201', title: 'Operating Systems', credits: 4 },
            ],
          },
          {
            name: 'School of Agricultural Sciences',
            courseUnits: [
              { code: 'AGR2101', title: 'Crop Production', credits: 3 },
              { code: 'AGR2202', title: 'Soil Science', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'gulu-university',
    name: 'Gulu University',
    acronym: 'GU',
    location: 'Gulu',
    description: 'A public university serving northern Uganda with strong programs in education, science, health, and management.',
    colleges: [
      {
        name: 'School of Education',
        schools: [
          {
            name: 'Department of Curriculum Studies',
            courseUnits: [
              { code: 'EDU2102', title: 'Curriculum Development', credits: 3 },
              { code: 'EDU2203', title: 'Instructional Design', credits: 3 },
            ],
          },
          {
            name: 'Department of Educational Psychology',
            courseUnits: [
              { code: 'EPS2101', title: 'Child Development', credits: 3 },
              { code: 'EPS2202', title: 'Guidance and Counselling', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Health Sciences',
        schools: [
          {
            name: 'Department of Nursing',
            courseUnits: [
              { code: 'NUR2101', title: 'Community Health Nursing', credits: 4 },
              { code: 'NUR2202', title: 'Medical-Surgical Nursing', credits: 4 },
            ],
          },
          {
            name: 'Department of Public Health',
            courseUnits: [
              { code: 'PHC2101', title: 'Epidemiology', credits: 3 },
              { code: 'PHC2202', title: 'Health Promotion', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'busitema-university',
    name: 'Busitema University',
    acronym: 'BU',
    location: 'Busitema',
    description: 'A university with a strong focus on engineering, agriculture, and technology for regional development.',
    colleges: [
      {
        name: 'Faculty of Engineering',
        schools: [
          {
            name: 'School of Civil Engineering',
            courseUnits: [
              { code: 'CIV2101', title: 'Structural Analysis', credits: 4 },
              { code: 'CIV2202', title: 'Geotechnical Engineering', credits: 4 },
            ],
          },
          {
            name: 'School of Mechanical Engineering',
            courseUnits: [
              { code: 'MEC2101', title: 'Thermodynamics', credits: 4 },
              { code: 'MEC2202', title: 'Fluid Mechanics', credits: 4 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Agriculture',
        schools: [
          {
            name: 'School of Agribusiness',
            courseUnits: [
              { code: 'AGR2203', title: 'Agricultural Marketing', credits: 3 },
              { code: 'AGR2304', title: 'Farm Management', credits: 3 },
            ],
          },
          {
            name: 'School of Crop Science',
            courseUnits: [
              { code: 'AGR2102', title: 'Plant Pathology', credits: 3 },
              { code: 'AGR2301', title: 'Crop Physiology', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'islamic-university-in-uganda',
    name: 'Islamic University in Uganda',
    acronym: 'IUIU',
    location: 'Mbale',
    description: 'A faith-based institution with programs in law, business, computing, education, and Islamic studies.',
    colleges: [
      {
        name: 'College of Law and Shari’ah',
        schools: [
          {
            name: 'School of Law',
            courseUnits: [
              { code: 'LAW2101', title: 'Civil Procedure', credits: 4 },
              { code: 'LAW2202', title: 'Islamic Jurisprudence', credits: 4 },
            ],
          },
          {
            name: 'School of Islamic Studies',
            courseUnits: [
              { code: 'ISL2101', title: 'Quranic Studies', credits: 3 },
              { code: 'ISL2202', title: 'Islamic History', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'College of Business and Management',
        schools: [
          {
            name: 'School of Business Administration',
            courseUnits: [
              { code: 'BUS2101', title: 'Principles of Management', credits: 3 },
              { code: 'BUS2202', title: 'Financial Accounting', credits: 3 },
            ],
          },
          {
            name: 'School of Information Technology',
            courseUnits: [
              { code: 'IT2101', title: 'Systems Analysis and Design', credits: 3 },
              { code: 'IT2202', title: 'Computer Networks', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'kampala-international-university',
    name: 'Kampala International University',
    acronym: 'KIU',
    location: 'Kampala',
    description: 'A private university offering international-standard education in law, medicine, business, computing, and hospitality.',
    colleges: [
      {
        name: 'College of Health Sciences',
        schools: [
          {
            name: 'School of Medicine',
            courseUnits: [
              { code: 'MED2102', title: 'Anatomy and Physiology', credits: 5 },
              { code: 'MED2203', title: 'Pathology', credits: 4 },
            ],
          },
          {
            name: 'School of Nursing',
            courseUnits: [
              { code: 'NUR2301', title: 'Health Assessment', credits: 4 },
              { code: 'NUR2402', title: 'Pharmacology for Nurses', credits: 4 },
            ],
          },
        ],
      },
      {
        name: 'College of Computing',
        schools: [
          {
            name: 'School of Computing and Informatics',
            courseUnits: [
              { code: 'CIT2101', title: 'Database Management Systems', credits: 3 },
              { code: 'CIT2202', title: 'Software Engineering', credits: 4 },
            ],
          },
          {
            name: 'School of Hospitality Management',
            courseUnits: [
              { code: 'HOS2101', title: 'Hospitality Operations', credits: 3 },
              { code: 'HOS2202', title: 'Food and Beverage Management', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'nkumba-university',
    name: 'Nkumba University',
    acronym: 'NU',
    location: 'Entebbe',
    description: 'A reputable private university known for business, arts, education, and computing programs.',
    colleges: [
      {
        name: 'Faculty of Business and Management',
        schools: [
          {
            name: 'School of Business',
            courseUnits: [
              { code: 'BUS2102', title: 'Business Communication', credits: 3 },
              { code: 'BUS2203', title: 'Strategic Management', credits: 3 },
            ],
          },
          {
            name: 'School of Finance',
            courseUnits: [
              { code: 'FIN2101', title: 'Corporate Finance', credits: 3 },
              { code: 'FIN2202', title: 'Investment Analysis', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Information Technology',
        schools: [
          {
            name: 'School of Computer Science',
            courseUnits: [
              { code: 'CSC2103', title: 'Systems Programming', credits: 4 },
              { code: 'CSC2204', title: 'Mobile Application Development', credits: 3 },
            ],
          },
          {
            name: 'School of Multimedia',
            courseUnits: [
              { code: 'MUL2101', title: 'Digital Media Design', credits: 3 },
              { code: 'MUL2202', title: 'Web Graphics', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-christian-university',
    name: 'Uganda Christian University',
    acronym: 'UCU',
    location: 'Mukono',
    description: 'A private Christian university with strong programs in theology, business, law, education, and computing.',
    colleges: [
      {
        name: 'School of Theology and Religious Studies',
        schools: [
          {
            name: 'Department of Theology',
            courseUnits: [
              { code: 'THE2101', title: 'Biblical Studies', credits: 3 },
              { code: 'THE2202', title: 'Christian Ethics', credits: 3 },
            ],
          },
          {
            name: 'Department of Religious Education',
            courseUnits: [
              { code: 'REL2101', title: 'Faith and Society', credits: 3 },
              { code: 'REL2202', title: 'Spiritual Formation', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Management',
            courseUnits: [
              { code: 'MGT2101', title: 'Organizational Behaviour', credits: 3 },
              { code: 'MGT2202', title: 'Human Resource Management', credits: 3 },
            ],
          },
          {
            name: 'Department of Computing',
            courseUnits: [
              { code: 'CIT2102', title: 'Database Systems', credits: 3 },
              { code: 'CIT2203', title: 'Network Security', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-martyrs-university',
    name: 'Uganda Martyrs University',
    acronym: 'UMU',
    location: 'Nkozi',
    description: 'A private university with a reputation in education, humanities, business, law, and development studies.',
    colleges: [
      {
        name: 'Faculty of Education',
        schools: [
          {
            name: 'School of Education',
            courseUnits: [
              { code: 'EDU2103', title: 'Educational Planning', credits: 3 },
              { code: 'EDU2204', title: 'Teacher Development', credits: 3 },
            ],
          },
          {
            name: 'School of Humanities',
            courseUnits: [
              { code: 'HUM2101', title: 'English Language Teaching', credits: 3 },
              { code: 'HUM2202', title: 'African Literature', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Development Studies',
        schools: [
          {
            name: 'School of Social Sciences',
            courseUnits: [
              { code: 'SOC2101', title: 'Community Development', credits: 3 },
              { code: 'SOC2202', title: 'Gender and Development', credits: 3 },
            ],
          },
          {
            name: 'School of Business',
            courseUnits: [
              { code: 'BUS2103', title: 'Project Management', credits: 3 },
              { code: 'BUS2204', title: 'Entrepreneurship', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-technology-and-management-university',
    name: 'Uganda Technology and Management University',
    acronym: 'UTAMU',
    location: 'Kampala',
    description: 'A university specializing in technology, management, communication, and design programs for modern businesses.',
    colleges: [
      {
        name: 'College of Engineering and Technology',
        schools: [
          {
            name: 'School of Computing',
            courseUnits: [
              { code: 'CSC2201', title: 'Database Systems', credits: 3 },
              { code: 'CSC2302', title: 'Artificial Intelligence', credits: 3 },
            ],
          },
          {
            name: 'School of Media Technology',
            courseUnits: [
              { code: 'MED2101', title: 'Digital Broadcasting', credits: 3 },
              { code: 'MED2202', title: 'Media Production', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'College of Business and Management',
        schools: [
          {
            name: 'School of Management',
            courseUnits: [
              { code: 'MGT2102', title: 'Operations Management', credits: 3 },
              { code: 'MGT2203', title: 'Supply Chain Management', credits: 3 },
            ],
          },
          {
            name: 'School of Communication',
            courseUnits: [
              { code: 'COM2101', title: 'Corporate Communication', credits: 3 },
              { code: 'COM2202', title: 'Public Relations', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'ndejje-university',
    name: 'Ndejje University',
    acronym: 'NDU',
    location: 'Luweero',
    description: 'A private university with a mix of programs in agriculture, business, education, arts, and technology.',
    colleges: [
      {
        name: 'College of Agriculture',
        schools: [
          {
            name: 'School of Agricultural Sciences',
            courseUnits: [
              { code: 'AGR2103', title: 'Agricultural Extension', credits: 3 },
              { code: 'AGR2204', title: 'Livestock Production', credits: 3 },
            ],
          },
          {
            name: 'School of Veterinary Studies',
            courseUnits: [
              { code: 'VET2101', title: 'Animal Nutrition', credits: 3 },
              { code: 'VET2202', title: 'Veterinary Pathology', credits: 4 },
            ],
          },
        ],
      },
      {
        name: 'College of Business',
        schools: [
          {
            name: 'School of Commerce',
            courseUnits: [
              { code: 'COM2102', title: 'Managerial Economics', credits: 3 },
              { code: 'COM2203', title: 'Business Law', credits: 3 },
            ],
          },
          {
            name: 'School of Information Technology',
            courseUnits: [
              { code: 'IT2102', title: 'Database Administration', credits: 3 },
              { code: 'IT2203', title: 'Information Security', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'cavendish-university-uganda',
    name: 'Cavendish University Uganda',
    acronym: 'CUU',
    location: 'Kampala',
    description: 'A private university known for law, business, computing, and communication programs with an international focus.',
    colleges: [
      {
        name: 'School of Law',
        schools: [
          {
            name: 'Department of International Law',
            courseUnits: [
              { code: 'LAW2102', title: 'International Trade Law', credits: 4 },
              { code: 'LAW2203', title: 'Corporate Law', credits: 4 },
            ],
          },
          {
            name: 'Department of Human Rights',
            courseUnits: [
              { code: 'HRL2101', title: 'Human Rights Law', credits: 4 },
              { code: 'HRL2202', title: 'Advocacy and Policy', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2101', title: 'Principles of Marketing', credits: 3 },
              { code: 'MKT2202', title: 'Digital Marketing', credits: 3 },
            ],
          },
          {
            name: 'Department of Computing',
            courseUnits: [
              { code: 'ICT2101', title: 'Web Systems', credits: 3 },
              { code: 'ICT2202', title: 'Database Design', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'victoria-university',
    name: 'Victoria University',
    acronym: 'VU',
    location: 'Kampala',
    description: 'A private institution delivering programs in business, technology, law, and international relations.',
    colleges: [
      {
        name: 'College of Business and Management',
        schools: [
          {
            name: 'Department of Human Resource Management',
            courseUnits: [
              { code: 'HRM2101', title: 'Human Resource Principles', credits: 3 },
              { code: 'HRM2202', title: 'Industrial Relations', credits: 3 },
            ],
          },
          {
            name: 'Department of Accounting',
            courseUnits: [
              { code: 'ACC2101', title: 'Financial Accounting I', credits: 3 },
              { code: 'ACC2202', title: 'Management Accounting', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'College of Computer Science',
        schools: [
          {
            name: 'Department of Software Engineering',
            courseUnits: [
              { code: 'SWE2101', title: 'Object Oriented Programming', credits: 4 },
              { code: 'SWE2202', title: 'Software Testing', credits: 3 },
            ],
          },
          {
            name: 'Department of Cyber Security',
            courseUnits: [
              { code: 'CYB2101', title: 'Introduction to Cybersecurity', credits: 3 },
              { code: 'CYB2202', title: 'Network Security', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'st-lawrence-university',
    name: 'St. Lawrence University',
    acronym: 'SLU',
    location: 'Kampala',
    description: 'A private university with programs in education, business, computing, and social sciences.',
    colleges: [
      {
        name: 'School of Education',
        schools: [
          {
            name: 'Department of Secondary Education',
            courseUnits: [
              { code: 'SED2101', title: 'Curriculum Studies', credits: 3 },
              { code: 'SED2202', title: 'Assessment and Evaluation', credits: 3 },
            ],
          },
          {
            name: 'Department of Early Childhood Education',
            courseUnits: [
              { code: 'ECE2101', title: 'Early Childhood Curriculum', credits: 3 },
              { code: 'ECE2202', title: 'Child Development', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Accounting and Finance',
            courseUnits: [
              { code: 'ACC2102', title: 'Financial Reporting', credits: 3 },
              { code: 'FIN2203', title: 'Banking and Finance', credits: 3 },
            ],
          },
          {
            name: 'Department of Information Systems',
            courseUnits: [
              { code: 'IS2101', title: 'Database Systems', credits: 3 },
              { code: 'IS2202', title: 'Enterprise Systems', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-pentecostal-university',
    name: 'Uganda Pentecostal University',
    acronym: 'UPU',
    location: 'Fort Portal',
    description: 'A faith-based university offering programs in education, business, development studies, and theology.',
    colleges: [
      {
        name: 'School of Theology and Leadership',
        schools: [
          {
            name: 'Department of Theology',
            courseUnits: [
              { code: 'THE2102', title: 'Christian Leadership', credits: 3 },
              { code: 'THE2203', title: 'Pentecostal Theology', credits: 3 },
            ],
          },
          {
            name: 'Department of Development Studies',
            courseUnits: [
              { code: 'DEV2101', title: 'Community Mobilisation', credits: 3 },
              { code: 'DEV2202', title: 'Project Planning', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2102', title: 'Consumer Behaviour', credits: 3 },
              { code: 'MKT2203', title: 'Brand Management', credits: 3 },
            ],
          },
          {
            name: 'Department of Human Resource Management',
            courseUnits: [
              { code: 'HRM2102', title: 'Talent Management', credits: 3 },
              { code: 'HRM2203', title: 'Organizational Behaviour', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'livingstone-international-university',
    name: 'LivingStone International University',
    acronym: 'LIU',
    location: 'Mbale',
    description: 'A private Christian university with programs in theology, business, education, and social sciences.',
    colleges: [
      {
        name: 'School of Theology',
        schools: [
          {
            name: 'Department of Biblical Studies',
            courseUnits: [
              { code: 'BIB2101', title: 'Old Testament Studies', credits: 3 },
              { code: 'BIB2202', title: 'New Testament Studies', credits: 3 },
            ],
          },
          {
            name: 'Department of Christian Ministry',
            courseUnits: [
              { code: 'MIN2101', title: 'Pastoral Care', credits: 3 },
              { code: 'MIN2202', title: 'Church Administration', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Accounting',
            courseUnits: [
              { code: 'ACC2103', title: 'Managerial Accounting', credits: 3 },
              { code: 'ACC2204', title: 'Taxation', credits: 3 },
            ],
          },
          {
            name: 'Department of Information Technology',
            courseUnits: [
              { code: 'IT2103', title: 'Computer Hardware', credits: 3 },
              { code: 'IT2204', title: 'Network Administration', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-metropolitan-university',
    name: 'Uganda Metropolitan University',
    acronym: 'UMU',
    location: 'Kampala',
    description: 'A private university providing courses in business, law, education, and computing with flexible study options.',
    colleges: [
      {
        name: 'School of Business and Management',
        schools: [
          {
            name: 'Department of Business Administration',
            courseUnits: [
              { code: 'BUS2104', title: 'Business Strategy', credits: 3 },
              { code: 'BUS2205', title: 'Entrepreneurial Finance', credits: 3 },
            ],
          },
          {
            name: 'Department of Procurement and Logistics',
            courseUnits: [
              { code: 'PML2101', title: 'Supply Chain Management', credits: 3 },
              { code: 'PML2202', title: 'Procurement Practice', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Information Technology',
        schools: [
          {
            name: 'Department of Software Development',
            courseUnits: [
              { code: 'SD2101', title: 'Programming Fundamentals', credits: 4 },
              { code: 'SD2202', title: 'Web Programming', credits: 4 },
            ],
          },
          {
            name: 'Department of Digital Media',
            courseUnits: [
              { code: 'DM2101', title: 'Graphic Design', credits: 3 },
              { code: 'DM2202', title: 'Digital Storytelling', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'bishop-stuart-university',
    name: 'Bishop Stuart University',
    acronym: 'BSU',
    location: 'Mbarara',
    description: 'A private chartered university with strong programs in education, business, science, and social sciences.',
    colleges: [
      {
        name: 'Faculty of Education',
        schools: [
          {
            name: 'Department of Curriculum and Instruction',
            courseUnits: [
              { code: 'CUR2101', title: 'Teaching Methodologies', credits: 3 },
              { code: 'CUR2202', title: 'Educational Assessment', credits: 3 },
            ],
          },
          {
            name: 'Department of Guidance and Counselling',
            courseUnits: [
              { code: 'GDC2101', title: 'Counselling Theories', credits: 3 },
              { code: 'GDC2202', title: 'Career Guidance', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Business Management',
        schools: [
          {
            name: 'Department of Finance',
            courseUnits: [
              { code: 'FIN2102', title: 'Financial Management', credits: 3 },
              { code: 'FIN2204', title: 'Investment Planning', credits: 3 },
            ],
          },
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2103', title: 'Marketing Research', credits: 3 },
              { code: 'MKT2204', title: 'Sales Management', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'kabale-university',
    name: 'Kabale University',
    acronym: 'KAB',
    location: 'Kabale',
    description: 'A public university serving southwestern Uganda with programs in agriculture, education, computing, and law.',
    colleges: [
      {
        name: 'School of Agriculture',
        schools: [
          {
            name: 'Department of Crop Science',
            courseUnits: [
              { code: 'CRO2101', title: 'Crop Production', credits: 3 },
              { code: 'CRO2202', title: 'Plant Protection', credits: 3 },
            ],
          },
          {
            name: 'Department of Animal Science',
            courseUnits: [
              { code: 'ANI2101', title: 'Animal Husbandry', credits: 3 },
              { code: 'ANI2202', title: 'Veterinary Extension', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Computing and Informatics',
        schools: [
          {
            name: 'Department of Information Systems',
            courseUnits: [
              { code: 'IS2102', title: 'Database Systems', credits: 3 },
              { code: 'IS2203', title: 'Systems Analysis', credits: 3 },
            ],
          },
          {
            name: 'Department of Software Engineering',
            courseUnits: [
              { code: 'SWE2102', title: 'Software Development', credits: 4 },
              { code: 'SWE2203', title: 'Human Computer Interaction', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'muteesa-i-royal-university',
    name: 'Muteesa I Royal University',
    acronym: 'MIRU',
    location: 'Masaka',
    description: 'A private university inspired by heritage and modern education with programs in business, education, law, and arts.',
    colleges: [
      {
        name: 'School of Business and Economics',
        schools: [
          {
            name: 'Department of Economics',
            courseUnits: [
              { code: 'ECO2101', title: 'Microeconomics', credits: 3 },
              { code: 'ECO2202', title: 'Macroeconomics', credits: 3 },
            ],
          },
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2104', title: 'Consumer Behaviour', credits: 3 },
              { code: 'MKT2205', title: 'Market Research', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Humanities and Education',
        schools: [
          {
            name: 'Department of Education',
            courseUnits: [
              { code: 'EDU2104', title: 'Educational Psychology', credits: 3 },
              { code: 'EDU2205', title: 'Educational Technology', credits: 3 },
            ],
          },
          {
            name: 'Department of Performing Arts',
            courseUnits: [
              { code: 'ART2101', title: 'Drama and Performance', credits: 3 },
              { code: 'ART2202', title: 'Music Theory', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'kumi-university',
    name: 'Kumi University',
    acronym: 'KYU',
    location: 'Kumi',
    description: 'A private university serving eastern Uganda with programs in business, education, computing, and social sciences.',
    colleges: [
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Accounting',
            courseUnits: [
              { code: 'ACC2104', title: 'Accounting Principles', credits: 3 },
              { code: 'ACC2205', title: 'Auditing', credits: 3 },
            ],
          },
          {
            name: 'Department of Management',
            courseUnits: [
              { code: 'MGT2103', title: 'Principles of Management', credits: 3 },
              { code: 'MGT2204', title: 'Project Planning', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Information Technology',
        schools: [
          {
            name: 'Department of Computer Science',
            courseUnits: [
              { code: 'CSC2104', title: 'Programming Concepts', credits: 4 },
              { code: 'CSC2205', title: 'Network Fundamentals', credits: 3 },
            ],
          },
          {
            name: 'Department of Software Engineering',
            courseUnits: [
              { code: 'SWE2103', title: 'Database Systems', credits: 3 },
              { code: 'SWE2204', title: 'Web Development', credits: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'kampala-university',
    name: 'Kampala University',
    acronym: 'KU',
    location: 'Kampala',
    description: 'A private university offering programs in education, business, engineering, and social sciences.',
    colleges: [
      {
        name: 'School of Engineering',
        schools: [
          {
            name: 'Department of Civil Engineering',
            courseUnits: [
              { code: 'CIV2102', title: 'Construction Materials', credits: 4 },
              { code: 'CIV2203', title: 'Structural Design', credits: 4 },
            ],
          },
          {
            name: 'Department of Electrical Engineering',
            courseUnits: [
              { code: 'EEL2102', title: 'Power Systems', credits: 4 },
              { code: 'EEL2203', title: 'Control Systems', credits: 4 },
            ],
          },
        ],
      },
      {
        name: 'School of Business Administration',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2105', title: 'Marketing Strategy', credits: 3 },
              { code: 'MKT2206', title: 'Retail Management', credits: 3 },
            ],
          },
          {
            name: 'Department of Finance',
            courseUnits: [
              { code: 'FIN2103', title: 'Risk and Insurance', credits: 3 },
              { code: 'FIN2205', title: 'Financial Markets', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'all-saints-university-lango',
    name: 'All Saints University Lango',
    acronym: 'ASUL',
    location: 'Lira',
    description: 'A private university in northern Uganda providing programs in education, business, and communication.',
    colleges: [
      {
        name: 'School of Education',
        schools: [
          {
            name: 'Department of Primary Education',
            courseUnits: [
              { code: 'PED2101', title: 'Primary Curriculum', credits: 3 },
              { code: 'PED2202', title: 'Literacy Instruction', credits: 3 },
            ],
          },
          {
            name: 'Department of Educational Leadership',
            courseUnits: [
              { code: 'EDL2101', title: 'School Administration', credits: 3 },
              { code: 'EDL2202', title: 'Leadership in Schools', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Business Studies',
            courseUnits: [
              { code: 'BUS2105', title: 'Business Ethics', credits: 3 },
              { code: 'BUS2206', title: 'Small Business Management', credits: 3 },
            ],
          },
          {
            name: 'Department of Information Technology',
            courseUnits: [
              { code: 'IT2104', title: 'Information Systems', credits: 3 },
              { code: 'IT2205', title: 'Database Applications', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-womens-university',
    name: 'Uganda Women’s University',
    acronym: 'UWU',
    location: 'Mbarara',
    description: 'A public university dedicated to women’s empowerment through education and training in education, business, and science.',
    colleges: [
      {
        name: 'Faculty of Education',
        schools: [
          {
            name: 'Department of Gender Studies',
            courseUnits: [
              { code: 'GEN2101', title: 'Gender and Development', credits: 3 },
              { code: 'GEN2202', title: 'Women in Leadership', credits: 3 },
            ],
          },
          {
            name: 'Department of Early Childhood Education',
            courseUnits: [
              { code: 'ECE2102', title: 'Child Care and Development', credits: 3 },
              { code: 'ECE2203', title: 'Play-Based Learning', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'Faculty of Business Administration',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2106', title: 'Women in Business', credits: 3 },
              { code: 'MKT2207', title: 'Consumer Behaviour', credits: 3 },
            ],
          },
          {
            name: 'Department of Information Technology',
            courseUnits: [
              { code: 'IT2105', title: 'Computer Applications', credits: 3 },
              { code: 'IT2206', title: 'Network Essentials', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'africa-renewal-university',
    name: 'Africa Renewal University',
    acronym: 'ARU',
    location: 'Kampala',
    description: 'A private university offering business, communication, education, and theology programs with a focus on leadership and transformation.',
    colleges: [
      {
        name: 'School of Leadership and Development',
        schools: [
          {
            name: 'Department of Development Studies',
            courseUnits: [
              { code: 'DEV2102', title: 'Community Development Planning', credits: 3 },
              { code: 'DEV2203', title: 'Sustainable Development', credits: 3 },
            ],
          },
          {
            name: 'Department of Leadership Studies',
            courseUnits: [
              { code: 'LDR2101', title: 'Leadership Theory', credits: 3 },
              { code: 'LDR2202', title: 'Ethical Leadership', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2107', title: 'Marketing Management', credits: 3 },
              { code: 'MKT2208', title: 'Brand Strategy', credits: 3 },
            ],
          },
          {
            name: 'Department of Accounting',
            courseUnits: [
              { code: 'ACC2105', title: 'Financial Accounting II', credits: 3 },
              { code: 'ACC2206', title: 'Auditing Principles', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'uganda-management-institute',
    name: 'Uganda Management Institute',
    acronym: 'UMI',
    location: 'Kampala',
    description: 'A professional management institute offering postgraduate and executive programs in public administration, business, and leadership.',
    colleges: [
      {
        name: 'School of Public Policy',
        schools: [
          {
            name: 'Department of Public Administration',
            courseUnits: [
              { code: 'PUB2101', title: 'Governance and Ethics', credits: 3 },
              { code: 'PUB2202', title: 'Public Policy Analysis', credits: 3 },
            ],
          },
          {
            name: 'Department of Leadership',
            courseUnits: [
              { code: 'LDR2102', title: 'Strategic Leadership', credits: 3 },
              { code: 'LDR2203', title: 'Organizational Change', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Business and Entrepreneurship',
        schools: [
          {
            name: 'Department of Entrepreneurship',
            courseUnits: [
              { code: 'ENT2101', title: 'Small Business Management', credits: 3 },
              { code: 'ENT2202', title: 'Innovation and Growth', credits: 3 },
            ],
          },
          {
            name: 'Department of Finance',
            courseUnits: [
              { code: 'FIN2104', title: 'Public Finance', credits: 3 },
              { code: 'FIN2206', title: 'Project Finance', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'makerere-university-business-school',
    name: 'Makerere University Business School',
    acronym: 'MUBS',
    location: 'Kampala',
    description: 'A business school of Makerere University delivering undergraduate and postgraduate programs in management, finance, entrepreneurship, and human resource development.',
    colleges: [
      {
        name: 'School of Business',
        schools: [
          {
            name: 'Department of Marketing',
            courseUnits: [
              { code: 'MKT2108', title: 'Marketing Communications', credits: 3 },
              { code: 'MKT2209', title: 'Consumer Research', credits: 3 },
            ],
          },
          {
            name: 'Department of Finance',
            courseUnits: [
              { code: 'FIN2105', title: 'Investment Analysis', credits: 3 },
              { code: 'FIN2207', title: 'Corporate Finance', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Human Resource Management',
        schools: [
          {
            name: 'Department of Human Resource',
            courseUnits: [
              { code: 'HRM2103', title: 'Recruitment and Selection', credits: 3 },
              { code: 'HRM2204', title: 'Performance Management', credits: 3 },
            ],
          },
          {
            name: 'Department of Entrepreneurship',
            courseUnits: [
              { code: 'ENT2102', title: 'Family Business Management', credits: 3 },
              { code: 'ENT2203', title: 'Small Business Finance', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'bufeka-university',
    name: 'Bugema University',
    acronym: 'BU',
    location: 'Lutembe',
    description: 'A private Christian university with programs in theology, education, business, and agriculture.',
    colleges: [
      {
        name: 'Faculty of Agriculture',
        schools: [
          {
            name: 'Department of Crop Science',
            courseUnits: [
              { code: 'AGR2104', title: 'Crop Protection', credits: 3 },
              { code: 'AGR2205', title: 'Irrigation Systems', credits: 3 },
            ],
          },
          {
            name: 'Department of Animal Science',
            courseUnits: [
              { code: 'ANI2102', title: 'Animal Production', credits: 3 },
              { code: 'ANI2203', title: 'Livestock Management', credits: 3 },
            ],
          },
        ],
      },
      {
        name: 'School of Education',
        schools: [
          {
            name: 'Department of Primary Education',
            courseUnits: [
              { code: 'PED2102', title: 'Primary Teaching Methods', credits: 3 },
              { code: 'PED2203', title: 'Learner Assessment', credits: 3 },
            ],
          },
          {
            name: 'Department of Counselling',
            courseUnits: [
              { code: 'CNL2101', title: 'Counselling Skills', credits: 3 },
              { code: 'CNL2202', title: 'Guidance and Counselling', credits: 3 },
            ],
          },
        ],
      },
    ],
  },
];
