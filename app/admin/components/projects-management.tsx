"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ExternalLink,
  Github,
  Image as ImageIcon
} from "lucide-react";
import { projectType } from "@/app/data/mock";

interface ProjectsManagementProps {
  onDataChange: () => void;
}

export default function ProjectsManagement({ onDataChange }: ProjectsManagementProps) {
  const [projects, setProjects] = useState<projectType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProject, setEditingProject] = useState<projectType | null>(null);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("admin-projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Load from mock data initially
      import("@/app/data/mock").then(({ projects }) => setProjects(projects));
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("admin-projects", JSON.stringify(projects));
    onDataChange();
  }, [projects, onDataChange]);

  const addNewProject = () => {
    const newProject: projectType = {
      id: Date.now().toString(),
      name: "",
      desc: "",
      tags: [],
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setEditingProject(newProject);
    setIsAddingNew(true);
  };

  const editProject = (project: projectType) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
  };

  const deleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const saveProject = () => {
    if (!editingProject) return;

    if (isAddingNew) {
      setProjects(prev => [...prev, editingProject]);
    } else {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id ? editingProject : project
      ));
    }

    setEditingProject(null);
    setIsAddingNew(false);
  };

  const addImageToProject = (imageUrl: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      images: [...editingProject.images, imageUrl]
    });
  };

  const removeImageFromProject = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      images: editingProject.images.filter((_, i) => i !== index)
    });
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={addNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              {/* Project Image */}
              <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
                {project.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editProject(project)}
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {project.desc}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-2">
                  {project.github && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="h-4 w-4 mr-1" />
                      GitHub
                    </Button>
                  )}
                  {project.links?.website && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.links?.website, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Project" : "Edit Project"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="id">Project ID</Label>
                  <Input
                    id="id"
                    value={editingProject.id}
                    onChange={(e) => setEditingProject({...editingProject, id: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({...editingProject, desc: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={editingProject.tags.join(", ")}
                  onChange={(e) => setEditingProject({
                    ...editingProject, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                  })}
                />
              </div>

              {/* Images Section */}
              <div>
                <Label>Project Images</Label>
                <div className="space-y-2">
                  {editingProject.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Project image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...editingProject.images];
                          newImages[index] = e.target.value;
                          setEditingProject({...editingProject, images: newImages});
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageFromProject(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add image URL"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addImageToProject(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add image URL"]') as HTMLInputElement;
                        if (input.value.trim()) {
                          addImageToProject(input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Links</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={editingProject.github || ""}
                      onChange={(e) => setEditingProject({...editingProject, github: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={editingProject.links?.website || ""}
                      onChange={(e) => setEditingProject({
                        ...editingProject, 
                        links: {...editingProject.links, website: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playstore">Play Store URL</Label>
                    <Input
                      id="playstore"
                      value={editingProject.links?.playstore || ""}
                      onChange={(e) => setEditingProject({
                        ...editingProject, 
                        links: {...editingProject.links, playstore: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appstore">App Store URL</Label>
                    <Input
                      id="appstore"
                      value={editingProject.links?.appstore || ""}
                      onChange={(e) => setEditingProject({
                        ...editingProject, 
                        links: {...editingProject.links, appstore: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Organization Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Organization</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={editingProject.org?.name || ""}
                      onChange={(e) => setEditingProject({
                        ...editingProject, 
                        org: {...editingProject.org, name: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-url">Organization URL</Label>
                    <Input
                      id="org-url"
                      value={editingProject.org?.url || ""}
                      onChange={(e) => setEditingProject({
                        ...editingProject, 
                        org: {...editingProject.org, url: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="org-logo">Organization Logo URL</Label>
                  <Input
                    id="org-logo"
                    value={editingProject.org?.logo || ""}
                    onChange={(e) => setEditingProject({
                      ...editingProject, 
                      org: {...editingProject.org, logo: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProject(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveProject}>
                  {isAddingNew ? "Add Project" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
