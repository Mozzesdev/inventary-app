import z from "zod";

const fileSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.string(),
  created_at: z.string(),
  supplier_id: z.string().optional(),
  type: z.string().min(1),
});

const supplierSchema = z.object({
  name: z.string().min(1, { message: "Location name is required" }),
  contact: z.string().min(1, { message: "User is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  street: z.string().min(1, { message: "Street is required" }),
  phone_number: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  note: z.string().optional(),
  web_page: z.string().optional(),
  files: z.array(fileSchema).min(0).optional(),
});

const supplierFilesSchema = z.array(fileSchema).min(1);

const validateSupplier = (input: any) => {
  return supplierSchema.safeParse(input);
};

const validateSupplierFiles = (input: any) => {
  return supplierFilesSchema.safeParse(input);
};

const validatePartialSupplier = (input: any) => {
  return supplierSchema.partial().safeParse(input);
};

export { validateSupplier, validatePartialSupplier, validateSupplierFiles };
