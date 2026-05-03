import { singlecategory } from "@/actions/category.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import Singlecategory from "@/components/module/category/singlecategory";
import NotFoundItem from "@/components/NotFoundItem";
import { TResponseCategoryData } from "@/types/category.type";


const SingleCategoryPage = async({params}:{params:Promise<{id:string}>}) => {
    const {id}=await params
    const categorybyId=await singlecategory(id)
    
    return (
      <div className="mt-14 sm:mt-20 lg:mt-24">
        <title>Category Details</title>
        <ErrorBoundary fallback={<ErrorFallback message="fetch failed to single category" title="Category Error" />}>
          {(!categorybyId.success || !categorybyId.data || categorybyId.error) ? (
         <NotFoundItem content="Category not found or could not be loaded."   />
     
          ) : (
            <div className="">
              <Singlecategory category={categorybyId.data.data as TResponseCategoryData}/>
            </div>
          )}
        </ErrorBoundary>
      </div>
 
 
    );
}

export default SingleCategoryPage
