"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Code,
  Palette,
  Database,
  Cloud,
  Smartphone
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: number;
  icon?: string;
  color?: string;
}

interface SkillsManagementProps {
  onDataChange: () => void;
}

const SKILL_CATEGORIES = [
  { value: "frontend", label: "Frontend", icon: Code },
  { value: "backend", label: "Backend", icon: Database },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "design", label: "Design", icon: Palette },
  { value: "cloud", label: "Cloud & DevOps", icon: Cloud },
  { value: "other", label: "Other", icon: Code }
];

const SKILL_LEVELS = [
  { value: "Beginner", label: "Beginner", color: "bg-red-100 text-red-800" },
  { value: "Intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
  { value: "Advanced", label: "Advanced", color: "bg-blue-100 text-blue-800" },
  { value: "Expert", label: "Expert", color: "bg-green-100 text-green-800" }
];

export default function SkillsManagement({ onDataChange }: SkillsManagementProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Load skills from localStorage on component mount
  useEffect(() => {
    const savedSkills = localStorage.getItem("admin-skills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      // Load default skills
      const defaultSkills: Skill[] = [
        { id: "1", name: "React", category: "frontend", level: "Expert", yearsOfExperience: 4, color: "#61DAFB" },
        { id: "2", name: "TypeScript", category: "frontend", level: "Advanced", yearsOfExperience: 3, color: "#3178C6" },
        { id: "3", name: "Flutter", category: "mobile", level: "Expert", yearsOfExperience: 5, color: "#02569B" },
        { id: "4", name: "Node.js", category: "backend", level: "Advanced", yearsOfExperience: 3, color: "#339933" },
        { id: "5", name: "AWS", category: "cloud", level: "Intermediate", yearsOfExperience: 2, color: "#FF9900" }
      ];
      setSkills(defaultSkills);
    }
  }, []);

  // Save skills to localStorage whenever skills change
  useEffect(() => {
    localStorage.setItem("admin-skills", JSON.stringify(skills));
    onDataChange();
  }, [skills, onDataChange]);

  const addNewSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category: "frontend",
      level: "Beginner",
      yearsOfExperience: 0
    };
    setEditingSkill(newSkill);
    setIsAddingNew(true);
  };

  const editSkill = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsAddingNew(false);
  };

  const deleteSkill = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setSkills(prev => prev.filter(skill => skill.id !== id));
    }
  };

  const saveSkill = () => {
    if (!editingSkill) return;

    if (isAddingNew) {
      setSkills(prev => [...prev, editingSkill]);
    } else {
      setSkills(prev => prev.map(skill => 
        skill.id === editingSkill.id ? editingSkill : skill
      ));
    }

    setEditingSkill(null);
    setIsAddingNew(false);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = SKILL_CATEGORIES.find(cat => cat.value === category);
    return categoryData?.icon || Code;
  };

  const getLevelColor = (level: string) => {
    const levelData = SKILL_LEVELS.find(l => l.value === level);
    return levelData?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SKILL_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addNewSkill}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const CategoryIcon = getCategoryIcon(skill.category);
          return (
            <Card key={skill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: skill.color + "20" }}
                    >
                      <CategoryIcon 
                        className="h-5 w-5" 
                        style={{ color: skill.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {skill.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editSkill(skill)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <Badge className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="text-sm font-medium">
                      {skill.yearsOfExperience} years
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isAddingNew ? "Add New Skill" : "Edit Skill"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingSkill.category}
                  onValueChange={(value) => setEditingSkill({...editingSkill, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <Select
                  value={editingSkill.level}
                  onValueChange={(value: "Beginner" | "Intermediate" | "Advanced" | "Expert") => setEditingSkill({...editingSkill, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={editingSkill.yearsOfExperience}
                  onChange={(e) => setEditingSkill({...editingSkill, yearsOfExperience: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="color">Color (hex)</Label>
                <Input
                  id="color"
                  value={editingSkill.color || ""}
                  onChange={(e) => setEditingSkill({...editingSkill, color: e.target.value})}
                  placeholder="#000000"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSkill(null);
                    setIsAddingNew(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveSkill}>
                  {isAddingNew ? "Add Skill" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
