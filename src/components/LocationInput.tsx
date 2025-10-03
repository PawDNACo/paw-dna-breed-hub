import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }
];

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

  // Auto-generate state from ZIP code as user types
  useEffect(() => {
    if (location.zip_code.length === 5) {
      handleGeocodeZip();
    }
  }, [location.zip_code]);

  const handleGeocodeZip = async () => {
    if (!location.zip_code || location.zip_code.length !== 5) {
      return;
    }

    try {
      const response = await fetch(
        `https://api.zippopotam.us/us/${location.zip_code}`
      );

      if (!response.ok) {
        return;
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
      // Silently fail - user can manually select state
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
        <Input
          id="zip_code"
          placeholder="12345"
          maxLength={5}
          value={location.zip_code}
          onChange={(e) =>
            setLocation({ ...location, zip_code: e.target.value })
          }
        />
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
          <Select
            value={location.state}
            onValueChange={(value) => setLocation({ ...location, state: value })}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      <Button type="button" onClick={handleManualSubmit} className="w-full">
        Save Location
      </Button>
    </div>
  );
};
