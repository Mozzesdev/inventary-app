import z from "zod";

const roleSchema = z.object({
  name: z.string().min(1, { message: "Role name is required" }),
  color: z.string().min(1, {message: "Role color is required"})
});

const validateRole = (input: any) => {
  return roleSchema.safeParse(input);
};

const validatePartialRole = (input: any) => {
  return roleSchema.partial().safeParse(input);
};

export { validateRole, validatePartialRole };
