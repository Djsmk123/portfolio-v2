"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StorageTab from "../admin/components/StorageTab";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import SkillsManagement from "../admin/components/skills-management";
import ProjectsManagement from "../admin/components/projects-management";
import ExperienceManagement from "../admin/components/experience-management";
import ResumeUpload from "../admin/components/resume-upload";

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
  const [banner, setBanner] = useState<{ type: 'success' | 'error', message: string } | null>(null)

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
      setBanner({ type: 'success', message: `Changes for "${activeTab}" saved successfully!` })
    } catch {
      setBanner({ type: 'error', message: 'Error saving changes. Please try again.' })
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">Admin Panel</h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                Manage your portfolio content and settings
              </p>
              {user && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                  Signed in as {user.email}
                </p>
              )}
            </div>
            
            {/* Action Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 h-9"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Refresh</span>
                </Button>
                <Button
                  onClick={handleSaveCurrent}
                  disabled={isLoading || !unsavedByTab[activeTab]}
                  className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 h-9"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">{isLoading ? 'Saving...' : 'Save'}</span>
                  <span className="xs:hidden">{isLoading ? '...' : 'Save'}</span>
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-xs sm:text-sm px-3 py-2 h-9"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Sign Out</span>
              </Button>
            </div>
          </div>
          
          {/* Alerts */}
          {banner && (
            <div className="mt-4">
              <Alert className={banner.type === 'error' ? 'border-destructive/20 bg-destructive/10' : 'border-green-200 bg-green-50'}>
                <AlertDescription className={`${banner.type === 'error' ? 'text-destructive' : 'text-green-700'} text-sm`}>
                  {banner.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {unsavedByTab[activeTab] && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                You have unsaved changes. Don&apos;t forget to save!
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Responsive Tab List */}
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-5 w-full min-w-[500px] sm:min-w-full h-auto sm:h-10">
              <TabsTrigger 
                value="projects" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm min-h-[60px] sm:min-h-0"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="leading-tight">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm min-h-[60px] sm:min-h-0"
              >
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="leading-tight">Experience</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm min-h-[60px] sm:min-h-0"
              >
                <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="leading-tight">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resume" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm min-h-[60px] sm:min-h-0"
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="leading-tight">Resume</span>
              </TabsTrigger>
              <TabsTrigger 
                value="storage" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm min-h-[60px] sm:min-h-0"
              >
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="leading-tight">Storage</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="projects">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Projects Management</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <ProjectsManagement
                  key={refreshNonceByTab.projects}
                  onDataChange={markProjectsDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Experience Management</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <ExperienceManagement
                  key={refreshNonceByTab.experience}
                  onDataChange={markExperienceDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Skills Management</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <SkillsManagement
                  key={refreshNonceByTab.skills}
                  onDataChange={markSkillsDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Resume Upload</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <ResumeUpload
                  key={refreshNonceByTab.resume}
                  onDataChange={markResumeDirty}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Storage</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <StorageTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}