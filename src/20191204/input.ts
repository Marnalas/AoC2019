const jsonRange: string = '{"range":{"min": 264793,"max":803935}}';

export type Range = {
  min: number;
  max: number;
};

export default (): Range => {
  return JSON.parse(jsonRange).range;
};
