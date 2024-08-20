/* eslint-disable no-use-before-define */
import neo4j, { Driver, Session } from 'neo4j-driver';
import { NEO4J_DB_URI } from '../../../config/app';

export class GraphDatabaseService {
  private static instance: GraphDatabaseService | null = null;

  private readonly driver: Driver;

  private constructor() {
    this.driver = neo4j.driver(NEO4J_DB_URI);
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public getSession(): Session {
    return this.driver.session({
      defaultAccessMode: neo4j.session.READ
    });
  }

  public async useSession<T>(fn: (session: Session) => Promise<T>): Promise<T> {
    const session = this.getSession();

    try {
      return await fn(session);
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  }

  public async query(query: string, params?: Record<string, unknown>) {
    return this.useSession((session) => {
      return session.readTransaction((tx) => {
        return tx.run(query, params);
      });
    });
  }

  public static getInstance(): GraphDatabaseService {
    if (!GraphDatabaseService.instance) {
      GraphDatabaseService.instance = new GraphDatabaseService();
    }

    return GraphDatabaseService.instance;
  }
}
