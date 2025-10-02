import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  status: string;
  created_at: string;
  buyer_id: string;
  breeder_id: string;
  pet_id: string;
  pets: {
    name: string;
    breed: string;
    price: number;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function ConversationsDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          pets (name, breed, price),
          profiles!conversations_buyer_id_fkey (full_name, email)
        `)
        .eq("breeder_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error: any) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Approved",
        description: "You can now message this buyer.",
      });
      loadConversations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ status: "rejected" })
        .eq("id", conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Rejected",
        description: "The buyer has been notified.",
      });
      loadConversations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "pending":
      default:
        return <Badge className="bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Conversations</h1>
          <p className="text-muted-foreground">
            Manage buyer inquiries and messages
          </p>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No conversations yet</p>
              <p className="text-sm text-muted-foreground">
                Buyers will request to message you about your listings
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {conversation.profiles.full_name}
                      </CardTitle>
                      <CardDescription>
                        Interested in: {conversation.pets.name} ({conversation.pets.breed})
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${conversation.pets.price}
                      </p>
                    </div>
                    {getStatusBadge(conversation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {conversation.status === "pending" && (
                      <>
                        <Button
                          onClick={() => handleApprove(conversation.id)}
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(conversation.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {conversation.status === "approved" && (
                      <Button
                        onClick={() => setSelectedConversation(conversation)}
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Open Messages
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Requested: {new Date(conversation.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog 
        open={!!selectedConversation} 
        onOpenChange={() => setSelectedConversation(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Conversation with {selectedConversation?.profiles.full_name}
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && userId && (
            <MessagingInterface
              conversationId={selectedConversation.id}
              currentUserId={userId}
              recipientId={selectedConversation.buyer_id}
              isApproved={selectedConversation.status === "approved"}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}