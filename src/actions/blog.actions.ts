"use server"
import { BlogService } from "@/services/blog.services";
import { ICreateBlog } from "@/types/blog.type";

// Action to create a new blog
export async function createBlogAction(data: ICreateBlog) {
  return await BlogService.createBlog(data);
}

// Action to get all blogs
export async function getAllBlogsAction() {
  return await BlogService.getAllBlogs();
}

// Action to get a single blog by id
export async function getSingleBlogAction(id: string) {
  return await BlogService.getSingleBlog(id);
}

// Action to update a blog by id
export async function updateBlogAction(id: string, data: any) {
  return await BlogService.updateBlog(id, data);
}

// Action to delete a blog by id
export async function deleteBlogAction(id: string) {
  return await BlogService.deleteBlog(id);
}