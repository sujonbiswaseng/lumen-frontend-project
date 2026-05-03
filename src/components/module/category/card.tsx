'use client'
import { TGetCategory } from "@/types/category.type";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FoodCategories({ categories }: { categories: TGetCategory[] }) {
  const router = useRouter();

  return (
    <section className="w-full bg-gray-50 py-10 sm:py-12 px-4 md:py-14 lg:py-16">
      <div
        className="w-full mx-auto max-w-[98vw] sm:max-w-[760px] md:max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1480px] px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-0"
      >
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-[1.8rem] xs:text-3xl sm:text-4xl md:text-[2.5rem] lg:text-4xl xl:text-[2.6rem] font-bold text-gray-800 leading-tight">
            Explore Our Categories
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 max-w-xl sm:max-w-2xl mx-auto text-sm md:text-base">
            Discover the best restaurants and dishes carefully selected to satisfy your cravings.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-6 
            gap-3 
            xs:gap-4 
            md:gap-6 
            xl:gap-8"
        >
          {categories.map((category, index: number) => (
            <div
              onClick={() => router.push(`/category/${category.id}`)}
              key={index}
              className="
                group 
                bg-white 
                rounded-2xl 
                shadow-xs 
                hover:shadow-xl 
                transition 
                duration-300 
                overflow-hidden 
                cursor-pointer 
                flex flex-col
                hover:-translate-y-1
                "
              style={{
                minHeight: 0,
              }}
            >
              {/* Image */}
              <div className="relative w-full h-[95px] xs:h-[110px] sm:h-[138px] md:h-[145px] lg:h-[172px] xl:h-[180px] 2xl:h-[190px]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                  sizes="
                    (max-width: 375px) 93vw,
                    (max-width: 640px) 43vw,
                    (max-width: 768px) 29vw,
                    (max-width: 1024px) 22vw,
                    (max-width: 1480px) 15vw,
                    240px
                  "
                  priority={index < 6}
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center p-3 sm:p-4 text-center">
                <h3 className="text-[13px] xs:text-sm sm:text-base md:text-[17px] font-semibold text-gray-800 group-hover:text-orange-600 transition">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}