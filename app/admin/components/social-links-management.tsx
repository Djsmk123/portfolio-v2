"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon
} from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

interface SocialLinksManagementProps {
  onDataChange: () => void;
}

const SOCIAL_PLATFORMS = [
  { 
    value: "github", 
    label: "GitHub", 
    icon: Github, 
    placeholder: "https://github.com/username",
    color: "bg-gray-900 text-white"
  },
  { 
    value: "linkedin", 
    label: "LinkedIn", 
    icon: Linkedin, 
    placeholder: "https://linkedin.com/in/username",
    color: "bg-blue-600 text-white"
  },
  { 
    value: "twitter", 
    label: "Twitter", 
    icon: Twitter, 
    placeholder: "https://twitter.com/username",
    color: "bg-sky-500 text-white"
  },
  { 
    value: "instagram", 
    label: "Instagram", 
    icon: Instagram, 
    placeholder: "https://instagram.com/username",
    color: "bg-pink-500 text-white"
  },
  { 
    value: "youtube", 
    label: "YouTube", 
    icon: Youtube, 
    placeholder: "https://youtube.com/@username",
    color: "bg-red-600 text-white"
  },
  { 
    value: "website", 
    label: "Website", 
    icon: Globe, 
    placeholder: "https://yourwebsite.com",
    color: "bg-blue-500 text-white"
  },
  { 
    value: "email", 
    label: "Email", 
    icon: Mail, 
    placeholder: "mailto:your@email.com",
    color: "bg-green-600 text-white"
  },
  { 
    value: "phone", 
    label: "Phone", 
    icon: Phone, 
    placeholder: "tel:+1234567890",
    color: "bg-gray-600 text-white"
  },
  { 
    value: "location", 
    label: "Location", 
    icon: MapPin, 
    placeholder: "https://maps.google.com/...",
    color: "bg-red-500 text-white"
  },
  { 
    value: "custom", 
    label: "Custom", 
    icon: LinkIcon, 
    placeholder: "https://example.com",
    color: "bg-gray-500 text-white"
  }
];

export default function SocialLinksManagement({ onDataChange }: SocialLinksManagementProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  // Load social links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem("admin-social-links");
    if (savedLinks) {
      setSocialLinks(JSON.parse(savedLinks));
    } else {
      // Load default social links
      const defaultLinks: SocialLink[] = [
        {
          id: "1",
          platform: "github",
          url: "https://github.com/username",
          label: "GitHub",
          icon: "github",
          isVisible: true,
          order: 1
        },
        {
          id: "2",
          platform: "linkedin",
          url: "https://linkedin.com/in/username",
          label: "LinkedIn",
          icon: "linkedin",
          isVisible: true,
          order: 2
        },
        {
          id: "3",
          platform: "email",
          url: "mailto:your@email.com",
          label: "Email",
          icon: "email",
          isVisible: true,
          order: 3
        }
      ];
      setSocialLinks(defaultLinks);
    }
  }, []);

  // Save social links to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem("admin-social-links", JSON.stringify(socialLinks));
    onDataChange();
  }, [socialLinks, onDataChange]);

  const addNewLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "custom",
      url: "",
      label: "",
      icon: "custom",
      isVisible: true,
      order: socialLinks.length + 1
    };
    setEditingLink(newLink);
    setIsAddingNew(true);
  };

  const editLink = (link: SocialLink) => {
    setEditingLink({ ...link });
    setIsAddingNew(false);
  };

  const deleteLink = (id: string) => {
    if (confirm("Are you sure you want to delete this social link?")) {
      setSocialLinks(prev => prev.filter(link => link.id !== id));
    }
  };

  const saveLink = () => {
    if (!editingLink) return;

    if (isAddingNew) {
      setSocialLinks(prev => [...prev, editingLink]);
    } else {
      setSocialLinks(prev => prev.map(link => 
        link.id === editingLink.id ? editingLink : link
      ));
    }

    setEditingLink(null);
    setIsAddingNew(false);
  };

  const toggleVisibility = (id: string) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    ));
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    setSocialLinks(prev => {
      const links = [...prev];
      const index = links.findIndex(link => link.id === id);
      
      if (direction === 'up' && index > 0) {
        [links[index], links[index - 1]] = [links[index - 1], links[index]];
      } else if (direction === 'down' && index < links.length - 1) {
        [links[index], links[index + 1]] = [links[index + 1], links[index]];
      }
      
      return links.map((link, i) => ({ ...link, order: i + 1 }));
    });
  };

  const getPlatformData = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform) || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
  };

  const visibleLinks = socialLinks.filter(link => link.isVisible).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {visibleLinks.map((link) => {
              const platformData = getPlatformData(link.platform);
              const IconComponent = platformData.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${platformData.color} hover:opacity-80`}
                >
                  <IconComponent className="h-4 w-4" />
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-end">
        <Button onClick={addNewLink}>
          <Plus className="h-4 w-4 mr-2" />
          Add Social Link
        </Button>
      </div>

      {/* Social Links List */}
      <div className="space-y-3">
        {socialLinks
          .sort((a, b) => a.order - b.order)
          .map((link) => {
            const platformData = getPlatformData(link.platform);
            const IconComponent = platformData.icon;
            return (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platformData.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{link.label}</h4>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.isVisible}
                          onCheckedChange={() => toggleVisibility(link.id)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {link.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveLink(link.id, 'up')}
                          disabled={link.order === 1}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveLink(link.id, 'down')}
                          disabled={link.order === socialLinks.length}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editLink(link)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Edit/Add Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add Social Link" : "Edit Social Link"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  value={editingLink.platform}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const platformData = getPlatformData(platform);
                    setEditingLink({
                      ...editingLink,
                      platform,
                      label: platformData.label,
                      icon: platform
                    });
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={editingLink.label}
                  onChange={(e) => setEditingLink({...editingLink, label: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                  placeholder={getPlatformData(editingLink.platform).placeholder}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={editingLink.isVisible}
                  onCheckedChange={(checked) => setEditingLink({...editingLink, isVisible: checked})}
                />
                <Label htmlFor="visible">Visible on portfolio</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingLink(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveLink}>
                  {isAddingNew ? "Add Link" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
