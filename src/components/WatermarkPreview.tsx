import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check } from "lucide-react";

interface WatermarkPreviewProps {
  originalFile: File;
  watermarkedBlob: Blob;
}

export const WatermarkPreview = ({ originalFile, watermarkedBlob }: WatermarkPreviewProps) => {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [watermarkedUrl, setWatermarkedUrl] = useState<string>("");

  useEffect(() => {
    const origUrl = URL.createObjectURL(originalFile);
    const waterUrl = URL.createObjectURL(watermarkedBlob);
    
    setOriginalUrl(origUrl);
    setWatermarkedUrl(waterUrl);

    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(waterUrl);
    };
  }, [originalFile, watermarkedBlob]);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Watermark Protection Applied</CardTitle>
        </div>
        <CardDescription>
          Your image has been protected with PawDNA watermarks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Original Image</p>
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <img
                src={originalUrl}
                alt="Original"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Protected Image</p>
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Watermarked
              </Badge>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden border border-primary/50">
              <img
                src={watermarkedUrl}
                alt="Watermarked"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <Shield className="h-4 w-4 inline mr-1 text-primary" />
            This watermarked image will be uploaded to protect your content from unauthorized use.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
