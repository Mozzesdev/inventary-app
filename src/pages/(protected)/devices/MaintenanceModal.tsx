import Dialog from "../../../components/Dialog";
import React, { useEffect, useState } from "react";
import {
  getDeviceById,
} from "../../../services/devices.services";
import { Device } from "../../../interfaces/device";
import { Form, Formik } from "formik";
import Input from "../../../components/Input";
import Spinner from "../../../components/Spinner";
import Select from "../../../components/Select";
import { formatDate } from "../../../../utils/date";
import Button from "../../../components/Button";
import { useAlert } from "../../../hooks/useAlert";
import { object, string, date } from "yup";
import { manageMaintenanceDevice } from "../../../services/maintenances.services";

const MaintenanceModal = ({ open, closeModal, deviceId, suppliers }: any) => {
  const { addAlert } = useAlert();
  const [device, setDevice] = useState<Device | null>(null);

  const getData = async () => {
    try {
      const { data } = await getDeviceById({ id: deviceId });
      setDevice(data.data);
    } catch (error) {
      console.log(error);
      closeModal();
      addAlert({
        severity: "error",
        message: "Something was wrong, please contact to support.",
        timeout: 5,
      });
    }
  };

  useEffect(() => {
    if (deviceId) {
      getData();
    }
  }, [deviceId]);

  const handleSubmit = async (values) => {
    delete values.serial_number;
    try {
      await manageMaintenanceDevice(deviceId, values);
      addAlert({
        severity: "success",
        message: "The maintenance was updated successful.",
        timeout: 5,
      });
      closeModal()
    } catch (error) {
      console.log(error);
      addAlert({
        severity: "error",
        message: "Something was wrong on update the maintenance.",
        timeout: 5,
      });
    }
  };

  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  const defaultMaintenanceDevice = {
    serial_number: device?.serial_number ?? "",
    maintenance_supplier_id: device?.maintenance_supplier?.id ?? "",
    maintenance_date:
      device?.maintenance_date?.split("T")[0] ?? formatDate(today),
    next_maintenance:
      device?.next_maintenance?.split("T")[0] ?? formatDate(nextYear),
    maintenance_comment: device?.maintenance_comment ?? "",
  };

  return (
    <Dialog show={open} hide={closeModal} className="p-5 flex flex-col">
      {device ? (
        <>
          <span className="text-xl font-inter-medium">
            Maintenance of{" "}
            <span className="text-neutral-400 font-inter-bold">
              {device.name}
            </span>
          </span>
          <small className="text-sm text-[#8d96a0] mt-1">
            Enter maintenance information.
          </small>
          <hr className="my-3 h-[1px] bg-[#30363d] border-0" />
          <span className="text-base text-neutral-400">Details:</span>
          <div className="mb-10 grid grid-cols-5 gap-4 border border-[#30363d] px-2 py-1 rounded-md mt-2 text-sm">
            <span className="mx-auto">{device.name ?? ''}</span>
            <span className="mx-auto">{device.location?.name ?? ''}</span>
            <span className="mx-auto">{device.type ?? ''}</span>
            <span className="mx-auto">{device.purchase_date?.split("T")[0] ?? ''}</span>
            <span className="mx-auto">{device.expiration_date?.split("T")[0] ?? ''}</span>
          </div>
          <Formik
            initialValues={defaultMaintenanceDevice}
            validationSchema={object({
              maintenance_supplier_id: string().required(),
              maintenance_date: date().required(),
              next_maintenance: date().required(),
              maintenance_comment: string(),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => {
              return (
                <Form className="relative z-10">
                  {isSubmitting ? (
                    <div className="absolute inset-0 bg-[#00000030] grid place-items-center z-40">
                      <Spinner />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="grid grid-cols-2 gap-y-9 gap-x-6 max-sm:grid-cols-2 max-[450px]:grid-cols-1">
                    <Input
                      label="Serial number"
                      type="text"
                      name="serial_number"
                      id="serial_number"
                      containerClassName="!my-0"
                      disabled
                    />
                    <Select
                      required={true}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        setFieldValue("maintenance_supplier_id", value);
                      }}
                      options={suppliers}
                      name="maintenance_supplier_id"
                      label="Select a maintenance supplier"
                    />
                    <Input
                      label="Maintenance date"
                      name="maintenance_date"
                      type="date"
                      containerClassName="!my-0"
                      id="maintenance_date"
                      placeholder="Enter the device brand..."
                      onChange={async (e) => {
                        const date: Date = e.target.valueAsDate!;
                        const nextMaintenance = date;
                        nextMaintenance?.setFullYear(date.getFullYear() + 1);
                        await setFieldValue("maintenance_date", e.target.value);
                        await setFieldValue(
                          "next_maintenance",
                          formatDate(nextMaintenance)
                        );
                      }}
                    />
                    <Input
                      label="Next maintenance"
                      placeholder="Enter the device type..."
                      containerClassName="!my-0"
                      id="next_maintenance"
                      type="date"
                      name="next_maintenance"
                    />
                  </div>
                  <Input
                    as="textarea"
                    type="text"
                    required={false}
                    name="maintenance_comment"
                    id="maintenance_comment"
                    label="Comment"
                    placeholder="Write comments here..."
                    containerClassName="mb-4 my-9"
                  />
                  <div className="flex gap-3 mt-4 justify-center">
                    <Button
                      className="py-1 px-4"
                      submit
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </>
      ) : (
        <div className="w-full animate-pulse">
          <div>
            <div className="space-y-2">
              <div className="h-6 bg-[#8d96a0] w-[200px]" />
              <div className="h-4 bg-[#8d96a0] w-[300px]" />
            </div>
          </div>
          <hr className="mb-4 mt-3 h-[1px] bg-[#30363d] border-0" />
          <div className="grid gap-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-5 bg-[#8d96a0] w-[100px]" />
                <div className="h-10 bg-[#8d96a0] w-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-[#8d96a0] w-[100px]" />
                <div className="h-10 bg-[#8d96a0] w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-5 bg-[#8d96a0] w-[100px]" />
                <div className="h-10 bg-[#8d96a0] w-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-[#8d96a0] w-[100px]" />
                <div className="h-10 bg-[#8d96a0] w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-[#8d96a0] w-[100px]" />
              <div className="h-20 bg-[#8d96a0] w-full" />
            </div>
          </div>
          <div>
            <div className="h-10 bg-[#8d96a0] w-[100px] mx-auto" />
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default MaintenanceModal;
