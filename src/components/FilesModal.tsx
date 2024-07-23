import { File } from "../interfaces/files";
import Dialog from "./Dialog";
import FilePreview from "./FilePreview";
import noDataImg from "../assets/no-data.svg";
import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "./Spinner";

const FilesModal = ({ state, hide, options, add }: any) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <Dialog show={state.open} hide={hide} className="p-6">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0000004b]">
          <Spinner />
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl">Files:</h2>
          <small className="text-sm text-[#8d96a0] mt-1">
            Showing all files from{" "}
            <span className="text-[#4c5157] font-inter-bold">
              {state.data?.name ?? ""}.
            </span>
          </small>
        </div>
        <label
          htmlFor="new"
          className="flex gap-2 text-sm rounded-md bg-[#21262d] hover:bg-[#262c34] cursor-pointer px-3 py-1.5"
        >
          New
          <PlusCircleIcon className="w-5" />
          <input
            type="file"
            multiple
            id="new"
            hidden
            onChange={async (e) => {
              setLoading(true);
              await add(e.currentTarget.files, state.data.id);
              setLoading(false);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <hr className="my-4 h-[1px] bg-[#30363d] border-0" />
      {state.data?.files?.length ? (
        <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2 max-[420px]:grid-cols-1">
          {state.data.files.map((file: File) => (
            <FilePreview
              file={file}
              key={file.id}
              options={options(file)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col py-2">
          <img src={noDataImg} alt="" className="max-w-32" />
          <span className="text-neutral-400 text-sm mt-1.5">
            No data available
          </span>
        </div>
      )}
    </Dialog>
  );
};

export default FilesModal;
