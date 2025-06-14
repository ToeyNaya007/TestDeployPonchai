import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useOptions } from "containers/OptionsContext";

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  const { getOptionByName } = useOptions();
  
  // ดึงค่าจาก OptionsContext
  const basePathlogoLight = getOptionByName('systemLogoPathIcon');
  const basePathlogoDark = getOptionByName('systemLogoPathDark');
  const basePath = getOptionByName('basePathAdmin');

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
  }, []);

  // ถ้า API ส่งพาทที่ไม่ถูกต้อง เราจะเปลี่ยนพาทให้ถูกต้อง
  const correctPath = (logoPath: string | null) => {
    if (logoPath && !logoPath.includes('assets/images/logo/')) {
      return `${basePath}/assets/images/logo/${logoPath.split('/').pop()}`;
    }
    return `${basePath}${logoPath}`;
  };

  return (
    <Link
      to="/"
      className={`inline-block mr-16 md:mr-0 text-slate-600 ${className}`}
    >
      {basePathlogoLight ? (
        <img
          className={`block max-h-8 sm:max-h-10 ${basePathlogoDark ? "dark:hidden" : ""}`}
          src={correctPath(basePathlogoLight)} // ใช้ correctPath เพื่อจัดการพาท
          alt="Logo"
        />
      ) : (
        "Loading Logo..."
      )}
      {basePathlogoDark && (
        <img
          className="hidden max-h-8 sm:max-h-10 dark:block"
          src={correctPath(basePathlogoDark)} // ใช้ correctPath เพื่อจัดการพาท
          alt="Logo-Dark"
        />
      )}
    </Link>
  );
};

export default Logo;
