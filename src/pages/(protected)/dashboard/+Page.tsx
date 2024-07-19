import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import Table from "../../../components/Table";
import {
  getDevicesColumns,
  getCounters,
  getVergeExpireDevices,
} from "../../../services/dashboard.service";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import React from "react";
import { Link } from "../../../components/Link";
import { navigate } from "vike/client/router";

const Page = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({
    location_count: 0,
    supplier_count: 0,
    devices_count: 0,
    maintenance_devices: 0,
  });
  const deviceColumns = getDevicesColumns();

  const getDevices = async () => {
    try {
      const { data } = await getVergeExpireDevices();
      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error("Error fetching devices:", error);
      return {
        success: false,
        message: "Error fetching devices.",
      };
    }
  };

  const getAllCounters = async () => {
    try {
      const { data } = await getCounters();
      if (data.success) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        console.error("Error fetching counters:", data.message);
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      return {
        success: false,
        message: "Unexpected error occurred.",
      };
    }
  };

  const getAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [devicesResponse, countersResponse] = await Promise.all([
        getDevices(),
        getAllCounters(),
      ]);

      if (devicesResponse.success) {
        setDevices(devicesResponse.data);
        setCounters((prev) => ({
          ...prev,
          devices: devicesResponse.data.length,
        }));
      } else {
        console.error("Error fetching devices:", devicesResponse.message);
      }

      if (countersResponse.success) {
        const { mainDevicesCount, locationCount, devicesCount, supplierCount } =
          countersResponse.data;

        setCounters((prev) => ({
          ...prev,
          maintenance_devices: mainDevicesCount,
          location_count: locationCount,
          devices_count: devicesCount,
          supplier_count: supplierCount,
        }));
      } else {
        console.error("Error fetching counters:", countersResponse.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false); // Asegurarse de que el estado de carga se desactive
    }
  }, []);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <section className="px-10 max-sm:px-4 max-w-[1504px] relative">
      {loading ? (
        <div className="absolute inset-0 bg-[#00000038] grid place-items-center">
          <Spinner />
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-3 max-md:grid-cols-2">
        <article className="border-[#30363d] border rounded-md p-4">
          <div className="flex justify-between items-center mb-4 text-[#aab5c1]">
            <span className="text-base font-inter-medium">Locations</span>
            <MapIcon width={20} />
          </div>
          <p className="text-2xl font-inter-bold text-red-500">
            0{counters.location_count}
          </p>
          <Link
            className="text-sm flex gap-2 group items-center hover:underline hover:text-[#9ba5b0] mt-4 text-[#aab5c1]"
            href="/locations"
          >
            View locations
            <ChevronRightIcon className="w-4 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </article>
        <article className="border-[#30363d] border rounded-md p-4">
          <div className="flex justify-between items-center mb-4 text-[#aab5c1]">
            <span className="text-base font-inter-medium">Suppliers</span>
            <BuildingOffice2Icon width={20} />
          </div>
          <p className="text-2xl font-inter-bold text-green-400">
            0{counters.supplier_count}
          </p>
          <Link
            className="text-sm flex gap-2 group items-center hover:underline hover:text-[#9ba5b0] mt-4 text-[#aab5c1]"
            href="/suppliers"
          >
            View suppliers
            <ChevronRightIcon className="w-4 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </article>{" "}
        <article className="border-[#30363d] border rounded-md p-4">
          <div className="flex justify-between items-center mb-4 text-[#aab5c1]">
            <span className="text-base font-inter-medium">Devices</span>
            <DeviceTabletIcon width={20} />
          </div>
          <p className="text-2xl font-inter-bold text-blue-500">
            0{counters.devices_count}
          </p>
          <Link
            className="text-sm flex gap-2 group items-center hover:underline hover:text-[#9ba5b0] mt-4 text-[#aab5c1]"
            href="/devices"
          >
            View devices
            <ChevronRightIcon className="w-4 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </article>{" "}
        <article className="border-[#30363d] border rounded-md p-4">
          <div className="flex justify-between items-center mb-4 text-[#aab5c1]">
            <span className="text-base font-inter-medium">
              Maintenance devices
            </span>
            <ExclamationTriangleIcon width={20} />
          </div>
          <p className="text-2xl font-inter-bold text-yellow-500">
            0{counters.maintenance_devices}
          </p>
          <Link
            className="text-sm flex gap-2 group items-center hover:underline hover:text-[#9ba5b0] mt-4 text-[#aab5c1]"
            href="/devices/maintenance"
          >
            View all devices
            <ChevronRightIcon className="w-4 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
        </article>
      </div>
      <div className="w-full mt-3">
        <article className="rounded-md p-4 border-[#30363d] border">
          <h2 className="block text-xl font-inter-bold">Devices:</h2>
          <span className="text-sm text-[#8d96a0]">Expiration devices</span>
          <div className="mt-3">
            <Table
              onRowClick={async (row) =>
                await navigate(`/devices?maintenance=${row.id}`)
              }
              columns={deviceColumns}
              loading={loading}
              data={devices}
            />
          </div>
        </article>
      </div>
    </section>
  );
};

export default Page;
