import z from "zod";

const loginSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "The min length of password is 8" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

const userSchema = z.object({
  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "The min length of password is 8" })
    .regex(/\d/)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  role_id: z.string().min(1),
  root_user: z.boolean().or(z.number()),
  two_factor: z.boolean().or(z.number()).optional().nullable(),
  app_secret: z.string().optional().nullable(),
});

const passwordSchema = z
  .object({
    current: z.string().min(1),
    new: z
      .string()
      .min(8)
      .regex(/\d/)
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/)
      .min(1),
    confirm: z.string().min(1),
  })
  .refine((data) => data.new === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const validateLogin = (input: any) => {
  return loginSchema.safeParse(input);
};

const validateUser = (input: any) => {
  return userSchema.safeParse(input);
};

const validatePartialUser = (input: any) => {
  return userSchema.partial().safeParse(input);
};

const validatePasswordChange = (input: any) => {
  return passwordSchema.safeParse(input);
};

export {
  validateUser,
  validatePartialUser,
  validatePasswordChange,
  validateLogin,
};
