import { Pool } from "pg";
import pool from "../config/database";

export interface Link {
  test_case_id: number;
  bug_id: number;
}

export class LinkModel {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async findAll(): Promise<Link[]> {
    try {
      const query = "SELECT * FROM test_case_bugs";
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new Error("Failed to fetch links from database");
    }
  }

  async findById(id: number): Promise<Link | null> {
    try {
      const query = "SELECT * FROM test_case_bugs WHERE id = $1";
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in findById:", error);
      throw new Error("Failed to fetch link from database");
    }
  }

  async create(
    link: Omit<Link, "id" | "created_at" | "updated_at">
  ): Promise<Link> {
    try {
      const query = `
        INSERT INTO test_case_bugs (test_case_id, bug_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [link.test_case_id, link.bug_id];
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in create:", error);
      throw new Error("Failed to create link in database");
    }
  }

  async update(id: number, link: Partial<Link>): Promise<Link | null> {
    try {
      const query = `
        UPDATE test_case_bugs
        SET 

            test_case_id = COALESCE($1, test_case_id)
            bug_id = COALESCE($2, bug_id),

        WHERE id = $1
        RETURNING *
      `;
      const values = [link.test_case_id, link.bug_id];
      const result = await this.pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in update:", error);
      throw new Error("Failed to update link in database");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const query = "DELETE FROM test_case_bugs WHERE id = $1";
      await this.pool.query(query, [id]);
    } catch (error) {
      console.error("Error in delete:", error);
      throw new Error("Failed to delete link from database");
    }
  }
}
