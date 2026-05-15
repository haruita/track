import { Link } from "react-router-dom";
import type { Media } from "../types/media";
import { formatType } from "../utils/formatType";
import { resolveImageUrl } from "../utils/resolveImageUrl";

type Props = {
  media: Media;
  isLogged?: boolean;
  isInMyList?: boolean;
  onAddToList?: () => void;
};

export function MediaCard({ media, isLogged, isInMyList, onAddToList }: Props) {
  return (
    <div className="card h-100 shadow-sm">
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          backgroundColor: "#1a1a2e",
        }}
      >
        {media.imageUrl ? (
          <img
            src={resolveImageUrl(media.imageUrl)}
            alt={media.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "2rem",
            }}
          >
            🎬
          </div>
        )}
      </div>
      <div className="card-body">
        <h5 className="card-title">{media.title}</h5>

        <p className="card-text">
          <strong>Type:</strong> {formatType(media.type)}
        </p>

        {media.description && (
          <p className="card-text text-muted" style={{ fontSize: "0.875rem" }}>
            {media.description.length > 100
              ? media.description.slice(0, 100) + "..."
              : media.description}
          </p>
        )}

        <div className="d-flex gap-2 flex-wrap">
          <Link to={`/media/${media.id}`} className="btn btn-primary">
            Details
          </Link>

          {isLogged && isInMyList && (
            <span className="badge bg-success align-self-center">✓ In my list</span>
          )}

          {isLogged && !isInMyList && onAddToList && (
            <button className="btn btn-outline-success" onClick={onAddToList}>
              Add to list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
