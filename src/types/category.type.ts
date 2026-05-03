
// category create
export interface ICreateCategory {
  name: string;
  image: any; 
}

export interface IUpdateCategory {
  name?: string;
  image?: any; 
}



export type TGetCategory = {
  id:string,
  name: string
  image: string
  adminId:string
  createdAt:string
}
export type TResponseCategoryData<T = unknown> = TGetCategory & T;