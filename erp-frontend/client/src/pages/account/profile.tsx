import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const { user, tenant } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your organization profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-full px-4 lg:px-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Organization Profile</h1>
            <p className="text-xs text-muted-foreground">Manage your organization details</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Organization Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {tenant?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") || "TC"}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{tenant?.name || "Your Organization"}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Active
                    </Badge>
                    <span>•</span>
                    <span>Professional Plan</span>
                  </CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  defaultValue={tenant?.name || ""}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  defaultValue="Technology"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue="A leading technology company providing innovative solutions..."
                disabled={!isEditing}
                rows={3}
              />
            </div>

            {/* Contact Info */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@company.com"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    defaultValue="+234 801 234 5678"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    defaultValue="www.company.com"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    defaultValue="Lagos, Nigeria"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Account Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tenant ID</p>
                    <p className="text-sm font-medium font-mono">{tenant?.id || "TNT-12345"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">January 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Primary Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Contact</CardTitle>
            <CardDescription>The main point of contact for this account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
