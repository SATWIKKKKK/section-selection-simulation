export interface Section {
  code: string;
  seats: number;
  facultyName: string;
}

const facultyNames = [
  'Prof. R. K. Mishra', 'Prof. A. Das', 'Prof. S. Panda', 'Prof. K. Nair',
  'Prof. D. Roy', 'Prof. P. Mohanty', 'Prof. B. Sahoo', 'Prof. S. Rath',
  'Prof. M. Patnaik', 'Prof. A. Swain', 'Prof. R. Behera', 'Prof. N. Dash',
  'Prof. S. Biswal', 'Prof. T. Pradhan', 'Prof. A. Sahu', 'Prof. K. Mohapatra',
  'Prof. S. Tripathy', 'Prof. R. Senapati', 'Prof. D. Parida', 'Prof. B. Nayak',
  'Prof. A. Patro', 'Prof. S. Choudhury', 'Prof. K. Rout', 'Prof. M. Barik',
  'Prof. P. Satpathy', 'Prof. B. Prusty', 'Prof. A. Lenka',
];

export const SECTIONS: Section[] = Array.from({ length: 54 }, (_, i) => ({
  code: `CSE-${String(i + 1).padStart(2, '0')}`,
  seats: 78,
  facultyName: facultyNames[i % facultyNames.length],
}));
