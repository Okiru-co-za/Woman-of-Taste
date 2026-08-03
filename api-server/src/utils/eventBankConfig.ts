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

// Woman of Taste's own bank details are the one default for every event.
// La Femme by Luna Lusa settles through its own FNB account instead — but
// only once an admin explicitly sets that as a custom override for that one
// event from the Events tab, never as an automatic per-event default.
export function getEventBaseDefault(_eventId: string): BankDetails {
  return WOMAN_OF_TASTE_DEFAULT;
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
  return override ?? WOMAN_OF_TASTE_DEFAULT;
}
