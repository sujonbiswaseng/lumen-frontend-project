'use server'

import { CategoriesService, Icategory } from "@/services/category.service";
import { ICreateCategory } from "@/types/category.type";

export const categoryCreate = async (data:ICreateCategory) => {
  try {
    const res = await CategoriesService.createCategory(data);
    return res;
  } catch (error) {
    return null; 
  }
}

export const getCategory = async (params?:any) => {
  try {
    const res = await CategoriesService.getcategory(params);
    return res;
  } catch (error) {
    return null;
  }
}

export const updatecategory = async (id:string,data:Icategory) => {
    const res = await CategoriesService.updateCategory(id,data);
    return res;
}

export const deleteCategory = async (id:string) => {
    const res = await CategoriesService.deleteCategory(id);
    return res;
 
}

export const singlecategory = async (id:string) => {
    const res = await CategoriesService.singlecategory(id);
    return res;
 
}