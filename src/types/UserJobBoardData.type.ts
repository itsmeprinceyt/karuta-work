export interface UserJobBoardData {
  healthyCards: { position: string; name: string; effort: number }[];
  injuredSlots: string[];
  emptySlots: string[];
  boardCardKeys: Set<string>;
  boardNames: Set<string>;
  boardEfforts: Set<number>;
  timestamp: number;
}
