import { Link } from "react-router-dom";
import type { Media } from "../types/media";

type Props = {
  media: Media;
};

export function MediaCard({
  media,
}: Props) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {media.title}
        </h5>

        <p className="card-text">
          <strong>Type:</strong>
          {" "}
          {media.type}
        </p>

        <p className="card-text">
          <strong>Status:</strong>
          {" "}
          {media.status}
        </p>

        <p className="card-text">
          <strong>Progress:</strong>
          {" "}
          {media.progressCurrent}
          /
          {media.progressTotal}
          {" "}
          {media.progressUnit}
        </p>

        <Link
          to={`/media/${media.id}`}
          className="btn btn-primary"
        >
          Details
        </Link>
      </div>
    </div>
  );
}