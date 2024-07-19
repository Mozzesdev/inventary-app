import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  defaultLocationValues,
  deleteLocation,
  FetchLocation,
  getLocationColumns,
  getLocations,
} from "../../../services/locations.services";
import ConfirmDialog from "../../../components/ConfirmDialog";
import LocationModal from "./LocationModal";
import Dropdown, { DropdownItem } from "../../../components/Dropdown";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import { Location } from "../../../interfaces/location";
import FilesModal from "../../../components/FilesModal";
import Pagination from "../../../components/Pagination";
import { useAlert } from "../../../hooks/useAlert";
import React from "react";

const Page = () => {
  const [locationModal, setLocationModal] = useState(false);
  const [filesModal, setFilesModal] = useState({ data: null, open: false });
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ id: null, open: false });
  const [location, setLocation] = useState<FetchLocation>();
  const [locationColumns, setLocationColumns] = useState(getLocationColumns());
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<any>(defaultLocationValues);
  const [query, setQuery] = useState("");
  const debounceTimeout = useRef<any>(null);

  const { addAlert } = useAlert();

  const fetchData = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await getLocations({ query, page });
      setLocation(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const items: any[] = getLocationColumns().map(({ value, name }) => ({
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
    setLocationModal(false);
    setSelectedRow(defaultLocationValues);
  };

  const openEditModal = (data: Location) => {
    setSelectedRow(data);
    setLocationModal(true);
  };

  const openFilesModal = (data: any) => {
    setFilesModal({ data, open: true });
  };

  const deleteLocationRow = async (id: any) => {
    try {
      const { data } = await deleteLocation(id);
      setQuery("");
      addAlert({
        message: data.message,
        severity: "success",
        timeout: 5,
      });
      fetchData();
      setConfirmDialog({ id: null, open: false });
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    }
  };

  const changeViewColumns = (e: DropdownItem | DropdownItem[] | null) => {
    const newState = locationColumns.map((col) => ({
      ...col,
      show: (e as DropdownItem[]).some(({ id }) => id === col.value[0]),
    }));
    setLocationColumns(newState);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

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
        label: "View files",
        action: () => openFilesModal(row),
      },
    ];
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
      <LocationModal
        locationModal={locationModal}
        closeModal={closeModal}
        fetchData={fetchData}
        data={selectedRow}
      />
      <FilesModal
        state={filesModal}
        hide={() => setFilesModal({ data: null, open: false })}
      />
      <section className="px-10 max-sm:px-4 max-w-[1504px]">
        <div className="relative min-w-0 border border-[#30363d] p-5 rounded-md">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
            <Dropdown
              type="multiple"
              label="Select columns to show"
              items={items}
              defaultSelected={items}
              onColumnChange={changeViewColumns}
            />
            <div className="flex gap-4 flex-wrap">
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
              <Button action={() => setLocationModal(true)}>
                Add new
                <PlusIcon width={18} />
              </Button>
              <Pagination
                currentPage={page}
                setterPage={setPage}
                pagination={location?.pagination}
              />
            </div>
          </div>
          <hr className="my-4 h-[1px] border-0 bg-[#30363db3]" />
          <Table
            columns={locationColumns}
            data={location?.data ?? []}
            loading={loading}
            options={tableOptions}
          />
          <span className="mt-3 block text-center text-sm text-[#8d96a0]">
            Showing 1-{location?.data.length} of {location?.pagination.total} entries
          </span>
        </div>
      </section>
    </>
  );
};

export default Page;
