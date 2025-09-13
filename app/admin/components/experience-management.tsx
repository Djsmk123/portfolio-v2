"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import { experienceType, ExperienceType } from "@/app/data/mock";

interface ExperienceManagementProps {
  onDataChange: () => void;
}

const EXPERIENCE_TYPES = [
  { value: ExperienceType.FullTime, label: "Full-time", color: "bg-blue-100 text-blue-800" },
  { value: ExperienceType.Internship, label: "Internship", color: "bg-green-100 text-green-800" },
  { value: ExperienceType.Contract, label: "Contract", color: "bg-purple-100 text-purple-800" }
];

export default function ExperienceManagement({ onDataChange }: ExperienceManagementProps) {
  const [experiences, setExperiences] = useState<experienceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExperience, setEditingExperience] = useState<experienceType | null>(null);

  // Load experiences from localStorage on component mount
  useEffect(() => {
    const savedExperiences = localStorage.getItem("admin-experiences");
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences));
    } else {
      // Load from mock data initially
      import("@/app/data/mock").then(({ experience }) => setExperiences(experience));
    }
  }, []);

  // Save experiences to localStorage whenever experiences change
  useEffect(() => {
    localStorage.setItem("admin-experiences", JSON.stringify(experiences));
    onDataChange();
  }, [experiences, onDataChange]);

  const addNewExperience = () => {
    const newExperience: experienceType = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      date: "",
      description: "",
      type: ExperienceType.FullTime
    };
    setEditingExperience(newExperience);
    setIsAddingNew(true);
  };

  const editExperience = (experience: experienceType) => {
    setEditingExperience({ ...experience });
    setIsAddingNew(false);
  };

  const deleteExperience = (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const saveExperience = () => {
    if (!editingExperience) return;

    if (isAddingNew) {
      setExperiences(prev => [...prev, editingExperience]);
    } else {
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExperience.id ? editingExperience : exp
      ));
    }

    setEditingExperience(null);
    setIsAddingNew(false);
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || exp.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: ExperienceType) => {
    const typeData = EXPERIENCE_TYPES.find(t => t.value === type);
    return typeData?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {EXPERIENCE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addNewExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Experience
        </Button>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {filteredExperiences.map((experience) => (
          <Card key={experience.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{experience.title}</h3>
                      <p className="text-muted-foreground">{experience.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {experience.date}
                    </div>
                    <Badge className={getTypeColor(experience.type)}>
                      {experience.type}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {experience.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editExperience(experience)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExperience(experience.id)}
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
      {editingExperience && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Experience" : "Edit Experience"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={editingExperience.title}
                  onChange={(e) => setEditingExperience({...editingExperience, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editingExperience.company}
                  onChange={(e) => setEditingExperience({...editingExperience, company: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingExperience.location}
                    onChange={(e) => setEditingExperience({...editingExperience, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={editingExperience.date}
                    onChange={(e) => setEditingExperience({...editingExperience, date: e.target.value})}
                    placeholder="e.g., Jan 2023 - Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editingExperience.type}
                  onValueChange={(value: ExperienceType) => setEditingExperience({...editingExperience, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingExperience.description}
                  onChange={(e) => setEditingExperience({...editingExperience, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingExperience(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveExperience}>
                  {isAddingNew ? "Add Experience" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
