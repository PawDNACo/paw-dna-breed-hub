/**
 * Add watermark to image client-side before upload
 * This provides an immediate watermark that can't be bypassed by users
 */

export const addWatermarkToImage = async (
  imageFile: File
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        // Create canvas with same dimensions as image
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Add diagonal watermark pattern
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.font = `bold ${Math.max(24, img.width / 20)}px Arial`;
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;

        const watermarkText = "PawDNA.org";
        const spacing = Math.max(150, img.width / 5);

        // Create diagonal watermark pattern
        for (let y = 0; y < img.height; y += spacing) {
          for (let x = 0; x < img.width; x += spacing) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6); // -30 degrees
            ctx.strokeText(watermarkText, 0, 0);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();
          }
        }

        // Add timestamp and copyright in bottom right corner
        ctx.globalAlpha = 0.5;
        const fontSize = Math.max(16, img.width / 40);
        ctx.font = `bold ${fontSize}px Arial`;
        const timestamp = new Date().toISOString().split("T")[0];
        const bottomText = `© PawDNA ${timestamp}`;
        const metrics = ctx.measureText(bottomText);
        const textWidth = metrics.width;
        const padding = 20;

        // Add background for better readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
          img.width - textWidth - padding * 2,
          img.height - fontSize - padding * 2,
          textWidth + padding * 2,
          fontSize + padding * 2
        );

        // Add text
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeText(
          bottomText,
          img.width - textWidth - padding,
          img.height - padding
        );
        ctx.fillText(
          bottomText,
          img.width - textWidth - padding,
          img.height - padding
        );

        ctx.restore();

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/jpeg",
          0.95
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(imageFile);
  });
};

/**
 * Add watermark to image URL (for existing images)
 */
export const addWatermarkToImageUrl = async (
  imageUrl: string
): Promise<Blob> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], "image.jpg", { type: blob.type });
  return addWatermarkToImage(file);
};

/**
 * Batch watermark multiple images
 */
export const batchWatermarkImages = async (
  files: File[]
): Promise<Blob[]> => {
  return Promise.all(files.map((file) => addWatermarkToImage(file)));
};
