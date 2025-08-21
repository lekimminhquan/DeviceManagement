-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('admin', 'employee');

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "phone_number" VARCHAR(50),
    "address" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100),
    "name" VARCHAR(255),
    "model" VARCHAR(255),
    "year_of_production" VARCHAR(50),
    "price" DECIMAL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "price" DECIMAL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "password" VARCHAR(255),
    "type" "public"."UserType",
    "avatar" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "service_id" UUID,
    "customer_id" UUID,
    "user_id" UUID,
    "total_price" DECIMAL,
    "note" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenances" (
    "id" UUID NOT NULL,
    "order_id" UUID,
    "date_maintenance" TIMESTAMPTZ,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "maintenance_id" UUID,
    "note" TEXT,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenances" ADD CONSTRAINT "maintenances_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_logs" ADD CONSTRAINT "maintenance_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_logs" ADD CONSTRAINT "maintenance_logs_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "public"."maintenances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
