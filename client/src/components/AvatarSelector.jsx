import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "croodles",
  "fun-emoji",
  "icons",
  "lorelei",
  "micah",
  "miniavs",
  "notionists",
  "open-peeps",
  "personas",
  "pixel-art",
  "shapes",
];

const generateSeeds = () =>
  Array.from({ length: 15 }, () => Math.random().toString(36).substring(2, 10));

const getDiceBearUrl = (seed, style = "adventurer") =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const AvatarSelector = ({ onSelect, style = "adventurer" }) => {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seeds, setSeeds] = useState(generateSeeds);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setImageLoaded({});
    setSelectedUrl(null);
    setSeeds(generateSeeds());
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleSelect = (url) => {
    setSelectedUrl(url);
    onSelect(url);
    setIsDialogOpen(false);
  };

  const handleImageLoad = (url) => {
    setImageLoaded((prev) => ({ ...prev, [url]: true }));
  };

  const avatars = seeds.map((seed) => ({
    seed,
    url: getDiceBearUrl(seed, style),
  }));

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          {selectedUrl ? (
            <>
              
              Change Avatar
            </>
          ) : (
            "Select Avatar"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          <VisuallyHidden>Choose an avatar</VisuallyHidden>
        </DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Pick your avatar
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any avatar to select it
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRefresh}
            title="Generate new avatars"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>

        {/* Grid — 5 columns × 3 rows = 15 avatars */}
        <div className="grid grid-cols-5 gap-3">
          {avatars.map(({ seed, url }) => (
            <button
              key={seed}
              onClick={() => handleSelect(url)}
              className={`
                group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${
                  selectedUrl === url
                    ? "border-primary ring-2 ring-primary/30 scale-105"
                    : "border-transparent hover:border-primary/50 hover:scale-105"
                }
              `}
            >
              {/* Skeleton while loading */}
              {!imageLoaded[url] && (
                <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
              )}

              <img
                src={url}
                alt={`Avatar ${seed}`}
                onLoad={() => handleImageLoad(url)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded[url] ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Selected checkmark overlay */}
              {selectedUrl === url && (
                <span className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-xl">
                  <svg
                    className="w-5 h-5 text-primary drop-shadow"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Powered by{" "}
          <a
            href="https://www.dicebear.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            DiceBear
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
};
