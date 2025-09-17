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
  AlertCircle
} from "lucide-react";
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

export default function ResumeUpload({ onDataChange }: ResumeUploadProps) {
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
          setResumes((data.resumes || []).map((r: any) => ({
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

  return (
    <div className="space-y-6">
      {/* Add by URL */}
      <Card>
        <CardHeader>
          <CardTitle>Add Resume by URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="Public file URL (PDF or image)" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
            <Input placeholder="Resume name (for subdomain)" value={newName} onChange={e => setNewName(e.target.value)} />
            <Button onClick={addByUrl} disabled={isUploading || !newUrl.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume List */}
      {resumes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Resumes</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    resume.isActive ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{resume.name}</h4>
                        {resume.isActive && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {resume.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(resume.size)} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(resume.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadResume(resume)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {!resume.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveResume(resume.id)}
                      >
                        Make Active
                      </Button>
                    )}
                    {resume.isActive && !resume.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultResume(resume.id)}
                      >
                        Make Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteResume(resume.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1 || isFetching}>Prev</Button>
          <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= Math.max(1, Math.ceil(total / limit)) || isFetching}>Next</Button>
         <LimitSelect limit={limit} setLimit={setLimit} name="resumes" />
        </div>
      </div>
    </div>
  );
}
