import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Dog, MessageSquare, ShoppingCart, Heart, Settings } from "lucide-react";
import { toast } from "sonner";

// Demo data
const demoProfiles = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@demo.test", role: "Breeder", verified: true, location: "Austin, TX" },
  { id: "2", name: "Mike Peterson", email: "mike.p@demo.test", role: "Buyer", verified: true, location: "Denver, CO" },
  { id: "3", name: "Emily Chen", email: "emily.c@demo.test", role: "Breeder", verified: true, location: "Seattle, WA" },
  { id: "4", name: "David Rodriguez", email: "david.r@demo.test", role: "Rehomer", verified: false, location: "Miami, FL" },
  { id: "5", name: "Jessica Williams", email: "jessica.w@demo.test", role: "Buyer", verified: true, location: "Portland, OR" },
];

const demoPets = [
  { id: "1", name: "Max", breed: "Golden Retriever", species: "Dog", age: "8 weeks", price: "$1,200", breeder: "Sarah Johnson", status: "Available" },
  { id: "2", name: "Luna", breed: "Persian", species: "Cat", age: "12 weeks", price: "$800", breeder: "Emily Chen", status: "Available" },
  { id: "3", name: "Rocky", breed: "German Shepherd", species: "Dog", age: "10 weeks", price: "$1,500", breeder: "Sarah Johnson", status: "Pending" },
  { id: "4", name: "Whiskers", breed: "Maine Coon", species: "Cat", age: "6 weeks", price: "$900", breeder: "Emily Chen", status: "Available" },
  { id: "5", name: "Buddy", breed: "Labrador", species: "Dog", age: "9 weeks", price: "$1,100", breeder: "Sarah Johnson", status: "Sold" },
];

const demoConversations = [
  { id: "1", buyer: "Mike Peterson", breeder: "Sarah Johnson", pet: "Max", status: "Active", messages: 12 },
  { id: "2", buyer: "Jessica Williams", breeder: "Emily Chen", pet: "Luna", status: "Active", messages: 8 },
  { id: "3", buyer: "Mike Peterson", breeder: "Emily Chen", pet: "Whiskers", status: "Pending", messages: 3 },
  { id: "4", buyer: "Jessica Williams", breeder: "Sarah Johnson", pet: "Rocky", status: "Completed", messages: 24 },
];

const demoTransactions = [
  { id: "1", buyer: "Mike Peterson", seller: "Sarah Johnson", pet: "Buddy", amount: "$1,100", date: "2025-01-10", status: "Completed" },
  { id: "2", buyer: "Jessica Williams", seller: "Emily Chen", pet: "Mittens", amount: "$750", date: "2025-01-08", status: "Completed" },
  { id: "3", buyer: "Mike Peterson", seller: "Sarah Johnson", pet: "Max", amount: "$1,200", date: "2025-01-12", status: "Processing" },
];

export default function QADemo() {
  const [activeTab, setActiveTab] = useState("profiles");

  const handleTestAction = (action: string) => {
    toast.success(`Demo Action: ${action}`, {
      description: "This is a simulated action in the QA environment",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">QA/Demo Environment</h1>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              TEST DATA
            </Badge>
          </div>
          <p className="text-muted-foreground">
            This is a testing environment with dummy data for QA purposes. All actions are simulated.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Demo Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoProfiles.length}</div>
              <p className="text-xs text-muted-foreground">Test profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Dog className="h-4 w-4" />
                Demo Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoPets.length}</div>
              <p className="text-xs text-muted-foreground">Test listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoConversations.length}</div>
              <p className="text-xs text-muted-foreground">Test chats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoTransactions.length}</div>
              <p className="text-xs text-muted-foreground">Test sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Test Credentials */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Test Account Credentials
            </CardTitle>
            <CardDescription>Use these accounts to test different user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-semibold text-sm mb-1">Admin</p>
                <p className="text-xs text-muted-foreground mb-2">qa-admin@pawdna.test</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">QATest2025!</code>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-semibold text-sm mb-1">Breeder</p>
                <p className="text-xs text-muted-foreground mb-2">qa-breeder@pawdna.test</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">QATest2025!</code>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-semibold text-sm mb-1">Buyer</p>
                <p className="text-xs text-muted-foreground mb-2">qa-buyer@pawdna.test</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">QATest2025!</code>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-semibold text-sm mb-1">Rehomer</p>
                <p className="text-xs text-muted-foreground mb-2">qa-rehomer@pawdna.test</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">QATest2025!</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Profiles Tab */}
          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>Demo User Profiles</CardTitle>
                <CardDescription>Test user accounts with different roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{profile.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{profile.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{profile.role}</Badge>
                        </TableCell>
                        <TableCell>{profile.location}</TableCell>
                        <TableCell>
                          {profile.verified ? (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestAction(`View profile: ${profile.name}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pets Tab */}
          <TabsContent value="pets">
            <Card>
              <CardHeader>
                <CardTitle>Demo Pet Listings</CardTitle>
                <CardDescription>Test pet listings with various statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Breeder</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoPets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.age}</TableCell>
                        <TableCell className="font-semibold">{pet.price}</TableCell>
                        <TableCell className="text-muted-foreground">{pet.breeder}</TableCell>
                        <TableCell>
                          {pet.status === "Available" && (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Available</Badge>
                          )}
                          {pet.status === "Pending" && (
                            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Pending</Badge>
                          )}
                          {pet.status === "Sold" && (
                            <Badge variant="outline">Sold</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestAction(`View pet: ${pet.name}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Demo Conversations</CardTitle>
                <CardDescription>Test messaging between buyers and breeders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Breeder</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoConversations.map((conv) => (
                      <TableRow key={conv.id}>
                        <TableCell className="font-medium">{conv.buyer}</TableCell>
                        <TableCell className="font-medium">{conv.breeder}</TableCell>
                        <TableCell>{conv.pet}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{conv.messages} messages</Badge>
                        </TableCell>
                        <TableCell>
                          {conv.status === "Active" && (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Active</Badge>
                          )}
                          {conv.status === "Pending" && (
                            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Pending</Badge>
                          )}
                          {conv.status === "Completed" && (
                            <Badge variant="outline">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestAction(`View conversation: ${conv.buyer} <> ${conv.breeder}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Demo Transactions</CardTitle>
                <CardDescription>Test purchase transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                        <TableCell className="font-medium">{tx.buyer}</TableCell>
                        <TableCell className="font-medium">{tx.seller}</TableCell>
                        <TableCell>{tx.pet}</TableCell>
                        <TableCell className="font-semibold">{tx.amount}</TableCell>
                        <TableCell>
                          {tx.status === "Completed" && (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Completed</Badge>
                          )}
                          {tx.status === "Processing" && (
                            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Processing</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestAction(`View transaction: ${tx.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Test Actions</CardTitle>
            <CardDescription>Simulate common platform actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Create new pet listing")}
              >
                <Dog className="mr-2 h-4 w-4" />
                Create Pet Listing
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Start conversation")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Process payment")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Add to favorites")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to Favorites
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Update profile")}
              >
                <Users className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleTestAction("Generate test data")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Generate Test Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
