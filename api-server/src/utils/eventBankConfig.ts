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

// La Femme by Luna Lusa settles through its own FNB account rather than Woman
// of Taste's default Investec account. This is this one event's base default
// (shown in the admin panel as "the default" for that event specifically) —
// an admin can still override it per event from the Events tab.
const LUNA_LUSA_EVENT_ID = "la-femme-luna-lusa-aug-2026";
const LUNA_LUSA_DEFAULT: BankDetails = {
  bankName: "First National Bank",
  accountName: "Luna Lusa",
  accountNumber: "63212660012",
  branchCode: "255355",
  accountType: "Gold Business Account",
  branchName: "My Branch",
  swiftCode: "FIRNZAJJ",
};

function baseDefaultForEvent(eventId?: string | null): BankDetails {
  return eventId === LUNA_LUSA_EVENT_ID ? LUNA_LUSA_DEFAULT : WOMAN_OF_TASTE_DEFAULT;
}

// The base default bank details for an event before any admin override —
// what the admin panel's "Use the default" option displays.
export function getEventBaseDefault(eventId: string): BankDetails {
  return baseDefaultForEvent(eventId);
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
  return override ?? baseDefaultForEvent(eventId);
}
