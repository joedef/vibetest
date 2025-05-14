import { Pool } from 'pg';
import pool from '../config/database';

export interface TestCaseBug {
  id: number;
  test_case_id: number;
  bug_id: number;
}

export class TestCaseBugModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async findAll(): Promise<TestCaseBug[]> {
    try {
      const query = 'SELECT * FROM test_case_bugs';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new Error('Failed to fetch test case bugs from database');
    }
  }

  async findById(id: number): Promise<TestCaseBug | null> {
    try {
      const query = 'SELECT * FROM test_case_bugs WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw new Error('Failed to fetch test case bug from database');
    }
  }

  async create(testCaseId: number, bugId: number): Promise<TestCaseBug> {
    try {
      const query = `
        INSERT INTO test_case_bugs (test_case_id, bug_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [testCaseId, bugId];
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Failed to create test case bug in database');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const query = 'DELETE FROM test_case_bugs WHERE id = $1';
      await this.pool.query(query, [id]);
    } catch (error) {
      console.error('Error in delete:', error);
      throw new Error('Failed to delete test case bug from database');
    }
  }

  async findByTestCaseId(testCaseId: number): Promise<TestCaseBug[]> {
    try {
      const query = 'SELECT * FROM test_case_bugs WHERE test_case_id = $1';
      const result = await this.pool.query(query, [testCaseId]);
      return result.rows;
    } catch (error) {
      console.error('Error in findByTestCaseId:', error);
      throw new Error('Failed to fetch test case bugs from database');
    }
  }

  async findByBugId(bugId: number): Promise<TestCaseBug[]> {
    try {
      const query = 'SELECT * FROM test_case_bugs WHERE bug_id = $1';
      const result = await this.pool.query(query, [bugId]);
      return result.rows;
    } catch (error) {
      console.error('Error in findByBugId:', error);
      throw new Error('Failed to fetch test case bugs from database');
    }
  }
} 