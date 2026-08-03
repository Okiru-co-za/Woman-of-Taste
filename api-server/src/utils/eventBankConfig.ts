import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { adminSettingsTable } from "@workspace/db/schema";

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  branchName: string;
  swiftCode: string;
}

export const WOMAN_OF_TASTE_DEFAULT: BankDetails = {
  bankName: "Investec Bank Limited",
  accountName: "Woman of Taste",
  accountNumber: "10013145814",
  branchCode: "580105",
  accountType: "Current Account",
  branchName: "100 Grayston Drive, Sandton",
  swiftCode: "IVESZAJJ",
};

// La Femme by Luna Lusa settled through its own FNB account (BANK_* env vars on
// Railway) before per-event overrides existed below. Kept as a seed so this one
// event keeps working until an admin confirms or edits it in the admin panel.
const LUNA_LUSA_EVENT_ID = "la-femme-luna-lusa-aug-2026";

function lunaLusaSeed(): BankDetails {
  const accountName = process.env["BANK_ACCOUNT_NAME"] ?? "Elsweyr (Pty) Ltd";
  return {
    bankName: process.env["BANK_NAME"] ?? "First National Bank",
    accountName: accountName.toLowerCase().includes("luna lusa")
      ? accountName
      : `${accountName} trading as Luna Lusa`,
    accountNumber: process.env["BANK_ACCOUNT_NUMBER"] ?? "63212660012",
    branchCode: process.env["BANK_BRANCH_CODE"] ?? "255355",
    accountType: process.env["BANK_ACCOUNT_TYPE"] ?? "Gold Business Account",
    branchName: process.env["BANK_BRANCH_NAME"] ?? "My Branch",
    swiftCode: process.env["BANK_SWIFT_CODE"] ?? "FIRNZAJJ",
  };
}

function settingsKey(eventId: string): string {
  return `event_bank_details:${eventId}`;
}

// The raw admin-configured override for one event, or null if it uses the default.
export async function getEventBankOverride(eventId: string): Promise<BankDetails | null> {
  const [row] = await db.select().from(adminSettingsTable).where(eq(adminSettingsTable.key, settingsKey(eventId))).limit(1);
  if (!row) return null;
  try {
    return JSON.parse(row.value) as BankDetails;
  } catch {
    return null;
  }
}

// Set a custom bank details override for one event, or pass null to clear it and revert to the default.
export async function setEventBankOverride(eventId: string, details: BankDetails | null): Promise<void> {
  const key = settingsKey(eventId);
  if (details === null) {
    await db.delete(adminSettingsTable).where(eq(adminSettingsTable.key, key));
    return;
  }
  const [existing] = await db.select().from(adminSettingsTable).where(eq(adminSettingsTable.key, key)).limit(1);
  if (existing) {
    await db.update(adminSettingsTable).set({ value: JSON.stringify(details), updatedAt: new Date() }).where(eq(adminSettingsTable.key, key));
  } else {
    await db.insert(adminSettingsTable).values({ key, value: JSON.stringify(details) });
  }
}

export async function getBankDetailsForEvent(eventId?: string | null): Promise<BankDetails> {
  if (!eventId) return WOMAN_OF_TASTE_DEFAULT;
  const override = await getEventBankOverride(eventId);
  if (override) return override;
  return eventId === LUNA_LUSA_EVENT_ID ? lunaLusaSeed() : WOMAN_OF_TASTE_DEFAULT;
}
