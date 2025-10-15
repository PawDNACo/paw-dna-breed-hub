import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const interestOptions = [
  { id: "breeder", label: "Breeder" },
  { id: "buyer", label: "Buyer" },
  { id: "rehomer", label: "Rehomer" },
  { id: "investor", label: "Investor" },
  { id: "browsing", label: "Just Browsing" },
] as const;

const waitlistSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[0-9\s\-\(\)\+]+$/, "Invalid phone number format"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  interests: z.array(z.string())
    .min(1, "Please select at least one interest"),
});

export default function Waitlist() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interests: [] as string[],
  });

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      waitlistSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      // Insert into waitlist table
      const { error } = await supabase
        .from("waitlist")
        .insert({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          interests: formData.interests,
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        interests: [],
      });
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                You're on the <span className="bg-gradient-hero bg-clip-text text-transparent">List!</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for joining our waitlist. We'll keep you updated on our launch and exclusive early access opportunities.
              </p>
              <Button onClick={() => navigate("/")} size="lg">
                Back to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our <span className="bg-gradient-hero bg-clip-text text-transparent">Waitlist</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Be the first to know when we launch. Get exclusive early access and special offers.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up for Early Access</CardTitle>
              <CardDescription>
                Fill out the form below and we'll notify you when we're ready to launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interest *</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-background"
                      >
                        {formData.interests.length > 0
                          ? `${formData.interests.length} selected`
                          : "Select your interests..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-background border shadow-lg z-50">
                      <div className="p-4 space-y-2">
                        {interestOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 cursor-pointer"
                            onClick={() => toggleInterest(option.id)}
                          >
                            <Checkbox
                              id={option.id}
                              checked={formData.interests.includes(option.id)}
                              onCheckedChange={() => toggleInterest(option.id)}
                            />
                            <Label
                              htmlFor={option.id}
                              className="flex-1 cursor-pointer font-normal"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {formData.interests.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.interests.map(id => 
                        interestOptions.find(opt => opt.id === id)?.label
                      ).join(", ")}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By joining, you agree to receive updates about our launch. 
                  You can unsubscribe at any time.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
