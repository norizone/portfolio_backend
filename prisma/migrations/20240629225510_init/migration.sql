-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "permission" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "order" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "toolName" TEXT NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "order" SERIAL NOT NULL,
    "permission" INTEGER NOT NULL DEFAULT 3,
    "publication" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "archiveImg" TEXT NOT NULL,
    "comment" TEXT,
    "url" TEXT,
    "gitUrl" TEXT,
    "role" TEXT NOT NULL,
    "singleImgMain" TEXT NOT NULL,
    "singleImgSub" TEXT NOT NULL,
    "singleImgSub2" TEXT,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_order_key" ON "Tool"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_toolName_key" ON "Tool"("toolName");

-- CreateIndex
CREATE UNIQUE INDEX "Work_order_key" ON "Work"("order");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkTools_AB_unique" ON "_WorkTools"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkTools_B_index" ON "_WorkTools"("B");

-- AddForeignKey
ALTER TABLE "_WorkTools" ADD CONSTRAINT "_WorkTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkTools" ADD CONSTRAINT "_WorkTools_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
