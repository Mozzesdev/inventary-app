import { Form, Formik } from "formik";
import Dialog from "../../../../components/Dialog";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { verify2fa } from "../../../../services/auth.services";
import Spinner from "../../../../components/Spinner";
import { useAlert } from "../../../../hooks/useAlert";
import { useAuth } from "../../../../hooks/useAuth";

const Setup2faDialog = ({ dialog, close, user }: any) => {
  const { addAlert } = useAlert();
  const { fetchUser }: any = useAuth();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await verify2fa({ ...values, id: user.id });
      resetForm();
      addAlert({
        message: data.message,
        severity: "success",
        timeout: 5,
      });
      await fetchUser();
      close();
    } catch (error: any) {
      console.log(error);
      addAlert({
        message: error.response.data.message,
        severity: "error",
        timeout: 5,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog show={dialog.dialog} hide={close}>
      <div className="overflow-auto">
        <Formik initialValues={{ token_2fa: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting, values }) => (
            <Form className="relative z-10 flex flex-col p-6">
              {isSubmitting ? (
                <div className="absolute inset-0 bg-[#00000038] grid place-items-center z-40">
                  <Spinner />
                </div>
              ) : (
                ""
              )}

              <span className="text-lg font-inter-medium">
                Setup authenticator app
              </span>
              <small className="text-sm text-[#8d96a0] my-3">
                Authenticator apps and browser extensions like 1Password, Authy,
                Microsoft Authenticator, etc. generate one- time passwords that
                are used as a second factor to verify your identity when
                prompted during sign-in.
              </small>
              <small className="text-sm">Scan the QR code</small>
              <small className="text-sm text-[#8d96a0] my-3">
                Use an authenticator app or browser extension to scan.
              </small>
              <img
                src={dialog.qrcode}
                alt="qrcode"
                className="w-40 h-auto rounded-lg"
              />
              <div className="max-w-[250px] mt-9">
                <Input
                  label="Verify the code from app"
                  type="text"
                  className="!rounded-md py-1 !bg-[#161b22]"
                  placeholder="XXXXXX"
                  id="token_2fa"
                  name="token_2fa"
                  required={false}
                />
              </div>
              <hr className="bg-[#1d2227] h-[1px] border-0 my-5" />
              <div className="flex gap-3 justify-end">
                <Button
                  className="!px-3 py-1 text-sm bg-transparent rounded-md"
                  action={close}
                >
                  Cancel
                </Button>
                <Button
                  className="!px-3 py-1 text-sm bg-green-500 rounded-md"
                  submit
                  disabled={values?.token_2fa?.length !== 6}
                >
                  Continue
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default Setup2faDialog;
