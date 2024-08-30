import { DatabaseHeatmap } from './getDatabaseHeatmap.model';

export const getDatabaseHeatmap = async (): Promise<DatabaseHeatmap> => {
  return (await import('../../../../static/dbHeatmap.json')).default;
};
