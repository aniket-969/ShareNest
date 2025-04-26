import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AwardCard = ({ award }) => {
  return (
    <Card className="relative overflow-hidden border-primary bg-background shadow-md hover:scale-105 transition-all h-80 flex flex-col">
      
      {/* Image Section */}
      <div className="h-[70%] w-full overflow-hidden">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Text Section */}
      <CardContent className="flex flex-col justify-center flex-1 p-3 text-center">
        <h2 className="text-lg font-bold text-primary">{award.title}</h2>

        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {award.assignedTo.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={participant.avatar} alt={participant.fullName} />
                <AvatarFallback>
                  {participant.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {participant.fullName}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Hover Layer */}
      <div className="absolute inset-0 bg-background/90 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 rounded-2xl text-center">
        <p className="text-muted-foreground">{award.description}</p>
        <p className="text-muted-foreground text-xs mt-2">{award.criteria}</p>
      </div>
    </Card>
  );
};

export default AwardCard;
