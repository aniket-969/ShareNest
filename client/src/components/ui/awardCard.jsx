const AwardCard = ({ award, manageMode, selected, onSelect }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary bg-background shadow-md hover:scale-105 transition-all h-80 flex flex-col">
      {/* Image Section (70-75%) */}
      <div className="h-[70%] w-full overflow-hidden">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Text Section (25-30%) */}
      <div className="flex flex-col justify-center flex-1 p-3 text-center">
        <h2 className="text-lg font-bold text-primary">{award.title}</h2>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {award.participants.map((participant, idx) => (
            <div key={idx} className="text-sm text-foreground">
              {participant}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Layer */}
      <div className="absolute inset-0 bg-background/90 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 rounded-2xl text-center">
        <p className="text-muted-foreground">{award.description}</p>
        <p className="text-muted-foreground text-xs mt-2">{award.criteria}</p>
      </div>

      {/* Checkbox (Manage Mode) */}
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
