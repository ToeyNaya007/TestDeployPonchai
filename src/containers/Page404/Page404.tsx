import ButtonPrimary from "shared/Button/ButtonPrimary";
import React from "react";
import { Helmet } from "react-helmet-async";
import NcImage from "shared/NcImage/NcImage";
import I404Png from "images/404.png";

const Page404: React.FC = () => (
  <div className="nc-Page404">
    <div className="container relative pt-5 pb-5 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <NcImage src={I404Png} />
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.{" "}
        </span>
        <div className="pt-8">
          <ButtonPrimary href="/">
          <i className="las la-arrow-left mr-2"></i>
          กลับไปหน้าหลัก</ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;
