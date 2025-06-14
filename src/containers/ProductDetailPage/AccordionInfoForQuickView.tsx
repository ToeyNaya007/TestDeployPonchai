import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface Props {
  panelClassName?: string;
  data: { name: string; content: string }[]; // กำหนดประเภทข้อมูล
}

const AccordionInfoForQuickView: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6",
  data, // รับข้อมูลนี้
}) => {
  return (
    <div className="w-full rounded-2xl space-y-2.5">
      {data.map((item, index) => (
        <Disclosure key={index} defaultOpen={index < 1}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75">
                <span>{item.name}</span>
                {!open ? (
                  <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                ) : (
                  <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </Disclosure.Button>
              <Disclosure.Panel
                className={panelClassName}
                as="div"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default AccordionInfoForQuickView;
