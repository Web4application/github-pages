import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    // Uses GOOGLE_APPLICATION_CREDENTIALS if set, or default creds.
    // For local dev, you can pass a service account object here instead.
  });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authz = req.header("Authorization") || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing token" });
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
  } catch (e: any) {
    return res.status(401).json({ error: "Invalid token", details: e?.message });
  }
}
