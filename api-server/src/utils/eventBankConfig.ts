export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  branchName: string;
  swiftCode: string;
}

const WOMAN_OF_TASTE_DEFAULT: BankDetails = {
  bankName: "Investec Bank Limited",
  accountName: "Woman of Taste",
  accountNumber: "10013145814",
  branchCode: "580105",
  accountType: "Current Account",
  branchName: "100 Grayston Drive, Sandton",
  swiftCode: "IVESZAJJ",
};

// La Femme by Luna Lusa settles through its own FNB account (BANK_* env vars
// on Railway) rather than Woman of Taste's default Investec account above.
// Scoped to this one event ID so setting those env vars doesn't redirect
// payment for every other event too.
const LUNA_LUSA_EVENT_ID = "la-femme-luna-lusa-aug-2026";

function lunaLusaBankDetails(): BankDetails {
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

export function getBankDetailsForEvent(eventId?: string | null): BankDetails {
  return eventId === LUNA_LUSA_EVENT_ID ? lunaLusaBankDetails() : WOMAN_OF_TASTE_DEFAULT;
}
