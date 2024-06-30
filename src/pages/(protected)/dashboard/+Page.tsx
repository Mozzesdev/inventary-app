import {
  BuildingOffice2Icon,
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
      <div className="grid grid-cols-4 gap-3">
        <article className="bg-[#21262d] rounded-md p-4">
          <div className="flex justify-between">
            <p className="text-2xl font-inter-bold text-red-500">
              {counters.location_count}
            </p>
            <div className="bg-[#353d45] rounded-full p-2 inline-flex mb-1">
              <MapIcon width={20} />
            </div>
          </div>
          <p className="text-[#8d96a0] text-sm">Total locations.</p>
        </article>
        <article className="bg-[#21262d] rounded-md p-4">
          <div className="flex justify-between">
            <p className="text-2xl font-inter-bold text-blue-500">
              {counters.supplier_count}
            </p>
            <div className="bg-[#353d45] rounded-full p-2 inline-flex mb-1">
              <BuildingOffice2Icon width={20} />
            </div>
          </div>
          <p className="text-[#8d96a0] text-sm">Total suppliers.</p>
        </article>{" "}
        <article className="bg-[#21262d] rounded-md p-4">
          <div className="flex justify-between">
            <p className="text-2xl font-inter-bold text-green-500">
              {counters.devices_count}
            </p>
            <div className="bg-[#353d45] rounded-full p-2 inline-flex mb-1">
              <DeviceTabletIcon width={20} />
            </div>
          </div>
          <p className="text-[#8d96a0] text-sm">Total devices.</p>
        </article>
        <article className="bg-[#21262d] rounded-md p-4">
          <div className="flex justify-between">
            <p className="text-2xl font-inter-bold text-orange-500">
              {counters.maintenance_devices}
            </p>
            <div className="bg-[#353d45] rounded-full p-2 inline-flex mb-1">
              <ExclamationTriangleIcon width={20} />
            </div>
          </div>
          <p className="text-[#8d96a0] text-sm">Total maintenance devices.</p>
        </article>
      </div>
      <div className="w-full mt-3">
        <article className="bg-[#21262d] rounded-md p-4">
          <span className="mb-3 block text-base">
            Devices on the verge of expiration:
          </span>
          <hr className="my-4 h-[1px] border-0 bg-[#30363db3]" />
          <div>
            <Table columns={deviceColumns} loading={loading} data={devices} />
          </div>
        </article>
      </div>
    </section>
  );
};

export default Page;
