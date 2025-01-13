/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_alias_key" ON "Link"("alias");
