import { Link } from "react-router-dom";
import type { Media } from "../types/media";

type Props = {
  media: Media;
};

export function MediaCard({ media }: Props) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5>{media.title}</h5>

          <p>
            {media.status}
          </p>

          <p>
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
    </div>
  );
}