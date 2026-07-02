export interface Section {
  code: string;
  seats: number;
  facultyName: string;
}

export type SelectionKind = 'section' | 'elective1' | 'elective2';

const facultyNames = [
  'Prof. R. K. Mishra', 'Prof. A. Das', 'Prof. S. Panda', 'Prof. K. Nair',
  'Prof. D. Roy', 'Prof. P. Mohanty', 'Prof. B. Sahoo', 'Prof. S. Rath',
  'Prof. M. Patnaik', 'Prof. A. Swain', 'Prof. R. Behera', 'Prof. N. Dash',
  'Prof. S. Biswal', 'Prof. T. Pradhan', 'Prof. A. Sahu', 'Prof. K. Mohapatra',
  'Prof. S. Tripathy', 'Prof. R. Senapati', 'Prof. D. Parida', 'Prof. B. Nayak',
  'Prof. A. Patro', 'Prof. S. Choudhury', 'Prof. K. Rout', 'Prof. M. Barik',
  'Prof. P. Satpathy', 'Prof. B. Prusty', 'Prof. A. Lenka',
];

export const SECTIONS: Section[] = Array.from({ length: 61 }, (_, i) => ({
  code: `CSE-${String(i + 1).padStart(2, '0')}`,
  seats: 78,
  facultyName: facultyNames[i % facultyNames.length],
}));

export const ELECTIVE_1_OPTIONS: Section[] = [
  {
    code: 'High Performance Computing',
    seats: 78,
    facultyName: 'Elective 1',
  },
  {
    code: 'Distributed Operating Systems',
    seats: 78,
    facultyName: 'Elective 1',
  },
];

export const ELECTIVE_2_OPTIONS: Section[] = [
  { code: 'Compiler', seats: 78, facultyName: 'Elective 2' },
  { code: 'Data Mining & Data Warehousing', seats: 78, facultyName: 'Elective 2' },
  { code: 'Privacy and Security in IoT', seats: 78, facultyName: 'Elective 2' },
  { code: 'Computational Intelligence', seats: 78, facultyName: 'Elective 2' },
];

export function getSelectionOptions(kind: SelectionKind): Section[] {
  if (kind === 'elective1') return ELECTIVE_1_OPTIONS;
  if (kind === 'elective2') return ELECTIVE_2_OPTIONS;
  return SECTIONS;
}
