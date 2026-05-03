import { getCategory } from "@/actions/category.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import CategoryTable from "@/components/module/category/categorytable";
import { TResponseCategoryData } from "@/types/category.type";
import { TPagination } from "@/types/event.types";


const CreateCategory = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search = await searchParams;
  let categories;

  try {
    categories = await getCategory(search);
  } catch (error) {
    return (
      <ErrorFallback
        title="Unable to Retrieve Categories"
        message="Sorry, we encountered a problem while fetching the category list. Please refresh the page or try again later. If the issue persists, contact support."
      />
    );
  }

  if (!categories || !categories.success || !categories.data) {
    return (
      <ErrorFallback
        title="No Categories Found"
        message="No categories could be loaded at this moment. Please check again later or contact the administrator if this issue continues."
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Unexpected Error Loading Categories"
          message="Something went wrong while displaying the categories. Please try again, and if the problem persists, reach out to support."
        />
      }
    >
      <div className="">
        <CategoryTable
          pagination={categories.pagination as TPagination}
          category={categories.data as TResponseCategoryData[]}
        />
      </div>
    </ErrorBoundary>
  );
};

export default CreateCategory;
