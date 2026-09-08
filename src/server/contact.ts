import { supabase } from "@/lib/subpabase";

export type ContactSubmission = {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  interest_group?: string;
};

const allowedInterestGroups = new Set([
  "join",
  "program",
  "scholarship",
  "partnership",
  "other",
]);

function normalizeText(value: string | undefined, maxLength: number) {
  const text = value?.trim() ?? "";
  if (text.length > maxLength) {
    throw new Error(`Input is too long. Maximum ${maxLength} characters.`);
  }
  return text;
}

export async function submitContactForm(data: ContactSubmission) {
  const fullName = normalizeText(data.full_name, 100);
  const email = normalizeText(data.email, 255);
  const address = normalizeText(data.address, 500);
  const phone = data.phone ? normalizeText(data.phone, 30) : "";
  const interestGroup = normalizeText(data.interest_group, 50) || "other";

  if (!fullName || !email) {
    throw new Error("Name and email are required.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (fullName.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (phone && !/^\+\d{1,3}\d{10}$/.test(phone)) {
    throw new Error("Please enter a valid 10-digit phone number.");
  }

  if (!allowedInterestGroups.has(interestGroup)) {
    throw new Error("Invalid inquiry topic.");
  }

  const payload = {
    full_name: fullName,
    email,
    phone: phone || null,
    message: address,
    interest_group: interestGroup,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    throw new Error("Supabase is not configured for this deployment.");
  }

  const { error } = await supabase.from("contact_inquiries").insert(payload);
  if (error) {
    console.error("Supabase insert failed:", error);
    throw new Error("Failed to save contact submission.");
  }

  return {
    success: true,
    submittedAt: new Date().toISOString(),
  };
}