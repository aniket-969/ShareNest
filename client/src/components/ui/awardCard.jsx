import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; 
import { cldUrl } from "@/utils/helper";
import { Trash2 } from "lucide-react";

const AwardCard = ({ award, participants, manageMode, onDelete }) => {
  const baseSizes = [224, 336, 448];
  const srcSet = baseSizes
    .map(w => `${cldUrl(award.image, { width: w, height: w })} ${w}w`)
    .join(', ');

  return (
    <Card className="relative group overflow-hidden border border-muted bg-card rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg duration-200 h-80 flex flex-col">
      {/* Image section */}
      <div className="h-[70%] w-full overflow-hidden bg-[#1c1f26]">
        <img
          src={cldUrl(award.image, { width: baseSizes[1], height: baseSizes[1] })}
          srcSet={srcSet}
          sizes="(max-width: 640px) 224px, (max-width: 1024px) 336px, 448px"
          alt={award.title}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Info section */}
      <CardContent className="flex flex-col items-center justify-center text-center py-2 flex-1 w-full bg-[#121418]">
        <h3 className="text-base font-semibold text-white">{award.title}</h3>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {award.assignedTo.map(userId => {
            const user = participants.find(p => p._id === userId);
            if (!user) return null;
            return (
              <div key={user._id} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.fullName}
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Overlay (only on hover when not managing) */}
      {!manageMode && (
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center text-center px-4 pointer-events-none z-0">
          <p className="text-white text-sm">{award.description}</p>
          <Badge variant="secondary" className="mt-2 px-3 py-1">
            {award.criteria}
          </Badge>
        </div>
      )}

      {/* Delete icon (manage mode) */}
      {manageMode && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(award._id); }}
          className="absolute top-2 right-2 z-10 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
          aria-label="Delete award"
        >
          <Trash2 size={16} />
        </button>
      )}
    </Card>
  );
};

export default AwardCard;