import { supabase } from './supabase';

// Blogs
export async function getBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function saveBlog(blog: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('blogs')
    .upsert({
      ...blog,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteBlog(id: string) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Skills
export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function saveSkill(skill: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('skills')
    .upsert({
      ...skill,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Projects
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function saveProject(project: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('projects')
    .upsert({
      ...project,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Experiences
export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function saveExperience(experience: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('experiences')
    .upsert({
      ...experience,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Social Links
export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function saveSocialLink(link: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('social_links')
    .upsert({
      ...link,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Resumes
export async function getResumes() {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function saveResume(resume: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('resumes')
    .upsert({
      ...resume,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
}

export async function deleteResume(id: string) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
