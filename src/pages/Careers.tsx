import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const jobListings = [
  {
    id: "1",
    title: "QA Tester",
    department: "Quality Assurance",
    location: "Remote",
    type: "Full-time",
    salary: "$55,000 - $75,000",
    description: "Join our QA team to ensure the highest quality of our pet matching platform. Test features, identify bugs, and work closely with developers to deliver exceptional user experiences.",
    requirements: ["2+ years QA experience", "Manual and automated testing", "Bug tracking tools", "Attention to detail"],
  },
  {
    id: "2",
    title: "QA Tester",
    department: "Quality Assurance",
    location: "Remote",
    type: "Full-time",
    salary: "$55,000 - $75,000",
    description: "Help maintain the quality standards of PawDNA's platform through comprehensive testing strategies. Create test cases, execute tests, and collaborate with cross-functional teams.",
    requirements: ["2+ years QA experience", "Test automation frameworks", "Agile methodology", "Strong communication skills"],
  },
  {
    id: "3",
    title: "Jr. Software Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    description: "Start your career with PawDNA as a Junior Developer. Work on feature development, learn best practices, and contribute to our mission of connecting pets with loving families.",
    requirements: ["1+ years development experience", "React and TypeScript", "Git version control", "Eager to learn"],
  },
  {
    id: "4",
    title: "Mid-Level Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$95,000 - $125,000",
    description: "Build and maintain features for our pet marketplace platform. Collaborate with designers and product managers to create intuitive, scalable solutions for pet adoption.",
    requirements: ["3-5 years development experience", "Full-stack development", "API design", "Database optimization"],
  },
  {
    id: "5",
    title: "Sr. Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    description: "Lead technical initiatives and mentor junior developers. Architect scalable solutions, make critical technical decisions, and drive engineering excellence at PawDNA.",
    requirements: ["7+ years development experience", "System architecture", "Team leadership", "Performance optimization"],
  },
  {
    id: "6",
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Define product strategy and roadmap for PawDNA's platform. Work with stakeholders to prioritize features, conduct market research, and deliver value to our users.",
    requirements: ["5+ years product management", "Data-driven decision making", "User research", "Stakeholder management"],
  },
  {
    id: "7",
    title: "Business Analyst",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    description: "Analyze business processes, identify improvement opportunities, and translate requirements into actionable insights. Support data-driven decision making across the organization.",
    requirements: ["3+ years BA experience", "SQL and data analysis", "Process improvement", "Business intelligence tools"],
  },
  {
    id: "8",
    title: "Intern - Software Development",
    department: "Engineering",
    location: "Remote",
    type: "Full-time / Part-time",
    salary: "$20 - $30/hour",
    description: "Gain hands-on experience in software development at a growing pet-tech startup. Work on real projects, learn from experienced engineers, and make an impact.",
    requirements: ["Currently pursuing CS degree", "Basic programming knowledge", "Passion for technology", "Team player"],
  },
  {
    id: "9",
    title: "Product Researcher",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    salary: "$75,000 - $100,000",
    description: "Conduct user research to understand pet adopter and breeder needs. Design studies, analyze findings, and provide insights that shape our product decisions.",
    requirements: ["3+ years UX research", "Qualitative and quantitative methods", "User testing", "Data analysis"],
  },
  {
    id: "10",
    title: "Financial Analyst",
    department: "Finance",
    location: "Remote",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    description: "Support financial planning, budgeting, and forecasting activities. Analyze financial data, prepare reports, and provide insights to drive business growth.",
    requirements: ["2+ years financial analysis", "Financial modeling", "Excel proficiency", "Accounting knowledge"],
  },
];

export default function Careers() {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
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

  const handleApplyNow = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setFormData({ ...formData, position: jobTitle });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

          <Card ref={formRef}>
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
                    {selectedJob ? (
                      <Input
                        id="position"
                        required
                        value={formData.position}
                        disabled
                        className="bg-muted"
                      />
                    ) : (
                      <Select
                        value={formData.position}
                        onValueChange={(value) => setFormData({ ...formData, position: value })}
                        required
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobListings.map((job) => (
                            <SelectItem key={job.id} value={job.title}>
                              {job.title} - {job.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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

          {/* Job Listings Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Current Openings</h2>
              <p className="text-muted-foreground">
                Explore exciting opportunities to join our team and help revolutionize pet adoption
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          {job.department}
                        </CardDescription>
                      </div>
                      <Button size="lg" onClick={() => handleApplyNow(job.title)}>Apply Now</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </Badge>
                      <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-700 border-green-500/20">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          About the Role
                        </h4>
                        <p className="text-muted-foreground">{job.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Requirements</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
