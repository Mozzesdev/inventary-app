import Button from "./Button";
import Dialog from "./Dialog";

interface Props {
  title: string;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
}: Props) => {
  if (!open) {
    return <></>;
  }
  return (
    <Dialog show={open} hide={onClose} className="flex flex-col items-center p-4 max-w-[500px]">
      <h2 className="text-base">{title}</h2>
      <div className="py-3">{children}</div>
      <div className="flex justify-center items-center gap-2">
        <div>
          <Button
            action={() => onClose()}
            className="bg-red-500"
          >
            No
          </Button>
        </div>
        <div>
          <Button
            action={() => {
              onClose();
              onConfirm();
            }}
            className="bg-green-500"
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
