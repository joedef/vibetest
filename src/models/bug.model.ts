export interface Bug {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
}

export const bugs: Bug[] = [];