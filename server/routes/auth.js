import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); // sets up a router

router.post("/login", login); // will be /auth/login bc of the route

export default router;