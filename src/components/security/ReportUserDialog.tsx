import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ReportUserDialogProps {
  reportedUserId: string;
  reportedUserName?: string;
}

export const ReportUserDialog = ({ reportedUserId, reportedUserName }: ReportUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reason || !details.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a reason and provide details about the report.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to report a user");
      }

      const { error } = await supabase
        .from("user_reports")
        .insert({
          reported_user_id: reportedUserId,
          reporter_user_id: user.id,
          report_reason: reason,
          report_details: details,
        });

      if (error) throw error;

      // Automatically freeze the reported account
      const { error: freezeError } = await supabase.functions.invoke("freeze-reported-account", {
        body: {
          reportedUserId,
          reportReason: reason,
        },
      });

      if (freezeError) {
        console.error("Error freezing account:", freezeError);
      }

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. The reported account has been frozen and our team will review it immediately.",
      });

      setOpen(false);
      setReason("");
      setDetails("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report User{reportedUserName ? `: ${reportedUserName}` : ""}</DialogTitle>
          <DialogDescription>
            Please provide details about why you're reporting this user. Our team will review this immediately.
            <span className="block mt-2 font-semibold text-destructive">
              Note: The reported account will be frozen pending investigation.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Report</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scam">Suspected Scam</SelectItem>
                <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="fake_listing">Fake Listing</SelectItem>
                <SelectItem value="off_platform">Attempted Off-Platform Transaction</SelectItem>
                <SelectItem value="suspicious">Suspicious Behavior</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              placeholder="Please provide specific details about the incident..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
