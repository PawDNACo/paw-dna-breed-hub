import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Careers() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    why: "",
    employmentType: "full-time",
    salary: "",
    startDate: "",
    resume: null as File | null,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been attached to your application.`,
      });
    }
  };

  const handleIntegrationUpload = (source: string) => {
    toast({
      title: "Integration coming soon",
      description: `${source} integration will be available soon. Please use manual upload for now.`,
      variant: "destructive",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application submitted!",
      description: "Thank you for your interest. We'll review your application and get back to you soon.",
    });
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      why: "",
      employmentType: "full-time",
      salary: "",
      startDate: "",
      resume: null,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us revolutionize pet adoption with verified matches and DNA technology
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Fill out the form below and upload your resume to apply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Position Applied For *</Label>
                    <Input
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-4">
                  <Label>Upload Resume *</Label>
                  
                  {/* Manual Upload */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      required={!formData.resume}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">
                        {formData.resume ? formData.resume.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 10MB)</p>
                    </label>
                  </div>

                  {/* Integration Options */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleIntegrationUpload("Google Drive")}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Google Drive
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleIntegrationUpload("Box")}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Box
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleIntegrationUpload("LinkedIn")}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                {/* Application Questions */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="why">Why do you want to work here? *</Label>
                    <Textarea
                      id="why"
                      required
                      value={formData.why}
                      onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                      placeholder="Tell us what excites you about joining PawDNA..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label>Are you looking for full time, part time, or contract? *</Label>
                    <RadioGroup
                      value={formData.employmentType}
                      onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-time" id="full-time" />
                        <Label htmlFor="full-time" className="font-normal cursor-pointer">
                          Full Time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part-time" id="part-time" />
                        <Label htmlFor="part-time" className="font-normal cursor-pointer">
                          Part Time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contract" id="contract" />
                        <Label htmlFor="contract" className="font-normal cursor-pointer">
                          Contract
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="salary">What is your minimum salary requirement? *</Label>
                    <Input
                      id="salary"
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="$50,000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">When can you start? *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
