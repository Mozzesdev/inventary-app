import { File } from "../interfaces/files";
import Dialog from "./Dialog";
import FilePreview from "./FilePreview";

const FilesModal = ({ state, hide }: any) => {
  const setOptions = (file) => [
    {
      label: "Download",
      action: () => {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
    },
  ];

  return (
    <Dialog show={state.open} hide={hide} className="p-6">
      <h2 className="text-xl">Files:</h2>
      <small className="text-sm text-[#8d96a0] mt-1">
        Showing all files from{" "}
        <span className="text-[#4c5157] font-inter-bold">
          {state.data?.name ?? ""}.
        </span>
      </small>
      <hr className="my-4 h-[1px] bg-[#30363d] border-0" />
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2 max-[420px]:grid-cols-1">
        {state.data?.files?.length ? (
          state.data.files.map((file: File) => (
            <FilePreview file={file} key={file.id} options={setOptions(file)} />
          ))
        ) : (
          <span>No data provided</span>
        )}
      </div>
    </Dialog>
  );
};

export default FilesModal;
