import React, { useEffect, useRef, useState } from "react";
import Dropdown, { DropdownItem } from "../../../components/Dropdown";
import ConfirmDialog from "../../../components/ConfirmDialog";
import FilesModal from "../../../components/FilesModal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import {
  addDeviceFiles,
  defaultDevicesValues,
  deleteDevice,
  deleteDeviceFile,
  FetchDevices,
  getDevices,
  getDevicesColumns,
} from "../../../services/devices.services";
import DeviceModal from "./DeviceModal";
import { getLocations } from "../../../services/locations.services";
import { Options } from "../../../components/Select";
import { getSuppliers } from "../../../services/suppliers.services";
import { usePageContext } from "vike-react/usePageContext";
import MaintenanceModal from "./MaintenanceModal";
import { useAlert } from "../../../hooks/useAlert";
import { uploadFile } from "../../../services/files.services";
import axiosInstance from "../../../interceptor";

const Page = () => {
  const { urlParsed } = usePageContext();
  const [deviceModal, setDeviceModal] = useState(false);
  const [filesModal, setFilesModal] = useState({ data: null, open: false });
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ id: null, open: false });
  const [devices, setDevices] = useState<FetchDevices>();
  const [devicesColumns, setDevicesColumns] = useState(getDevicesColumns());
  const [locations, setLocations] = useState<Options[]>([]);
  const [suppliers, setSuppliers] = useState<Options[]>([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<any>(defaultDevicesValues);
  const [query, setQuery] = useState("");
  const debounceTimeout = useRef<any>(null);
  const [maintenanceModal, setMaintenanceModal] = useState({
    id: "",
    open: false,
  });
  const { addAlert } = useAlert();

  const fetchData = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await getDevices({ query, page });
      setDevices(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const items: any[] = getDevicesColumns().map(({ value, name }) => ({
    value: value[0],
    label: name,
    id: value[0],
  }));

  const handleGlobalFilter = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setQuery(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchData(value);
    }, 1000);
  };

  const closeModal = () => {
    setDeviceModal(false);
    setSelectedRow(defaultDevicesValues);
  };

  const openEditModal = (data: Location) => {
    setSelectedRow(data);
    setDeviceModal(true);
  };

  const deleteLocationRow = async (id: any) => {
    try {
      const { data } = await deleteDevice(id);
      if (data.success && location) {
        setQuery("");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmDialog({ id: null, open: false });
    }
  };

  const changeViewColumns = (e: DropdownItem | DropdownItem[] | null) => {
    const newState = devicesColumns.map((col) => ({
      ...col,
      show: (e as DropdownItem[]).some(({ id }) => id === col.value[0]),
    }));
    setDevicesColumns(newState);
  };

  useEffect(() => {
    fetchData();
    if (urlParsed.search["maintenance"]) {
      setMaintenanceModal({
        id: urlParsed.search["maintenance"],
        open: true,
      });
    }
  }, [page]);

  const getAllLocations = async () => {
    const { data } = await getLocations();
    const locationsOptions: Options[] = data.data.map((loc) => ({
      label: loc.name,
      value: loc.id as string,
    }));
    setLocations(locationsOptions);
  };

  const getAllSuppliers = async () => {
    const { data } = await getSuppliers();
    const suppliersOptions: Options[] = data.data.map((sup) => ({
      label: sup.name,
      value: sup.id as string,
    }));
    setSuppliers(suppliersOptions);
  };

  useEffect(() => {
    getAllLocations();
    getAllSuppliers();
  }, []);

  const openFilesModal = (data: any) => {
    setFilesModal({ data, open: true });
  };

  const tableOptions = (row) => {
    return [
      {
        label: "Edit",
        action: () => openEditModal(row),
      },
      {
        label: "Delete",
        action: () => setConfirmDialog({ id: row.id, open: true }),
      },
      {
        label: "Maintenance",
        action: () => setMaintenanceModal({ id: row.id, open: true }),
      },
      {
        label: "View files",
        action: () => openFilesModal(row),
      },
    ];
  };

  const filesOptions = (file) => [
    {
      label: "Download",
      action: async () => {
        try {
          const { data } = await axiosInstance.post(
            "/proxy/download/",
            {
              url: file.url,
            },
            { responseType: "blob" }
          );
          const url = window.URL.createObjectURL(new Blob([data]));
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error("Error downloading the image:", error);
        }
      },
    },
    {
      label: "Delete",
      action: async () => {
        try {
          const { data } = await deleteDeviceFile(file.id);
          const allDevices = await fetchData();
          const devi: any = allDevices?.data.find((dev) => dev.id === file.device_id);
          setFilesModal({
            data: devi,
            open: true,
          });
          addAlert({
            message: data.message,
            severity: "success",
            timeout: 5,
          });
        } catch (error: any) {
          console.log(error);
          addAlert({
            message: error.response.data.message,
            severity: "error",
            timeout: 5,
          });
        }
      },
    },
  ];

  const uploadFiles = async (files: File[]) => {
    if (!files?.length) {
      return;
    }
    const form = new FormData();

    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i]);
    }

    try {
      const { data } = await uploadFile(form);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const addNewFile = async (values: any, id: string) => {
    try {
      const files = await uploadFiles(values);
      const finalFiles = files.data.map((file: any) => ({
        ...file,
        device_id: id,
      }));
      const { data } = await addDeviceFiles(finalFiles);
      const allDevices = await fetchData();
      const devi: any = allDevices?.data.find((dev) => dev.id === id);
      setFilesModal({
        data: devi,
        open: true,
      });
      addAlert({
        message: data.message,
        severity: "success",
        timeout: 5,
      });
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    }
  };

  const closeFilesModal = () => {
    setFilesModal({ data: null, open: false });
  };

  return (
    <>
      <ConfirmDialog
        onClose={() => setConfirmDialog({ id: null, open: false })}
        open={confirmDialog.open}
        title="Are you sure to delete this item?"
        onConfirm={() =>
          confirmDialog.id && deleteLocationRow(confirmDialog.id)
        }
      />
      <DeviceModal
        deviceModal={deviceModal}
        closeModal={closeModal}
        fetchData={fetchData}
        data={selectedRow}
        locations={locations}
        suppliers={suppliers}
      />
      <FilesModal
        state={filesModal}
        hide={closeFilesModal}
        options={filesOptions}
        add={addNewFile}
      />
      <MaintenanceModal
        suppliers={suppliers}
        open={maintenanceModal.open}
        deviceId={maintenanceModal.id}
        closeModal={() => setMaintenanceModal({ id: "", open: false })}
      />
      <section className="px-10 max-sm:px-4 max-w-[1504px] mx-auto">
        <div className="relative min-w-0 border border-[#30363d] p-5 rounded-md">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
            <Dropdown
              type="multiple"
              label="Select columns to show"
              items={items}
              defaultSelected={items}
              onColumnChange={changeViewColumns}
            />
            <div className="inline-flex gap-4">
              <div className="w-[220px] relative flex items-center max-xl:w-[180px]">
                <input
                  onChange={handleGlobalFilter}
                  id="search"
                  value={query}
                  placeholder="Search to filter..."
                  className="w-full text-sm h-full rounded-lg pl-4 pr-11 bg-[#21262d] hover:bg-[#262c34] border-[#30363d] border text-neutral-400 placeholder:text-neutral-300 outline-none"
                />
                <MagnifyingGlassIcon
                  className="text-neutral-400 right-4 absolute"
                  width={20}
                />
              </div>
              <Button action={() => setDeviceModal(true)}>
                Add new
                <PlusIcon width={18} />
              </Button>
              <Pagination
                currentPage={page}
                setterPage={setPage}
                pagination={devices?.pagination}
              />
            </div>
          </div>
          <hr className="my-4 h-[1px] border-0 bg-[#30363db3]" />
          <Table
            columns={devicesColumns}
            data={devices?.data ?? []}
            loading={loading}
            options={tableOptions}
          />
          <span className="mt-3 block text-center text-sm text-[#8d96a0]">
            Showing 1-{devices?.data?.length} of {devices?.pagination.total}{" "}
            entries
          </span>
        </div>
      </section>
    </>
  );
};

export default Page;
