"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  Link as LinkIcon,
  Save,
  RefreshCw,
  LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import BlogsManagement from "../admin/components/blogs-management";
import SkillsManagement from "../admin/components/skills-management";
import ProjectsManagement from "../admin/components/projects-management";
import ExperienceManagement from "../admin/components/experience-management";
import ResumeUpload from "../admin/components/resume-upload";
import SocialLinksManagement from "../admin/components/social-links-management";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { signOut, user } = useAuth();

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      // Save all data to localStorage or API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setHasUnsavedChanges(false);
      alert("All changes saved successfully!");
    } catch {
      alert("Error saving changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">
                Manage your portfolio content and settings
              </p>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  Signed in as {user.email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={isLoading || !hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save All Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          {hasUnsavedChanges && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You have unsaved changes. Don&apos;t forget to save!
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Social Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogsManagement onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillsManagement onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectsManagement onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceManagement onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Resume Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Links Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialLinksManagement onDataChange={() => setHasUnsavedChanges(true)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
