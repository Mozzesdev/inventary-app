import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import React from "react";
import Dialog from "../../../../components/Dialog";
import Spinner from "../../../../components/Spinner";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { createRole, editRole } from "../../../../services/roles.services";
import { useAlert } from "../../../../hooks/useAlert";

const RoleModal = ({ isOpen, closeModal, fetchData, data }: any) => {
  const { addAlert } = useAlert();
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    try {
      setSubmitting(true);
      if (data?.id) {
        await editRole(values);
        addAlert({
          severity: "success",
          timeout: 5,
          message: "Edited successful.",
        });
      } else {
        await createRole(values);
        addAlert({
          severity: "success",
          timeout: 5,
          message: "Created successful.",
        });
      }
      resetForm();
      closeModal();
      fetchData();
    } catch (error: any) {
      console.log(error);
      addAlert({
        severity: "error",
        timeout: 5,
        message: error.response.data.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog show={isOpen} hide={closeModal} className="p-5 flex flex-col">
      <span className="text-xl font-inter-medium">
        {data?.id ? "Edit a role" : "Create a new role"}.
      </span>
      <small className="text-sm text-[#8d96a0] mt-1">
        Enter role information.
      </small>
      <hr className="mb-10 mt-3 h-[1px] bg-[#30363d] border-0" />
      <Formik
        initialValues={data}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string().required("Name required"),
          color: Yup.string().required("Color required"),
        })}
      >
        {({ isSubmitting }) => (
          <Form className="relative z-10" encType="multipart/form-data">
            {isSubmitting ? (
              <div className="absolute inset-0 bg-[#00000030] grid place-items-center z-40">
                <Spinner />
              </div>
            ) : (
              ""
            )}
            <div className="grid grid-cols-2 gap-y-9 gap-x-6">
              <Input
                label="Name"
                type="text"
                placeholder="Enter the role name..."
                name="name"
                id="name"
                containerClassName="!my-0"
              />
              <Input
                label="Color"
                type="color"
                name="color"
                id="color"
                containerClassName="!my-0"
              />
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              <Button className="py-1 px-4" submit disabled={isSubmitting}>
                {data?.id ? "Edit" : "Create"}
                <CloudArrowUpIcon width={20} />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default RoleModal;
