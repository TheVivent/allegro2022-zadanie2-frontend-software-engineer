export default function LoadingSpinner() {
  return (
    <div
      className="position-absolute w-100 h-100 rounded-3"
      style={{
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="position-relative" style={{ top: "50%", left: "50%" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    </div>
  );
}
