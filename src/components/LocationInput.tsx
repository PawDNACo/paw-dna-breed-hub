import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LocationInputProps {
  onLocationUpdate: (location: {
    zip_code: string;
    city: string;
    state: string;
    county?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}

export const LocationInput = ({ onLocationUpdate }: LocationInputProps) => {
  const { toast } = useToast();
  const [location, setLocation] = useState({
    zip_code: "",
    city: "",
    state: "",
    county: "",
  });

  const handleGeocodeZip = async () => {
    if (!location.zip_code || location.zip_code.length !== 5) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code",
        variant: "destructive",
      });
      return;
    }

    try {
      // Using a free geocoding API (you can replace with your preferred service)
      const response = await fetch(
        `https://api.zippopotam.us/us/${location.zip_code}`
      );

      if (!response.ok) {
        throw new Error("ZIP code not found");
      }

      const data = await response.json();
      const place = data.places[0];

      const updatedLocation = {
        zip_code: location.zip_code,
        city: place["place name"],
        state: place["state abbreviation"],
        county: place["county"] || "",
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
      };

      setLocation(updatedLocation);
      onLocationUpdate(updatedLocation);

      toast({
        title: "Location Found",
        description: `${updatedLocation.city}, ${updatedLocation.state}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find location for this ZIP code",
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = () => {
    if (!location.zip_code || !location.city || !location.state) {
      toast({
        title: "Required Fields",
        description: "Please fill in ZIP code, city, and state",
        variant: "destructive",
      });
      return;
    }

    onLocationUpdate(location);
    toast({
      title: "Location Saved",
      description: "Your location has been updated",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="zip_code">ZIP Code</Label>
        <div className="flex gap-2">
          <Input
            id="zip_code"
            placeholder="12345"
            maxLength={5}
            value={location.zip_code}
            onChange={(e) =>
              setLocation({ ...location, zip_code: e.target.value })
            }
          />
          <Button type="button" onClick={handleGeocodeZip}>
            Lookup
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="City"
          value={location.city}
          onChange={(e) => setLocation({ ...location, city: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="CA"
            maxLength={2}
            value={location.state}
            onChange={(e) =>
              setLocation({ ...location, state: e.target.value.toUpperCase() })
            }
          />
        </div>
        <div>
          <Label htmlFor="county">County (optional)</Label>
          <Input
            id="county"
            placeholder="County"
            value={location.county}
            onChange={(e) =>
              setLocation({ ...location, county: e.target.value })
            }
          />
        </div>
      </div>
      <Button type="button" onClick={handleManualSubmit} variant="outline" className="w-full">
        Save Location
      </Button>
    </div>
  );
};
