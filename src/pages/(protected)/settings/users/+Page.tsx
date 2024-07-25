import React, { useEffect, useState } from "react";
import Table from "../../../../components/Table";
import { FingerPrintIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import {
  defaultUserData,
  deleteUser,
  getUsers,
  getUsersColumns,
} from "../../../../services/users.services";
import Button from "../../../../components/Button";
import { useAlert } from "../../../../hooks/useAlert";
import {
  defaultRoleData,
  deleteRole,
  getRoleColumns,
  getRoles,
} from "../../../../services/roles.services";
import RoleModal from "./RoleModal";
import UserModal from "./UserModal";
import ConfirmDialog from "../../../../components/ConfirmDialog";

const Page = () => {
  const [confirmUserDialog, setConfirmUserDialog] = useState({
    id: null,
    open: false,
  });
  const [confirmRoleDialog, setConfirmRoleDialog] = useState({
    id: null,
    open: false,
  });
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>();
  const [roles, setRoles] = useState<any>();
  const [roleModal, setRoleModal] = useState({
    data: defaultRoleData,
    open: false,
  });
  const [userModal, setUserModal] = useState({
    data: defaultUserData,
    open: false,
  });
  const { addAlert } = useAlert();
  const usersColumns = getUsersColumns();
  const roleColumns = getRoleColumns();

  const getAllRoles = async () => {
    const { data: rolesData } = await getRoles();
    setRoles(rolesData);
  };

  const getAllUsers = async () => {
    const { data: userData } = await getUsers();
    setUsers(userData);
  };

  const getData = async () => {
    try {
      setLoading(true);
      await getAllUsers();
      await getAllRoles();
    } catch (error: any) {
      const message = error.response.data.message;
      console.log(error);
      addAlert({
        message,
        severity: "error",
        timeout: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const roleOptions = (row) => {
    return [
      {
        label: "Edit",
        action: () => {
          setRoleModal({ data: row, open: true });
        },
      },
      {
        label: "Delete",
        action: () => {
          setConfirmRoleDialog({ id: row.id, open: true });
        },
      },
    ];
  };

  const userOptions = (row) => {
    return [
      {
        label: "Edit",
        action: () => {
          setUserModal((_prev) => {
            const data = {
              data: {
                role_id: row.role.id,
                confirm: "",
                password: "",
                id: row.id,
                email: row.email,
                root_user: row.root_user,
              },
              open: true,
            };
            return data;
          });
        },
      },
      {
        label: "Delete",
        disabled: row?.root_user,
        action: () => {
          setConfirmUserDialog({ id: row.id, open: true });
        },
      },
    ];
  };

  const hideRoleModal = () =>
    setRoleModal({ data: defaultRoleData, open: false });

  const hideUserModal = () =>
    setUserModal({ data: defaultUserData, open: false });

  const deleteRoleRow = async (id: any) => {
    try {
      const { data } = await deleteRole({ id });
      addAlert({
        message: data.message,
        severity: "success",
        timeout: 5,
      });
      getAllRoles();
      setConfirmRoleDialog({ id: null, open: false });
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    }
  };

  const deleteUserRow = async (id: any) => {
    try {
      const { data } = await deleteUser({ id });
      addAlert({
        message: data.message,
        severity: "success",
        timeout: 5,
      });
      getAllUsers();
      setConfirmUserDialog({ id: null, open: false });
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    }
  };

  return (
    <section className="grid grid-cols-[1fr_.6fr] max-lg:grid-cols-1 gap-7 text-neutral-200 px-10 max-sm:px-4 max-w-[1500px] mx-auto">
      <RoleModal
        isOpen={roleModal.open}
        data={roleModal.data}
        fetchData={getAllRoles}
        closeModal={hideRoleModal}
      />
      <UserModal
        isOpen={userModal.open}
        data={userModal.data}
        fetchData={getAllUsers}
        closeModal={hideUserModal}
        roles={roles?.data ?? []}
      />
      <ConfirmDialog
        onClose={() => setConfirmRoleDialog({ id: null, open: false })}
        open={confirmRoleDialog.open}
        title="Are you sure to delete this item?"
        onConfirm={() =>
          confirmRoleDialog.id && deleteRoleRow(confirmRoleDialog.id)
        }
      />
      <ConfirmDialog
        onClose={() => setConfirmUserDialog({ id: null, open: false })}
        open={confirmUserDialog.open}
        title="Are you sure to delete this item?"
        onConfirm={() =>
          confirmUserDialog.id && deleteUserRow(confirmUserDialog.id)
        }
      />
      <div className="flex flex-col gap-10">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl flex gap-3 items-center">
              Users
              <UserCircleIcon width={25} />
            </h2>
            <Button
              className="!text-[#3fb950] border-[#3fb950] bg-transparent"
              action={() => setUserModal((prev) => ({ ...prev, open: true }))}
            >
              Register
            </Button>
          </div>
          <hr className="h-[1px] border-0 bg-[#30363db3]" />
          <p className="text-sm my-3">
            Manages and administers all portal users.
          </p>
          <article className="rounded-lg border border-solid border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-4">
              <Table
                loading={isLoading}
                columns={usersColumns}
                data={users?.data ?? []}
                options={userOptions}
              />
              <span className="mt-3 block text-center text-sm text-[#8d96a0]">
                Showing 1-{users?.data?.length ?? 0} of{" "}
                {users?.pagination?.total} entries
              </span>
            </div>
          </article>
        </div>
      </div>
      <div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl flex gap-3 items-center">
              Roles
              <FingerPrintIcon width={25} />
            </h2>
            <Button
              className="!text-[#3fb950] border-[#3fb950] bg-transparent"
              action={() => setRoleModal((prev) => ({ ...prev, open: true }))}
            >
              Create
            </Button>
          </div>
          <hr className="h-[1px] border-0 bg-[#30363db3]" />
          <p className="text-sm my-3">
            Manages and administers all portal roles.
          </p>
          <article className="rounded-lg border border-solid border-[#30363d] overflow-hidden">
            <div className="bg-[#161b22] p-4">
              <Table
                loading={isLoading}
                columns={roleColumns}
                data={roles?.data ?? []}
                options={roleOptions}
              />
              <span className="mt-3 block text-center text-sm text-[#8d96a0]">
                Showing 1-{roles?.data?.length ?? 0} of{" "}
                {roles?.pagination?.total} entries
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Page;
