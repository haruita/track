type StatusMap = {
  watch: "planned" | "watching" | "completed";
  read: "planned" | "reading" | "completed";
  play: "planned" | "playing" | "completed";
  listen: "planned" | "listening" | "completed";
};

export type Status<TActivity extends keyof StatusMap> = StatusMap[TActivity];