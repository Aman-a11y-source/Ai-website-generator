import { integer, pgTable, varchar,timestamp, json, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(2),
});

export const projectTable = pgTable("project",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId:varchar().unique(),
    createdBy:varchar(),
    createdOn:timestamp().defaultNow()
})
export const frameTable = pgTable("frames",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    frameId:varchar().unique(),
    designCode:text(),
    projectId:varchar(),
    createdOn:timestamp().defaultNow()
})

export const chatTable=pgTable("chats",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    chatMessage:json(),
    frameId:varchar(),
    createdBy:varchar().references(()=>usersTable.email),
    createdOn:timestamp().defaultNow()
})