import { pgTable, serial, varchar, text, decimal, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);
export const statusEnum = pgEnum('status', ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']);

export const userTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    role: roleEnum('role').default('USER'),
    password: varchar('password', { length: 256 }).notNull(),
    defaultShippingAddress: integer('default_shipping_address'),
    defaultBillingAddress: integer('default_billing_address')
});

export type User = InferSelectModel<typeof userTable>;

export const addressTable = pgTable('addresses', {
    id: serial('id').primaryKey(),
    firstLine: varchar('first_line', { length: 256 }),
    city: varchar('city', { length: 256 }),
    country: varchar('country', { length: 256 }),
    pincode: varchar('pincode', { length: 20 }),
    userId: integer('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
});

export const productTable = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }),
    tags: text('tags'),
});

export const cartItemsTable = pgTable('cart_items', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => productTable.id, { onDelete: 'cascade' }),
    quantity: integer('quantity'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const orderTable = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
    netAmount: decimal('net_amount', { precision: 10, scale: 2 }),
    address: text('address'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const orderProductTable = pgTable('order_products', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orderTable.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => productTable.id, { onDelete: 'cascade' }),
    quantity: integer('quantity'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const orderEventTable = pgTable('order_events', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orderTable.id, { onDelete: 'cascade' }),
    status: statusEnum('status').default('PENDING'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});