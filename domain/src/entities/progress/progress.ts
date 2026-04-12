export type ProgressUnitMap = {
  watch: "episode";
  read: "page" | "chapter";
  play: "hour";
  listen: "track" | "episode";
};

export type Progress<TActivity extends keyof ProgressUnitMap> = {
  current: number;
  total?: number;
  unit: ProgressUnitMap[TActivity];
};