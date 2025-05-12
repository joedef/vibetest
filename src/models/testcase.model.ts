export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
}

export const testCases: TestCase[] = [];