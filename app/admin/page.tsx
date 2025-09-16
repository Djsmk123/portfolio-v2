"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
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
// import BlogsManagement from "../admin/components/blogs-management";
import SkillsManagement from "../admin/components/skills-management";
import ProjectsManagement from "../admin/components/projects-management";
import ExperienceManagement from "../admin/components/experience-management";
import ResumeUpload from "../admin/components/resume-upload";
import SocialLinksManagement from "../admin/components/social-links-management";

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [unsavedByTab, setUnsavedByTab] = useState<Record<string, boolean>>({
    projects: false,
    experience: false,
    skills: false,
    resume: false,
    social: false
  })
  const [refreshNonceByTab, setRefreshNonceByTab] = useState<Record<string, number>>({
    projects: 0,
    experience: 0,
    skills: 0,
    resume: 0,
    social: 0
  })
  const { signOut, user } = useAuth();

  // Memoized change handlers per tab to avoid unstable function identities
  const markProjectsDirty = useCallback(() => {
    setUnsavedByTab(prev => ({ ...prev, projects: true }))
  }, [])

  const markExperienceDirty = useCallback(() => {
    setUnsavedByTab(prev => ({ ...prev, experience: true }))
  }, [])

  const markSkillsDirty = useCallback(() => {
    setUnsavedByTab(prev => ({ ...prev, skills: true }))
  }, [])

  const markResumeDirty = useCallback(() => {
    setUnsavedByTab(prev => ({ ...prev, resume: true }))
  }, [])

  const markSocialDirty = useCallback(() => {
    setUnsavedByTab(prev => ({ ...prev, social: true }))
  }, [])

  const handleSaveCurrent = async () => {
    setIsLoading(true)
    try {
      // Save only current tab's data to localStorage or API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUnsavedByTab(prev => ({ ...prev, [activeTab]: false }))
      alert(`Changes for "${activeTab}" saved successfully!`)
    } catch {
      alert('Error saving changes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshNonceByTab(prev => ({ ...prev, [activeTab]: (prev[activeTab] || 0) + 1 }))
  }

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
                onClick={handleSaveCurrent}
                disabled={isLoading || !unsavedByTab[activeTab]}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
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
          {unsavedByTab[activeTab] && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You have unsaved changes. Don&apos;t forget to save!
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
           
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Skills
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

      

        

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectsManagement
                  key={refreshNonceByTab.projects}
                  onDataChange={markProjectsDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceManagement
                  key={refreshNonceByTab.experience}
                  onDataChange={markExperienceDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillsManagement
                  key={refreshNonceByTab.skills}
                  onDataChange={markSkillsDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Resume Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload
                  key={refreshNonceByTab.resume}
                  onDataChange={markResumeDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Links Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialLinksManagement
                  key={refreshNonceByTab.social}
                  onDataChange={markSocialDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
