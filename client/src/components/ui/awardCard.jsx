import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AwardCard = ({ award }) => {
  return (
    <Card className="relative group overflow-hidden border border-muted bg-card rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 h-80 flex flex-col">
      
      {/* Image Section */}
      <div className="h-[60%] w-full overflow-hidden">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-contain bg-white p-4"
        />
      </div>

      {/* Title + Avatars */}
      <CardContent className="flex flex-col items-center justify-center text-center py-3 flex-1 bg-background">
        <h3 className="text-base font-semibold text-foreground">{award.title}</h3>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {award.assignedTo.map((user) => (
            <div key={user._id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.fullName}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center text-center px-4">
        <p className="text-white text-sm">{award.description}</p>
        <Badge variant="secondary" className="mt-2">{award.criteria}</Badge>
      </div>
    </Card>
  );
};

export default AwardCard;
