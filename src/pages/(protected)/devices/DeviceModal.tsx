import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Dialog from "../../../components/Dialog";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import { uploadFile } from "../../../services/files.services";
import { createDevice, editDevice } from "../../../services/devices.services";
import { Device } from "../../../interfaces/device";
import Select from "../../../components/Select";
import Checkbox from "../../../components/Checkbox";
import { useAlert } from "../../../hooks/useAlert";
import React from "react";

const DeviceModal = ({
  deviceModal,
  closeModal,
  fetchData,
  data,
  locations,
  suppliers,
}: any) => {
  const { addAlert } = useAlert();
  const handleSubmit = async (
    values: Device,
    { setSubmitting, resetForm }: FormikHelpers<Device>
  ) => {
    try {
      setSubmitting(true);
      const files = await uploadFiles(values.files);
      if (data.id) {
        await editDevice({ ...values, files: files?.data ?? [] });
      } else {
        await createDevice({ ...values, files: files?.data ?? [] });
      }
      addAlert({
        severity: "success",
        message: "Device created successful",
        timeout: 5,
      });
      resetForm();
      closeModal();
      fetchData();
    } catch (error: any) {
      console.log(error);
      addAlert({
        severity: "success",
        message: error.response.data.message,
        timeout: 5,
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <Dialog show={deviceModal} hide={closeModal} className="p-5 flex flex-col">
      <span className="text-xl font-inter-medium">
        {data.id ? "Edit a device" : "Create a new device"}.
      </span>
      <small className="text-sm text-[#8d96a0] mt-1">
        Enter device information.
      </small>
      <hr className="mb-10 mt-3 h-[1px] bg-[#30363d] border-0" />
      <Formik
        initialValues={{
          ...data,
          purchase_date: data?.purchase_date?.split("T")[0] ?? "",
          expiration_date: data?.expiration_date?.split("T")[0] ?? "",
          production_date: data?.production_date?.split("T")[0] ?? "",
          location_id: data?.location?.id ?? "",
          supplier_id: data?.supplier?.id ?? "",
        }}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Device name is required"),
          serial_number: Yup.string().required("Serial number is required"),
          maintenance: Yup.boolean().required("Maintenance status is required"),
          brand: Yup.string().required("Brand is required"),
          type: Yup.string().required("Type is required"),
          purchase_date: Yup.date()
            .required("Purchase date is required")
            .max(new Date(), "Purchase date cannot be in the future"),
          production_date: Yup.date()
            .required("Production date is required")
            .max(new Date(), "Production date cannot be in the future"),
          expiration_date: Yup.date()
            .required("Expiration date is required")
            .min(
              Yup.ref("purchase_date"),
              "Expiration date cannot be before the purchase date"
            ),
          note: Yup.string(),
          location_id: Yup.string()
            .uuid("Invalid UUID format")
            .required("Location ID is required"),
          supplier_id: Yup.string()
            .uuid("Invalid UUID format")
            .required("Supplier ID is required"),
        })}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          return (
            <Form className="relative z-10" encType="multipart/form-data">
              {isSubmitting ? (
                <div className="absolute inset-0 bg-[#00000030] grid place-items-center z-40">
                  <Spinner />
                </div>
              ) : (
                ""
              )}
              <div className="grid grid-cols-3 gap-y-9 gap-x-6 max-sm:grid-cols-2 max-[450px]:grid-cols-1">
                <Input
                  label="Name"
                  type="text"
                  placeholder="Enter the device name..."
                  name="name"
                  id="name"
                  containerClassName="!my-0"
                />
                <Input
                  label="Serial number"
                  placeholder="Enter the serial number..."
                  type="text"
                  name="serial_number"
                  containerClassName="!my-0"
                  id="serial_number"
                />
                <Input
                  label="Brand"
                  name="brand"
                  type="text"
                  containerClassName="!my-0"
                  id="brand"
                  placeholder="Enter the device brand..."
                />
                <Input
                  label="Type"
                  placeholder="Enter the device type..."
                  containerClassName="!my-0"
                  id="type"
                  type="text"
                  name="type"
                />
                <Input
                  label="Purchase date"
                  containerClassName="!my-0"
                  type="date"
                  name="purchase_date"
                  id="purchase_date"
                />
                <Input
                  label="Production date"
                  type="date"
                  containerClassName="!my-0"
                  name="production_date"
                  id="production_date"
                />
                <Input
                  label="Expiration date"
                  containerClassName="!my-0"
                  type="date"
                  id="expiration_date"
                  name="expiration_date"
                />
                <Select
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    setFieldValue("location_id", value);
                  }}
                  options={locations}
                  name="location_id"
                  label="Select a location"
                />
                <Select
                  required={true}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    setFieldValue("supplier_id", value);
                  }}
                  options={suppliers}
                  name="supplier_id"
                  label="Select a supplier"
                />
              </div>
              <Input
                as="textarea"
                type="text"
                required={false}
                name="note"
                id="note"
                label="Notes"
                placeholder="Write some notes here..."
                containerClassName="mb-4 my-9"
              />
              <div className="flex gap-2 mb-3">
                <Checkbox
                  isChecked={values.maintenance}
                  className="!w-[18px] !h-[18px]"
                  onChange={async () => {
                    await setFieldValue("maintenance", !values.maintenance);
                  }}
                />
                <span className="text-sm text-[#a3a3a3]">
                  Does the device require maintenance?
                </span>
              </div>
              {!data.id ? (
                <>
                  <label
                    className="block mb-2 text-sm font-medium text-left text-neutral-400"
                    htmlFor="files"
                  >
                    Upload multiple files
                  </label>
                  <input
                    className="max-w-52 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="files"
                    type="file"
                    name="files"
                    multiple
                    onChange={async (e) =>
                      await setFieldValue("files", e.currentTarget.files)
                    }
                  />
                </>
              ) : (
                ""
              )}
              <div className="flex gap-3 mt-4 justify-center">
                <Button className="py-1 px-4" submit disabled={isSubmitting}>
                  {data.id ? "Edit" : "Create"}
                  <CloudArrowUpIcon width={20} />
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default DeviceModal;
