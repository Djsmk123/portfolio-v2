"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  RefreshCw,
  Search
} from "lucide-react";
import { postType } from "@/app/data/mock";

interface BlogsManagementProps {
  onDataChange: () => void;
}

export default function BlogsManagement({ onDataChange }: BlogsManagementProps) {
  const [blogs, setBlogs] = useState<postType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDevToOnly, setShowDevToOnly] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingBlog, setEditingBlog] = useState<postType | null>(null);

  // Load blogs from localStorage on component mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem("admin-blogs");
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      // Load from mock data initially
      import("@/app/data/mock").then(({ posts }) => setBlogs(posts));
    }
  }, []);

  // Save blogs to localStorage whenever blogs change
  useEffect(() => {
    localStorage.setItem("admin-blogs", JSON.stringify(blogs));
    onDataChange();
  }, [blogs, onDataChange]);

  const fetchDevToBlogs = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual Dev.to username
      const username = "your-devto-username";
      const response = await fetch(`https://dev.to/api/articles?username=${username}`);
      const devToBlogs = await response.json();
      
      // Convert Dev.to format to our postType format
      const convertedBlogs = devToBlogs.map((article: {
        slug: string;
        title: string;
        description: string;
        published_at: string;
        tag_list: string[];
        url: string;
        cover_image: string;
        social_image: string;
        public_reactions_count: number;
      }) => ({
        slug: article.slug,
        title: article.title,
        description: article.description,
        date: article.published_at,
        tags: article.tag_list || [],
        link: article.url,
        image: article.cover_image || article.social_image,
        featuredArticle: false,
        likes: article.public_reactions_count,
        featuredOnGoogleDevLibrary: false,
        source: "dev.to" as const
      }));

      setBlogs(prev => [...prev, ...convertedBlogs]);
    } catch (error) {
      console.error("Error fetching Dev.to blogs:", error);
      alert("Error fetching blogs from Dev.to. Please check your username.");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewBlog = () => {
    const newBlog: postType = {
      slug: "",
      title: "",
      description: "",
      date: new Date().toISOString(),
      tags: [],
      link: "",
      featuredArticle: false,
      featuredOnGoogleDevLibrary: false
    };
    setEditingBlog(newBlog);
    setIsAddingNew(true);
  };

  const editBlog = (blog: postType) => {
    setEditingBlog({ ...blog });
    setIsAddingNew(false);
  };

  const deleteBlog = (slug: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(prev => prev.filter(blog => blog.slug !== slug));
    }
  };

  const saveBlog = () => {
    if (!editingBlog) return;

    if (isAddingNew) {
      setBlogs(prev => [...prev, editingBlog]);
    } else {
      setBlogs(prev => prev.map(blog => 
        blog.slug === editingBlog.slug ? editingBlog : blog
      ));
    }

    setEditingBlog(null);
    setIsAddingNew(false);
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !showDevToOnly || (blog as { source?: string }).source === "dev.to";
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="devto-only"
              checked={showDevToOnly}
              onCheckedChange={setShowDevToOnly}
            />
            <Label htmlFor="devto-only">Dev.to only</Label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchDevToBlogs}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Fetch from Dev.to
          </Button>
          <Button onClick={addNewBlog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Blog
          </Button>
        </div>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
                    {(blog as { source?: string }).source === "dev.to" && (
                      <Badge variant="secondary">Dev.to</Badge>
                    )}
                    {blog.featuredArticle && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {blog.featuredOnGoogleDevLibrary && (
                      <Badge variant="outline">Google Dev</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {blog.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <span>{blog.likes || 0} likes</span>
                    <div className="flex gap-1">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(blog.link, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editBlog(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBlog(blog.slug)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Blog" : "Edit Blog"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({...editingBlog, slug: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingBlog.description}
                  onChange={(e) => setEditingBlog({...editingBlog, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={editingBlog.link}
                    onChange={(e) => setEditingBlog({...editingBlog, link: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={editingBlog.image || ""}
                    onChange={(e) => setEditingBlog({...editingBlog, image: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={editingBlog.tags.join(", ")}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                  })}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={editingBlog.featuredArticle}
                    onCheckedChange={(checked) => setEditingBlog({...editingBlog, featuredArticle: checked})}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="google-dev"
                    checked={editingBlog.featuredOnGoogleDevLibrary}
                    onCheckedChange={(checked) => setEditingBlog({...editingBlog, featuredOnGoogleDevLibrary: checked})}
                  />
                  <Label htmlFor="google-dev">Featured on Google Dev Library</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingBlog(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveBlog}>
                  {isAddingNew ? "Add Blog" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
