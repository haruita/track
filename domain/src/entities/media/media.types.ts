import { BaseMedia } from "./base.media";
import { Progress } from "../progress/progress";
import { Status } from "../status/status";

export type Anime = BaseMedia & {
  type: "anime";
  activity: "watch";
  status: Status<"watch">;
  progress: Progress<"watch">;
};

export type LiveAction = BaseMedia & {
  type: "liveaction";
  activity: "watch";
  status: Status<"watch">;
  progress: Progress<"watch">;
};

export type Movie = BaseMedia & {
  type: "movie";
  activity: "watch";
  status: Status<"watch">;
  progress: Progress<"watch">;
};

export type Show = BaseMedia & {
  type: "show";
  activity: "watch";
  status: Status<"watch">;
  progress: Progress<"watch">;
};

export type Book = BaseMedia & {
  type: "book";
  activity: "read";
  status: Status<"read">;
  progress: Progress<"read">;
};

export type Manga = BaseMedia & {
  type: "manga";
  activity: "read";
  status: Status<"read">;
  progress: Progress<"read">;
};

export type Comic = BaseMedia & {
  type: "comic";
  activity: "read";
  status: Status<"read">;
  progress: Progress<"read">;
};

export type VisualNovel = BaseMedia & {
  type: "vn";
  activity: "read";
  status: Status<"read">;
  progress: Progress<"read">;
};

export type LightNovel = BaseMedia & {
  type: "ln";
  activity: "read";
  status: Status<"read">;
  progress: Progress<"read">;
};

export type Game = BaseMedia & {
  type: "game";
  activity: "play";
  status: Status<"play">;
  progress: Progress<"play">;
};

export type Album = BaseMedia & {
  type: "album";
  activity: "listen";
  status: Status<"listen">;
  progress: Progress<"listen">;
};

export type Podcast = BaseMedia & {
  type: "podcast";
  activity: "listen";
  status: Status<"listen">;
  progress: Progress<"listen">;
};