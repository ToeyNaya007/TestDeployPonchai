import Button, { ButtonProps } from "shared/Button/Button";
import React from "react";

export interface ButtonToLineProps extends ButtonProps {}

const ButtonToLine: React.FC<ButtonToLineProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-90 dark:bg-[#06C755] hover:bg-slate-800 text-slate-50 dark:text-slate-50 shadow-xl bg-[#06C755] ${className}`}
      {...args}
    />
  );
};

export default ButtonToLine;
