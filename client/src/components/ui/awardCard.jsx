const AwardCard = ({ award, manageMode, selected, onSelect }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden border ${
        selected ? "ring-2 ring-primary" : "border-primary"
      } bg-background shadow-md hover:scale-105 transition-all`}
    >
      {/* Award Image */}
      <img
        src={award.image}
        alt={award.title}
        className="w-full h-40 object-cover rounded-t-2xl"
      />

      {/* Title and Participants */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary">{award.title}</h2>
        <div className="flex gap-2 mt-2">
          {award.participants.map((participant, idx) => (
            <div key={idx} className="text-sm text-foreground">
              {participant}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Details */}
      <div className="absolute inset-0 bg-background/90 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 rounded-2xl">
        <p className="text-muted-foreground text-center">{award.description}</p>
        <p className="text-muted-foreground text-xs mt-2">{award.criteria}</p>
      </div>

      {/* Checkbox (Manage Mode Only) */}
      {manageMode && (
        <button
          onClick={onSelect}
          className="absolute top-2 right-2 bg-primary text-background rounded-full p-1"
        >
          {selected ? "✔" : "☐"}
        </button>
      )}
    </div>
  );
};

export default AwardCard;
