'use client'
import { useState } from "react";
import { toast } from "react-toastify";
import { FieldError } from "../../ui/field";

import { Input } from "@/components/ui/input";
import { IUpdateCategory } from "@/types/category.type";
import { UpdateCategory } from "@/validations/category.validation";
import { updatecategory } from "@/actions/category.actions";

const Categoryupdate = ({ categoryid }: { categoryid: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [categorydata, setcategorydata] = useState<IUpdateCategory>({});
  const parsedata = UpdateCategory.safeParse(categorydata);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   const toastId= toast.loading("category updateting......")
    const data = await updatecategory(categoryid, parsedata.data!)
    if (data.error || !data.success) {
      toast.dismiss(toastId)
      toast.error(data?.message || "Failed to update category");
      return
    } else {
      toast.dismiss(toastId)
      toast.success("category updated successfully");
      setcategorydata({})
    }
  };
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 to-blue-50 p-6">
      <form onSubmit={handleSubmit} className={`w-full max-w-4xl shadow-2xl rounded-3xl p-8 md:p-12 space-y-6`}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Update category
        </h2>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="mealName" className="font-medium ml-2 ">category name</label>
            <input
              type="text"
              placeholder="please enter your category name"
              onChange={(e) => setcategorydata({ ...categorydata, name: e.target.value })}
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />

          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="mealName" className="font-medium ml-2 ">image</label>
            <input
              type="text"
              placeholder="please enter your image url (cloudinary,pexels)"
              
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />

<Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 1 * 1024 * 1024) {
                  toast.error("Image size must be less than 1MB!");
                  e.target.value = "";
                  setcategorydata((prev: IUpdateCategory) => ({
                    ...prev,
                    image: undefined,
                  }));
                  setPreview(null);
                  return;
                }
                setcategorydata((prev: IUpdateCategory) => ({
                  ...prev,
                  image: file,
                }));
           
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
            {preview && (
                    <img
                      src={preview}
                      className="h-32 rounded-md object-cover mt-2"
                    />
                  )}

            {!parsedata.success && parsedata.error && (
              <FieldError errors={parsedata.error.issues} />
            )}
          </div>
        </div>




        <button
          type="submit"
          className={`bg-black text-white p-2 w-full rounded-md shadow-md cursor-pointer`}
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default Categoryupdate
