import Button, { ButtonProps } from "shared/Button/Button";
import React from "react";

export interface ButtonSearchProps extends ButtonProps {}

const ButtonSearch: React.FC<ButtonSearchProps> = ({
  className = "sm:h-9 lg:h-8 left-2",
  ...args
}) => {
  return (
    <Button
      type="submit"
      className={`rounded-xl hover:bg-slate-300 text-slate-950 dark:text-slate-50 dark:bg-neutral-900 shadow-md bg-slate-50 ${className}`}
      {...args}
    />
  );
};

export default ButtonSearch;
