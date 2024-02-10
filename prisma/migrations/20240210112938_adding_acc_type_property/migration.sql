/*
  Warnings:

  - Added the required column `name` to the `SavingsAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `SavingsAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CheckingAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CheckingAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavingsAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "SavingsAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavingsAccount" ("balance", "id", "userId") SELECT "balance", "id", "userId" FROM "SavingsAccount";
DROP TABLE "SavingsAccount";
ALTER TABLE "new_SavingsAccount" RENAME TO "SavingsAccount";
CREATE TABLE "new_CheckingAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "CheckingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CheckingAccount" ("balance", "id", "userId") SELECT "balance", "id", "userId" FROM "CheckingAccount";
DROP TABLE "CheckingAccount";
ALTER TABLE "new_CheckingAccount" RENAME TO "CheckingAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
