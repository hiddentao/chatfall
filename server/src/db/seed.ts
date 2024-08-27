import { faker } from "@faker-js/faker"
// src/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { env } from "../env"
import {
  type CommentToInsert,
  type UserToInsert,
  commentRatings,
  comments,
  posts,
  settings,
  users,
} from "./schema.ts"

const main = async () => {
  const client = new Pool({
    connectionString: env.DATABASE_URL,
  })
  const db = drizzle(client)

  console.log("Seed start")

  console.log("--> Delete existing data")

  await db.delete(commentRatings)
  await db.delete(comments)
  await db.delete(posts)
  await db.delete(users)
  await db.delete(settings)

  console.log("--> Insert users")

  const userData: UserToInsert[] = []
  for (let i = 0; i < 20; i++) {
    userData.push({
      name: faker.internet.userName(),
      email: faker.internet.email(),
    })
  }
  await db.insert(users).values(userData)

  const uList = (
    await db
      .select({
        id: users.id,
      })
      .from(users)
  ).map((u) => u.id)

  console.log("--> Insert posts")

  await db.insert(posts).values([
    {
      title: "test",
      url: "test",
    },
  ])
  const p = (await db.select().from(posts).limit(1))[0]

  console.log("--> Insert comments")

  const commentData: CommentToInsert[] = []
  for (let i = 1; i <= 20; i++) {
    commentData.push({
      userId: uList[faker.number.int({ min: 0, max: uList.length - 1 })],
      postId: p.id,
      body: faker.lorem.paragraph(),
      path: `${i}`,
      rating: faker.number.int({ min: 0, max: 100 }),
      reply_count: i === 1 ? 20 : 0,
      status: Math.random() > 0.9 ? "flagged" : "shown",
      createdAt: faker.date
        .between({
          from: "2023-01-01T00:00:00.000Z",
          to: "2023-02-01T00:00:00.000Z",
        })
        .toUTCString(),
    })
  }

  for (let depth = 1; depth <= 5; depth++) {
    const pathPrefixStr = Array.from({ length: depth }, (_) => "1").join(".")
    for (let j = 1; j <= 20; j++) {
      commentData.push({
        userId: uList[faker.number.int({ min: 0, max: uList.length - 1 })],
        postId: p.id,
        body: faker.lorem.paragraph(),
        depth: depth,
        path: `${pathPrefixStr}.${j}`,
        reply_count: j === 1 && depth < 5 ? 20 : 0,
        rating: faker.number.int({ min: 0, max: 100 }),
        status: j > 1 && Math.random() > 0.9 ? "flagged" : "shown",
        createdAt: faker.date
          .between({
            from: new Date(2023, depth + 1, 1),
            to: new Date(2023, depth + 2, 1),
          })
          .toUTCString(),
      })
    }
  }
  await db.insert(comments).values(commentData)

  console.log("Seed done")

  client.end()
}

main()
