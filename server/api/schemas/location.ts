import z from "zod";

const fileSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.string(),
  created_at: z.string(),
  location_id: z.string().optional(),
  type: z.string().min(1),
});

const locationSchema = z.object({
  name: z.string().min(1, { message: "Location name is required" }),
  manager: z.string().min(1, { message: "User is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  street: z.string().min(1, { message: "Street is required" }),
  phone_number: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  note: z.string().optional(),
  files: z.array(fileSchema).min(0).optional(),
});

const validateLocation = (input: any) => {
  return locationSchema.safeParse(input);
};

const validatePartialLocation = (input: any) => {
  return locationSchema.partial().safeParse(input);
};

export { validateLocation, validatePartialLocation };
