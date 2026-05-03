import { singlecategory } from "@/actions/category.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import Singlecategory from "@/components/module/category/singlecategory";
import NotFoundItem from "@/components/NotFoundItem";
import { TResponseCategoryData } from "@/types/category.type";
import { IBaseEvent } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";


const SingleCategoryPage = async({
  searchParams,
  params
}: {
  searchParams:Promise<{ [key: string]: string | string[] | undefined }>;
  params:Promise<{id:string}>
}) => {
  const search = await searchParams;
    const {id}=await params
    const categorybyId=await singlecategory(id,search)
    return (
      <div className="mt-14 sm:mt-20 lg:mt-24">
        <title>Category Details</title>
        <ErrorBoundary fallback={<ErrorFallback message="fetch failed to single category" title="Categorsy Error" />}>
          {(!categorybyId.success || !categorybyId.data || categorybyId.error) ? (
         <NotFoundItem content="Category not found or could not be loaded."   />
     
          ) : (
            <div className="">
              <Singlecategory
              pagination={categorybyId.data}
              events={categorybyId.data?.data?.eventdata as IBaseEvent[]}
               category={categorybyId.data?.data?.result as TResponseCategoryData<{event:IBaseEvent[],user:IBaseUser}>}/>
            </div>
          )}
        </ErrorBoundary>
      </div>
 
 
    );
}

export default SingleCategoryPage
