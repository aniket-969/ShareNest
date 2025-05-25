import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AwardCard = ({ award,participants }) => {
  return (
    <Card className="relative group overflow-hidden border border-muted bg-card rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 h-80 flex flex-col">
  
  {/* Image section (slightly lighter charcoal) */}
  <div className="h-[70%] w-full overflow-hidden bg-[#1c1f26]">
    <img
      src={award.image}
      alt={award.title}
      className="w-full h-full object-contain p-4"
    />
  </div>

  {/* Info section (deeper neutral tone) */}
  <CardContent className="flex flex-col items-center justify-center text-center py-2 flex-1 w-full bg-[#121418]">
    <h3 className="text-base font-semibold text-white">{award.title}</h3>
    <div className="flex flex-wrap justify-center gap-2 mt-1">
      {award.assignedTo.map((userId) => {
  const user = participants.find((p) => p._id === userId);
  if (!user) return null;

  return (
    <div key={user._id} className="flex items-center gap-1 text-xs text-muted-foreground">
      <Avatar className="h-5 w-5">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      {user.fullName}
    </div>
  );
})}

    </div>
  </CardContent>

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center text-center px-4">
    <p className="text-white text-sm">{award.description}</p>
    <Badge variant="secondary" className="mt-2 px-3 py-1">{award.criteria}</Badge>
  </div>
</Card>


  );
};

export default AwardCard;
