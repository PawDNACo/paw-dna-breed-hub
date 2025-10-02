import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  petId: string;
  petName: string;
  petImage?: string;
}

export const ShareButton = ({ petId, petName, petImage }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/pet/${petId}`;
  const shareText = `Check out ${petName} on PawDNA!`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-3">Share this pet</h4>
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={shareToFacebook}
          >
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            Share on Facebook
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={shareToTwitter}
          >
            <Twitter className="h-4 w-4 mr-2 text-sky-500" />
            Share on Twitter
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={shareToLinkedIn}
          >
            <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
            Share on LinkedIn
          </Button>

          <div className="border-t pt-2 mt-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
