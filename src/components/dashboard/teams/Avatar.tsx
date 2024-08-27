const Avatar = ({
  profileUrl,
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
  profileUrl?: string;
}) => {
  return (
    <div
      style={{
        fontSize: "12px",
        height: "38px",
        minWidth: "38px",
        width: "38px",
        color: "#1e1e2a",
        borderRadius: "50%",
        alignItems: "center",
        display: "flex",
        fontWeight: 480,
        justifyContent: "center",
        lineHeight: "24px",
        textTransform: "uppercase",
        userSelect: "none",
        backgroundColor: "#cce8ea",
      }}
    >
      <span>{firstName?.slice(0, 1)}</span>
      <span>{lastName?.slice(0, 1)}</span>
    </div>
  );
};

export default Avatar;
