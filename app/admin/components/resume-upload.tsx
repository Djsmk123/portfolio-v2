"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Download, 
  FileText, 
  Trash2,
  Eye,
  CheckCircle,
  MoreVertical
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminUser } from "@/lib/localstorage";
import { LimitSelect } from "./projects-management";

interface ResumeData {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  isActive: boolean;
  isDefault?: boolean;
}

interface ResumeUploadProps {
  onDataChange: () => void;
}

export default function ResumeUpload({ }: ResumeUploadProps) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const didRunRef = useRef(false)

  // Load resumes from API with pagination and strict-mode guard
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    async function load () {
      setIsFetching(true)
      setError(null)
      try {
        const token = getAdminUser()?.access_token
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        const res = await fetch(`/api/admin/resumes?${params.toString()}`, { credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined, signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load resumes (${res.status})`)
        const data = await res.json()
        if (!cancelled) {
          setResumes((data.resumes || []).map((r: {
            id: string;
            name: string;
            url: string;
            size: number;
            uploadedAt: string;
            isActive: boolean;
            isDefault: boolean;
            created_at: string;
            is_active: boolean;
            is_default: boolean;
          }) => ({
            id: r.id,
            name: r.name,
            url: r.url,
            size: r.size || 0,
            uploadedAt: r.created_at || new Date().toISOString(),
            isActive: r.is_active !== false,
            isDefault: r.is_default === true
          })))
          setTotal(typeof data.total === 'number' ? data.total : 0)
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load resumes')
      } finally {
        if (!cancelled) setIsFetching(false)
      }
    }
    if (didRunRef.current) return () => { controller.abort() }
    didRunRef.current = true
    load()
    return () => { cancelled = true; controller.abort(); didRunRef.current = false }
  }, [page, limit])

  const addByUrl = async () => {
    const token = getAdminUser()?.access_token
    const url = newUrl.trim();
    const name = newName.trim() || `resume-${Date.now()}`;
    if (!url) return;
    setIsUploading(true);
    try {
      const payload = { name, url, size: 0, is_active: resumes.length === 0, is_default: resumes.length === 0 }
      const res = await fetch('/api/admin/resumes', { method: 'POST',  credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` ,'Content-Type': 'application/json'} : undefined, body: JSON.stringify(payload) })
      if (res.ok) {
        const { resume } = await res.json()
        setResumes(prev => [
          ...prev.map(r => ({ ...r, isActive: payload.is_active ? false : r.isActive })),
          { id: resume.id, name: resume.name, url: resume.url, size: resume.size || 0, uploadedAt: resume.created_at || new Date().toISOString(), isActive: resume.is_active !== false, isDefault: resume.is_default === true }
        ])
      }
      setNewUrl("");
      setNewName("");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = async (id: string) => {
    const token = getAdminUser()?.access_token
    if (!confirm('Are you sure you want to delete this resume?')) return
    const res = await fetch(`/api/admin/resumes?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
    if (res.ok || res.status === 204) {
      setResumes(prev => {
        const updated = prev.filter(r => r.id !== id);
        if (updated.length > 0 && !updated.some(r => r.isActive)) updated[0].isActive = true
        return updated
      })
    }
  };

  const setActiveResume = async (id: string) => {
    const target = resumes.find(r => r.id === id)
    if (!target) return
    const token = getAdminUser()?.access_token
    const res = await fetch('/api/admin/resumes', { method: 'PATCH', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` ,'Content-Type': 'application/json'} : undefined, body: JSON.stringify({ id, name: target.name, url: target.url, size: target.size, is_active: true }) })
    if (res.ok) setResumes(prev => prev.map(r => ({ ...r, isActive: r.id === id })))
  };

  const setDefaultResume = async (id: string) => {
    const target = resumes.find(r => r.id === id)
    if (!target) return
    const token = getAdminUser()?.access_token
    const res = await fetch('/api/admin/resumes', { method: 'PATCH', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` ,'Content-Type': 'application/json'} : undefined, body: JSON.stringify({ id, name: target.name, url: target.url, size: target.size, is_default: true }) })
    if (res.ok) setResumes(prev => prev.map(r => ({ ...r, isDefault: r.id === id })))
  };

  const downloadResume = (resume: ResumeData) => {
    const link = document.createElement('a');
    link.href = resume.url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  //error 
  if(error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Alert variant="destructive">{error}</Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add by URL - Mobile Optimized */}
      <Card className="border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Add Resume by URL</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-2">
            <Input 
              placeholder="Public file URL (PDF or image)" 
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)}
              className="text-sm"
            />
            <Input 
              placeholder="Resume name" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="text-sm"
            />
            <Button 
              onClick={addByUrl} 
              disabled={isUploading || !newUrl.trim()}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume List - Mobile Optimized */}
      {resumes.length > 0 && (
        <Card className="border-0 sm:border shadow-none sm:shadow-sm">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl">Uploaded Resumes</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg ${
                    resume.isActive ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  {/* Resume Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <h4 className="font-medium text-sm sm:text-base truncate">{resume.name}</h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          {resume.isActive && (
                            <Badge variant="default" className="text-xs h-5">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          {resume.isDefault && (
                            <Badge variant="outline" className="text-xs h-5">Default</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {formatFileSize(resume.size)} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Mobile First Design */}
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    {/* Primary Actions - Always visible */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(resume.url, '_blank')}
                        className="h-8 w-8 p-0"
                        title="View Resume"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadResume(resume)}
                        className="h-8 w-8 p-0"
                        title="Download Resume"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Desktop: Show all buttons */}
                    <div className="hidden sm:flex items-center gap-1">
                      {!resume.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveResume(resume.id)}
                          className="h-8 px-3 text-xs whitespace-nowrap"
                        >
                          Make Active
                        </Button>
                      )}
                      {resume.isActive && !resume.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultResume(resume.id)}
                          className="h-8 px-3 text-xs whitespace-nowrap"
                        >
                          Make Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteResume(resume.id)}
                        className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile: Dropdown menu */}
                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {!resume.isActive && (
                            <DropdownMenuItem onClick={() => setActiveResume(resume.id)}>
                              Make Active
                            </DropdownMenuItem>
                          )}
                          {resume.isActive && !resume.isDefault && (
                            <DropdownMenuItem onClick={() => setDefaultResume(resume.id)}>
                              Make Default
                            </DropdownMenuItem>
                          )}
                          {(!resume.isActive || (resume.isActive && !resume.isDefault)) && (
                            <DropdownMenuSeparator />
                          )}
                          <DropdownMenuItem 
                            onClick={() => deleteResume(resume.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-1">
        <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
          <span className="block sm:inline">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
          <span className="hidden sm:inline"> • </span>
          <span className="block sm:inline">{total} total</span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))} 
              disabled={page <= 1 || isFetching}
              className="px-3 py-2 text-xs sm:text-sm"
            >
              Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(page + 1)} 
              disabled={page >= Math.max(1, Math.ceil(total / limit)) || isFetching}
              className="px-3 py-2 text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
          <div className="flex-shrink-0">
            <LimitSelect limit={limit} setLimit={setLimit} name="resumes" />
          </div>
        </div>
      </div>
    </div>
  );
}