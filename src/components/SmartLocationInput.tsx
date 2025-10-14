import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface SmartLocationInputProps {
  zipCode: string;
  city: string;
  state: string;
  onZipChange: (zip: string) => void;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  required?: boolean;
}

export const SmartLocationInput = ({
  zipCode,
  city,
  state,
  onZipChange,
  onCityChange,
  onStateChange,
  required = false
}: SmartLocationInputProps) => {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Geocode ZIP code when user enters it
  useEffect(() => {
    if (zipCode.length === 5) {
      handleGeocodeZip();
    }
  }, [zipCode]);

  const handleGeocodeZip = async () => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) return;

      const data = await response.json();
      const place = data.places[0];

      onCityChange(place["place name"]);
      onStateChange(place["state abbreviation"]);
    } catch (error) {
      // Silently fail - user can manually select
    }
  };

  // Fetch cities when state is selected
  const handleStateChange = async (selectedState: string) => {
    onStateChange(selectedState);
    
    if (selectedState) {
      setIsLoadingCities(true);
      try {
        // Fetch sample cities from ZIP codes API
        // Note: This is a simplified approach. For production, you'd want a comprehensive city database
        const response = await fetch(`https://api.zippopotam.us/us/${selectedState}`);
        if (response.ok) {
          const data = await response.json();
          // Extract unique city names
          const cityList: string[] = data.places?.map((p: any) => p["place name"] as string) || [];
          setCities([...new Set(cityList)].sort());
        }
      } catch (error) {
        // Allow manual entry if API fails
      } finally {
        setIsLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="zip_code">ZIP Code {required && "*"}</Label>
        <Input
          id="zip_code"
          placeholder="12345"
          maxLength={5}
          value={zipCode}
          onChange={(e) => onZipChange(e.target.value)}
          required={required}
        />
      </div>
      
      <div>
        <Label htmlFor="city">City {required && "*"}</Label>
        {cities.length > 0 ? (
          <div className="relative">
            <Input
              id="city"
              list="cities-datalist"
              placeholder="Select or type city"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              required={required}
              disabled={isLoadingCities}
            />
            <datalist id="cities-datalist">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        ) : (
          <Input
            id="city"
            placeholder="City name"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            required={required}
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="state">State {required && "*"}</Label>
        <Select value={state} onValueChange={handleStateChange} required={required}>
          <SelectTrigger id="state">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
