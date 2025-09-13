"use client";

import { useState, useEffect } from "react";
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

interface ResumeData {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  isActive: boolean;
}

interface ResumeUploadProps {
  onDataChange: () => void;
}

export default function ResumeUpload({ onDataChange }: ResumeUploadProps) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load resumes from localStorage on component mount
  useEffect(() => {
    const savedResumes = localStorage.getItem("admin-resumes");
    if (savedResumes) {
      setResumes(JSON.parse(savedResumes));
    }
  }, []);

  // Save resumes to localStorage whenever resumes change
  useEffect(() => {
    localStorage.setItem("admin-resumes", JSON.stringify(resumes));
    onDataChange();
  }, [resumes, onDataChange]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // In a real application, you would upload to a server here
      // For now, we'll simulate the upload and create a local URL
      const fileUrl = URL.createObjectURL(file);
      
      const newResume: ResumeData = {
        id: Date.now().toString(),
        name: file.name,
        url: fileUrl,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        isActive: resumes.length === 0 // First resume is active by default
      };

      // If this is the first resume or user wants to make it active, deactivate others
      if (resumes.length === 0 || confirm('Make this resume active?')) {
        setResumes(prev => [
          ...prev.map(r => ({ ...r, isActive: false })),
          { ...newResume, isActive: true }
        ]);
      } else {
        setResumes(prev => [...prev, newResume]);
      }

      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const deleteResume = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setResumes(prev => {
        const updated = prev.filter(r => r.id !== id);
        // If we deleted the active resume, make the first remaining one active
        if (updated.length > 0 && !updated.some(r => r.isActive)) {
          updated[0].isActive = true;
        }
        return updated;
      });
    }
  };

  const setActiveResume = (id: string) => {
    setResumes(prev => prev.map(r => ({ ...r, isActive: r.id === id })));
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
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isUploading ? 'Uploading...' : 'Drop your resume here'}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files (PDF, DOC, DOCX up to 5MB)
            </p>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                disabled={isUploading}
                className="hidden"
                id="resume-upload"
              />
              <Button
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
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
                        Set Active
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

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Upload your resume in PDF, DOC, or DOCX format</p>
            <p>• Maximum file size: 5MB</p>
            <p>• Only one resume can be active at a time</p>
            <p>• The active resume will be displayed on your portfolio</p>
            <p>• You can preview and download your uploaded resumes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
