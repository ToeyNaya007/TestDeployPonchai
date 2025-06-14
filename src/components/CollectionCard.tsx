import { StarIcon } from "@heroicons/react/24/solid";
import { productImgs } from "contains/fakeData";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import NcImage from "shared/NcImage/NcImage";
import Prices from "./Prices";

export interface CollectionCard2Props {
  className?: string;
  imgs?: string[];
  name?: string;
  price?: number;
  description?: string;
  total_sold?: number;
  cID?: number;
  slug?: string[];
  pID?: string[];
}

const CollectionCard2: FC<CollectionCard2Props> = ({
  className,
  imgs = [],
  name = "Product Name",
  description = "Product Description",
  price,
  total_sold,
  cID,
  slug = [],
  pID = [],
}) => {
  return (
    <div className={`CollectionCard2 group relative ${className}`}>
      <div className="relative flex flex-col">
        <Link to={`/p/${slug[0]}/${pID[0]}`}>
          <NcImage
            containerClassName="aspect-w-8 aspect-h-5 bg-neutral-100 rounded-2xl overflow-hidden"
            className="object-contain w-full h-full rounded-2xl hover:scale-[1.02] transition-transform duration-300"
            src={imgs[0]}
          />
        </Link>
        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
          <Link to={`/p/${slug[1]}/${pID[1]}`}>
            <NcImage
              containerClassName="w-full h-24 sm:h-28"
              className="object-cover w-full h-full rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              src={imgs[1]}
            />
          </Link>
          <Link to={`/p/${slug[2]}/${pID[2]}`}>
            <NcImage
              containerClassName="w-full h-24 sm:h-28"
              className="object-cover w-full h-full rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              src={imgs[2]}
            />
          </Link>
          <Link to={`/p/${slug[3]}/${pID[3]}`}>
            <NcImage
              containerClassName="w-full h-24 sm:h-28"
              className="object-cover w-full h-full rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              src={imgs[3]}
            />
          </Link>
        </div>
      </div>

      <div className="relative mt-5 flex justify-between">
        {/* TITLE */}
        <div className="flex-1">
          <Link to={`/category/${cID}`}>
            <h2 className="font-semibold text-lg sm:text-xl hover:underline">{name}</h2>
          </Link>
          {/* AUTHOR */}
          <div className="mt-3 flex items-center text-slate-500 dark:text-slate-400 cursor-default">
            <span className="text-sm ">
              <span className="line-clamp-1">{description}</span>
            </span>
            <span className="h-5 mx-1 sm:mx-2 border-l border-slate-200 dark:border-slate-700"></span>
            <StarIcon className="w-4 h-4 text-orange-400" />
            <span className="text-sm ml-1 ">
              <span className="line-clamp-1">ขายไปแล้ว {total_sold} ชิ้น</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard2;