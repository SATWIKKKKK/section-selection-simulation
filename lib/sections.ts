export interface Section {
  code: string;
  seats: number;
  facultyName: string;
}

export interface ElectiveOption extends Section {
  abbreviation: string;
  groupCount: number;
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

export const ELECTIVE_1_OPTIONS: ElectiveOption[] = [
  {
    code: 'High Performance Computing',
    seats: 78,
    facultyName: 'Elective 1',
    abbreviation: 'HPC',
    groupCount: 23,
  },
  {
    code: 'Distributed Operating Systems',
    seats: 78,
    facultyName: 'Elective 1',
    abbreviation: 'DOS',
    groupCount: 22,
  },
];

export const ELECTIVE_2_OPTIONS: ElectiveOption[] = [
  {
    code: 'Compiler Design',
    seats: 78,
    facultyName: 'Elective 2',
    abbreviation: 'CD',
    groupCount: 14,
  },
  {
    code: 'Data Mining & Data Warehousing',
    seats: 78,
    facultyName: 'Elective 2',
    abbreviation: 'DMDW',
    groupCount: 20,
  },
  {
    code: 'Privacy and Security in IoT',
    seats: 78,
    facultyName: 'Elective 2',
    abbreviation: 'PSIOT',
    groupCount: 1,
  },
  {
    code: 'Computational Intelligence',
    seats: 78,
    facultyName: 'Elective 2',
    abbreviation: 'CI',
    groupCount: 10,
  },
];

export function getSelectionOptions(kind: SelectionKind): Section[] {
  if (kind === 'elective1') return ELECTIVE_1_OPTIONS;
  if (kind === 'elective2') return ELECTIVE_2_OPTIONS;
  return SECTIONS;
}

export function getElectiveNumberedSections(electiveName: string): string[] {
  const elective = [...ELECTIVE_1_OPTIONS, ...ELECTIVE_2_OPTIONS].find(
    (option) => option.code === electiveName
  );

  if (!elective) return [];

  return Array.from(
    { length: elective.groupCount },
    (_, index) => `${elective.abbreviation}-${index + 1}`
  );
}
