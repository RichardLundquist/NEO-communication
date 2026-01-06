const DataField = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <div className="mb-3">
    <div className="label-text">
      {label}
    </div>
    <div className="value-text">
      {value}
      {unit && (
        <span className="label-text ml-1">{unit}</span>
      )}
    </div>
  </div>
);

export default DataField;