-- CreateTable
CREATE TABLE "public"."cards" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "page" TEXT NOT NULL,
    "numericalOrder" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "image" TEXT,
    "backgroundColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."title_pages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "page" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "title_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meta_data" (
    "id" SERIAL NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "page" TEXT NOT NULL,

    CONSTRAINT "meta_data_pkey" PRIMARY KEY ("id")
);
