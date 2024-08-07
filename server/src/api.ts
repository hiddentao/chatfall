import Elysia from "elysia";
import { commentsRoutes } from "./routes/comments";

export const api = new Elysia({
	prefix: "/api",
}).use(commentsRoutes);
