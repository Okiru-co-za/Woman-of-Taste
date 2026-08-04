import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { adminSettingsTable } from "@workspace/db/schema";

function settingsKey(eventId: string): string {
  return `event_booking_open:${eventId}`;
}

// Admin override for whether an event accepts bookings, on top of the code
// default (Event.bookingOpen in woman-of-taste/src/data/events.ts). Null means
// "no override — use the code default."
export async function getBookingOpenOverride(eventId: string): Promise<boolean | null> {
  const [row] = await db.select().from(adminSettingsTable).where(eq(adminSettingsTable.key, settingsKey(eventId))).limit(1);
  if (!row) return null;
  return row.value === "true";
}

// Pass null to clear the override and revert to the code default.
export async function setBookingOpenOverride(eventId: string, open: boolean | null): Promise<void> {
  const key = settingsKey(eventId);
  if (open === null) {
    await db.delete(adminSettingsTable).where(eq(adminSettingsTable.key, key));
    return;
  }
  const [existing] = await db.select().from(adminSettingsTable).where(eq(adminSettingsTable.key, key)).limit(1);
  if (existing) {
    await db.update(adminSettingsTable).set({ value: String(open), updatedAt: new Date() }).where(eq(adminSettingsTable.key, key));
  } else {
    await db.insert(adminSettingsTable).values({ key, value: String(open) });
  }
}
