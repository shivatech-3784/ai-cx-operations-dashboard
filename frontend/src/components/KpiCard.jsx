const KpiCard = ({ title, value, danger, warning, onClick }) => {
  let color = "text-gray-800";
  if (danger) color = "text-red-600";
  if (warning) color = "text-amber-600";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer p-6"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
};

export default KpiCard;
