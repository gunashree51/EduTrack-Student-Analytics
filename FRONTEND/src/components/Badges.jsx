export const StatusBadge = ({ status }) =>
  status==="ACTIVE"
    ? <span className="badge b-green">Active</span>
    : <span className="badge b-gray">Inactive</span>;

export const AttBadge = ({ status }) => {
  if (status==="PRESENT") return <span className="badge b-green">Present</span>;
  if (status==="ABSENT")  return <span className="badge b-red">Absent</span>;
  return <span className="badge b-amber">Late</span>;
};

export const ExamBadge = ({ type }) => <span className="badge b-violet">{type}</span>;
