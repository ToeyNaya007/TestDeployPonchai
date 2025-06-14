import { Popover, Tab, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useEffect, useState } from "react";
import { useOptions } from "containers/OptionsContext";

interface LangDropdownProps {
  panelClassName?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const LangDropdown: FC<LangDropdownProps> = ({ panelClassName = "" }) => {
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('siteurl') || ''; // ตรวจสอบให้ basePath มีค่าเสมอ
  const initialLanguages = [
    {
      id: "English",
      name: "English",
      description: "US",
      href: "##",
      active: false,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/us.svg`
    },
    {
      id: "Thai",
      name: "Thai",
      description: "TH",
      href: "##",
      active: true,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/th.svg`
    },
    {
      id: "Laos",
      name: "ພາສາລາວ",
      description: "LA",
      href: "##",
      active: false,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/la.svg`
    },
    {
      id: "Camlodia",
      name: "ភាសាខ្មែរ",
      description: "KH",
      href: "##",
      active: false,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/kh.svg`
    },
    {
      id: "Chaina",
      name: "中国人",
      description: "CN",
      href: "##",
      active: false,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/cn.svg`
    },
  ];

  const [headerLanguage, setHeaderLanguage] = useState(initialLanguages);

  useEffect(() => {
    const updatedLanguages = initialLanguages.map(lang => ({
      ...lang,
      flagPath: `${basePath}system-admin/assets/fonts/flag-icon/${lang.description.toLowerCase()}.svg`
    }));
    setHeaderLanguage(updatedLanguages);
  }, [basePath]);

  const handleLanguageChange = (id: string, close: () => void) => {
    setHeaderLanguage((prevLanguages) =>
      prevLanguages.map((lang) => ({
        ...lang,
        active: lang.id === id,
      }))
    );
    close();
  };


  const renderLang = (close: () => void) => {
    return (
      <div className="grid gap-8">
        {headerLanguage.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={() => handleLanguageChange(item.id, close)}
            className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${item.active ? "bg-gray-200 dark:bg-gray-700" : "opacity-80"
              }`}
          >
            <div className="flex items-center">
              <img className="w-6 h-4" src={item.flagPath} alt={item.name} onError={() => console.log("Image error:", item.flagPath)} />
              <p className="text-sm font-medium ml-2">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">({item.description})
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const activeLanguage = headerLanguage.find(lang => lang.active);
  return (
    <div className="LangDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-80"}
             group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <GlobeAltIcon className="w-[20px] h-[20px] opacity-80 hidden md:block" />
              {activeLanguage && (
                <div className="flex items-center ml-2">
                  <img className="w-6 h-4" src={activeLanguage.flagPath} alt={activeLanguage.name} />
                  <span className="ml-2 font-medium">{activeLanguage.description}</span>
                </div>
              )}
              <ChevronDownIcon
                className={`${open ? "-rotate-180" : "text-opacity-70"}
                  ml-1 h-4 w-4  group-hover:text-opacity-80 transition ease-in-out duration-150 hidden md:block`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute z-20 w-56 mt-3.5 right-0 ${panelClassName}`}
              >
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Tab.Group>
                    <Tab.Panels className="">
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
                        {renderLang(close)}
                      </Tab.Panel>
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default LangDropdown;
