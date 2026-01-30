const colors = {
  open: "bg-gray-200 text-gray-800",
  "in-progress": "bg-yellow-200 text-yellow-800",
  resolved: "bg-green-200 text-green-800",
  low: "bg-blue-100 text-blue-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const StatusBadge = ({ label }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${colors[label]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
