export type ContactSubmission = {
  full_name: string;
  email: string;
  phone?: string;
  message: string;
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

import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase";

export async function submitContactForm(data: ContactSubmission) {
  const fullName = normalizeText(data.full_name, 100);
  const email = normalizeText(data.email, 255);
  const message = normalizeText(data.message, 2000);
  const phone = data.phone ? normalizeText(data.phone, 30) : "";
  const interestGroup = normalizeText(data.interest_group, 50) || "other";

  if (!fullName || !email || !message) {
    throw new Error("Missing required contact form fields.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (fullName.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (message.length < 10) {
    throw new Error("Message must be at least 10 characters long.");
  }

  if (phone && !/^[0-9+()\-\s]{7,30}$/.test(phone)) {
    throw new Error("Please enter a valid phone number.");
  }

  if (!allowedInterestGroups.has(interestGroup)) {
    throw new Error("Invalid inquiry topic.");
  }

  const payload = {
    full_name: fullName,
    email,
    phone: phone || null,
    message,
    interest_group: interestGroup,
    created_at: new Date().toISOString(),
  };

  const db = getFirestore(app);
  await addDoc(collection(db, "contact_inquiries"), payload);

  return {
    success: true,
    submittedAt: new Date().toISOString(),
  };
}