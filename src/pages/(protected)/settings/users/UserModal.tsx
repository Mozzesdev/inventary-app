import { Form, Formik, FormikHelpers } from "formik";
import {
  CloudArrowUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Dialog from "../../../../components/Dialog";
import Spinner from "../../../../components/Spinner";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { useAlert } from "../../../../hooks/useAlert";
import Select from "../../../../components/Select";
import { createUser, editUser } from "../../../../services/users.services";
import Checkbox from "../../../../components/Checkbox";
import { boolean, object, ref, string } from "yup";

const UserModal = ({ isOpen, closeModal, fetchData, data, roles }: any) => {
  const { addAlert } = useAlert();
  const handleSubmit = async (
    {isEdit, ...values}: any,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    try {
      setSubmitting(true);
      if (isEdit) {
        await editUser({
          role_id: values.role_id,
          id: values.id,
          root_user: values.root_user,
          email: values.email
        });
        addAlert({
          severity: "success",
          timeout: 5,
          message: "Edited successful.",
        });
      } else {
        await createUser(values);
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

  const isEdit = !!data.id;

  const roleOptions = roles.map(({ id, name }) => ({ label: name, value: id }));

  const validationSchema = object({
    email: string().required("Email is required"),
    password: string().when("isEdit", {
      is: false,
      then: (schema) =>
        schema
          .min(8, "Password must be at least 8 characters long")
          .matches(/\d/, "Password must contain at least one number")
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
          )
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
          ).required(),
      otherwise: (schema) => schema.min(0).optional(),
    }),
    confirm: string().when("isEdit", {
      is: false,
      then: (schema) =>
        schema
          .oneOf([ref("password")], "Passwords don't match")
          .required("Confirm password is required"),
      otherwise: (schema) => schema.optional(),
    }),
    role_id: string().required("Role is required"),
    root_user: boolean().required(),
  });

  return (
    <Dialog show={isOpen} hide={closeModal} className="p-5 flex flex-col">
      <span className="text-xl font-inter-medium">
        {isEdit ? "Edit a user" : "Create a new user"}.
      </span>
      <small className="text-sm text-[#8d96a0] mt-1">
        Enter user information.
      </small>
      <hr className="mb-10 mt-3 h-[1px] bg-[#30363d] border-0" />
      <Formik
        initialValues={{ ...data, isEdit }}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="relative z-10">
            {isSubmitting ? (
              <div className="absolute inset-0 bg-[#00000030] grid place-items-center z-40">
                <Spinner />
              </div>
            ) : (
              ""
            )}
            <div className="grid grid-cols-2 gap-y-9 gap-x-6">
              <Input
                label="Email"
                type="email"
                placeholder="Enter the user email..."
                name="email"
                id="email"
                containerClassName="!my-0"
              />
              <Input
                label="Password"
                type="password"
                by="password"
                name="password"
                id="password"
                containerClassName="!my-0"
              />
              <Input
                label="Confirm password"
                type="password"
                by="password"
                placeholder="Enter the same password..."
                name="confirm"
                id="confirm"
                containerClassName="!my-0"
              />
              <Select
                required={true}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setFieldValue("role_id", value);
                }}
                options={roleOptions}
                name="role_id"
                label="Select a role"
              />
            </div>
            <div className="flex gap-2 my-4">
              <Checkbox
                isChecked={values.root_user}
                className="!w-[18px] !h-[18px]"
                onChange={async () => {
                  await setFieldValue("root_user", !values.root_user);
                }}
              />
              <span className="text-sm text-[#a3a3a3]">
                This user is a owner?
              </span>
            </div>
            <hr className="my-3 h-[1px] bg-[#30363d] border-0" />
            <p className="text-sm text-[#cc5959] flex gap-1">
              * Owner users cannot be removed from the system but they can be
              edited. <QuestionMarkCircleIcon className="w-5" />
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <Button className="py-1 px-4" submit disabled={isSubmitting}>
                {isEdit ? "Edit" : "Create"}
                <CloudArrowUpIcon width={20} />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserModal;
