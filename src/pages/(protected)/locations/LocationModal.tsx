import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import {
  createLocation,
  editLocation,
} from "../../../services/locations.services";
import { Location } from "../../../interfaces/location";
import Dialog from "../../../components/Dialog";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import { uploadFile } from "../../../services/files.services";
import React from "react";

const LocationModal = ({ locationModal, closeModal, fetchData, data }: any) => {
  const handleSubmit = async (
    values: Location,
    { setSubmitting, resetForm }: FormikHelpers<Location>
  ) => {
    try {
      setSubmitting(true);
      const files = await uploadFiles(values.files);
      if (data.id) {
        await editLocation({ ...values, files: files.data});
      } else {
        await createLocation({ ...values, files: files.data });
      }
      resetForm();
      closeModal();
      fetchData();
    } catch (error) {
      console.log(error);
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
    <Dialog
      show={locationModal}
      hide={closeModal}
      className="p-5 flex flex-col"
    >
      <span className="text-xl font-inter-medium">
        {data.id ? "Edit a location" : "Create a new location"}.
      </span>
      <small className="text-sm text-[#8d96a0] mt-1">
        Enter location information.
      </small>
      <hr className="mb-10 mt-3 h-[1px] bg-[#30363d] border-0"/>
      <Formik
        initialValues={data}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          address: Yup.string().required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          manager: Yup.string().required("Required"),
          phone_number: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          street: Yup.string().required("Required"),
          zip: Yup.string().required("Required"),
          note: Yup.string(),
        })}
      >
        {({ isSubmitting, setFieldValue }) => (
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
                placeholder="Enter the location name..."
                name="name"
                id="name"
                containerClassName="!my-0"
              />
              <Input
                label="Manager"
                placeholder="Enter the manager's name..."
                type="text"
                name="manager"
                containerClassName="!my-0"
                id="manager"
              />
              <Input
                label="Address"
                name="address"
                type="text"
                containerClassName="!my-0"
                id="address"
                placeholder="Enter the address..."
              />
              <Input
                label="Street"
                placeholder="Enter the street name..."
                containerClassName="!my-0"
                id="street"
                type="text"
                name="street"
              />
              <Input
                label="Zip Code"
                placeholder="Enter the Zip Code..."
                containerClassName="!my-0"
                type="text"
                name="zip"
                id="zip"
              />
              <Input
                label="State"
                placeholder="Enter the state name..."
                type="text"
                containerClassName="!my-0"
                name="state"
                id="state"
              />
              <Input
                label="Email"
                containerClassName="!my-0"
                type="email"
                placeholder="Enter the manager email..."
                id="email"
                name="email"
              />
              <Input
                label="Phone number"
                id="phone_number"
                containerClassName="!my-0"
                type="text"
                placeholder="Enter the phone number..."
                name="phone_number"
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
            />
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
            <div className="flex gap-3 mt-4 justify-center">
              <Button className="py-1 px-4" submit disabled={isSubmitting}>
                {data.id ? "Edit" : "Create"}
                <CloudArrowUpIcon width={20} />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default LocationModal;
