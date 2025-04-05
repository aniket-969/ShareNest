import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";

export const AvatarSelector = ({ onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  const avatars = Array.from(
    { length: 50 },
    (_, i) => `https://avatar.iran.liara.run/public/${2 * i + 1}`
  );

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      setIsDialogOpen(false);
    }
  };

  const handleImageLoad = (url) => {
    setImageLoaded((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Select Avatar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          <VisuallyHidden>Choose an avatar</VisuallyHidden>
        </DialogTitle>

        <ScrollArea className="max-h-64 pr-2">
          <div className="grid grid-cols-5 gap-4">
            {avatars.map((url) => (
              <Card
                key={url}
                onClick={() => setSelectedAvatar(url)}
                className={`relative cursor-pointer p-2 transition-all hover:ring-2 hover:ring-blue-300 ${
                  selectedAvatar === url ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {!imageLoaded[url] && (
                  <Skeleton className="w-full h-full aspect-square rounded-full" />
                )}
                <img
                  src={url}
                  alt={`Avatar ${url.split("/").pop()}`}
                  onLoad={() => handleImageLoad(url)}
                  className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${
                    imageLoaded[url] ? "opacity-100" : "opacity-0 absolute"
                  }`}
                />
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
