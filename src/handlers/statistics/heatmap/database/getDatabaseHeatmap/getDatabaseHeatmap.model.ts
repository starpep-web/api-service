export type DatabaseHeatmap = {
  labels: {
    x: string[]
    y: string[]
  }
  data: {
    absolute: number[][]
    relative: number[][]
  }
};
