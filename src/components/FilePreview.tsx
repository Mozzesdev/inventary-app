import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { File } from "../interfaces/files";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { useDropdown } from "../../hooks/DropdownProvider";

const FilePreview = ({
  file,
  options = [],
}: {
  file: File;
  options: { label: string; action: () => void }[];
}) => {
  const dropdownContext = useDropdown();
  const kb = (+file.size! / 1024).toFixed(1);
  const mb = (+kb / 1024).toFixed(1);

  return (
    <article className="rounded-lg p-3 flex flex-col bg-[#21262d] gap-1">
      <button
        className="ml-auto group relative"
        onClick={(e) => {
          dropdownContext?.openDropdown(e.target as HTMLElement, options, {
            align: "left",
          });
        }}
      >
        <EllipsisVerticalIcon
          width={20}
          className="group-hover:text-neutral-400"
        />
      </button>
      {file.type?.includes("image") ? (
        <img src={file.url} alt={file.name} className="w-[60px] h-[60px] rounded-md block mx-auto object-cover" />
      ) : (
        <DocumentIcon width={60} className="mx-auto pb-4" />
      )}
      <h3 className="text-center text-sm text-[#8d96a0] px-2 whitespace-nowrap overflow-hidden min-w-0 text-ellipsis mt-2">
        {file.name}
      </h3>
      <hr className="h-[1px] border-0 bg-[#626262] my-2" />
      <div>
        <small className="text-[#8d96a0]">
          {+kb > 1024 ? `${mb} MB` : `${kb} KB`}
        </small>
      </div>
    </article>
  );
};

export default FilePreview;
