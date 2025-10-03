import { z } from "zod";

// Pet listing validation schema
export const petListingSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Pet name is required")
    .max(100, "Name must be less than 100 characters"),
  
  species: z.enum(["dog", "cat"], {
    errorMap: () => ({ message: "Species must be dog or cat" })
  }),
  
  breed: z.string()
    .trim()
    .min(1, "Breed is required")
    .max(100, "Breed must be less than 100 characters"),
  
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be male or female" })
  }),
  
  listing_type: z.enum(["breeding", "puppy/kitten"], {
    errorMap: () => ({ message: "Invalid listing type" })
  }),
  
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price must be less than $100,000"),
  
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  
  age_months: z.number()
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(300, "Age must be less than 300 months")
    .optional(),
  
  size: z.enum(["small", "medium", "large"], {
    errorMap: () => ({ message: "Size must be small, medium, or large" })
  }).optional(),
  
  vaccinated: z.boolean().optional(),
  
  city: z.string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  
  state: z.string()
    .trim()
    .min(2, "State is required")
    .max(50, "State must be less than 50 characters"),
  
  zip_code: z.string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format")
    .optional(),
});

// Message validation schema
export const messageSchema = z.object({
  message_content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters"),
  
  conversation_id: z.string().uuid("Invalid conversation ID"),
  recipient_id: z.string().uuid("Invalid recipient ID"),
});

// Banking change request validation schema
export const bankingChangeSchema = z.object({
  request_type: z.literal("banking_change"),
  notes: z.string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// User report validation schema
export const userReportSchema = z.object({
  reported_user_id: z.string().uuid("Invalid user ID"),
  report_reason: z.enum([
    "fraud",
    "harassment",
    "inappropriate_content",
    "scam",
    "fake_listing",
    "other"
  ], {
    errorMap: () => ({ message: "Invalid report reason" })
  }),
  report_details: z.string()
    .trim()
    .min(10, "Please provide at least 10 characters of detail")
    .max(1000, "Details must be less than 1000 characters"),
});

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one symbol"),
  
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, underscore, or hyphen"),
  
  full_name: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  const lowerPassword = data.password.toLowerCase();
  const lowerEmail = data.email.toLowerCase();
  const lowerUsername = data.username.toLowerCase();
  const lowerName = data.full_name?.toLowerCase() || "";
  
  return !lowerPassword.includes(lowerEmail) && 
         !lowerPassword.includes(lowerUsername) &&
         !lowerPassword.includes(lowerName) &&
         !lowerEmail.includes(lowerPassword) &&
         !lowerUsername.includes(lowerPassword) &&
         !lowerName.includes(lowerPassword);
}, {
  message: "Password cannot contain or match your name, username, or email",
  path: ["password"],
});

export const signInSchema = z.object({
  identifier: z.string()
    .trim()
    .min(1, "Username or email is required")
    .max(255, "Input must be less than 255 characters"),
  
  password: z.string()
    .min(1, "Password is required"),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, underscore, or hyphen")
    .optional(),
  
  full_name: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  
  city: z.string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters")
    .optional(),
  
  state: z.string()
    .trim()
    .min(2, "State is required")
    .max(50, "State must be less than 50 characters")
    .optional(),
  
  zip_code: z.string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format")
    .optional(),
  
  latitude: z.number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .optional(),
  
  longitude: z.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .optional(),
  
  county: z.string()
    .trim()
    .max(100, "County must be less than 100 characters")
    .optional(),
});

// Conversation request validation
export const conversationRequestSchema = z.object({
  pet_id: z.string().uuid("Invalid pet ID"),
  breeder_id: z.string().uuid("Invalid breeder ID"),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => e.message),
      };
    }
    return {
      success: false,
      errors: ["Validation failed"],
    };
  }
}
