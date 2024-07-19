import z from "zod";

const fileSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.string(),
  created_at: z.string(),
  device_id: z.string().optional(),
  type: z.string().min(1),
});

const deviceSchema = z.object({
  device: z.string().min(1, { message: "Device name is required" }),
  serial_number: z.string().min(1, { message: "Serial number is required" }),
  maintenance: z.boolean(),
  brand: z.string().min(1, { message: "Brand is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  purchase_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid purchase date",
    }),
  production_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid production date",
    }),
  expiration_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid expiration date",
    }),
  note: z.string().optional(),
  location_id: z.string().uuid({ message: "Invalid location ID" }),
  supplier_id: z.string().uuid({ message: "Invalid supplier ID" }),
  maintenance_supplier_id: z.string().optional().nullable(),
  maintenance_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid purchase date",
  }).optional().nullable(),
  next_maintenance: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid purchase date",
  }).optional().nullable(),
  maintenance_comment: z.string().optional().nullable(),
  files: z.array(fileSchema).optional(),
});

const validateDevice = (input: any) => {
  return deviceSchema.safeParse(input);
};

const validatePartialDevice = (input: any) => {
  return deviceSchema.partial().safeParse(input);
};

export { validateDevice, validatePartialDevice };
