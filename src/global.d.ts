declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string

      NEO4J_DB_URI?: string
    }
  }
}
