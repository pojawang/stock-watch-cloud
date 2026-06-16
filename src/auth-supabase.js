const crypto = require("node:crypto");
const { getSupabase } = require("./supabase");

const SESSION_COOKIE = "stockwatch_session";
const SESSION_HOURS = 8;

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashPassword(password, salt = randomToken(16)) {
  const hash = crypto.pbkdf2Sync(password, salt, 160000, 64, "sha512").toString("base64");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.password_salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.password_hash));
}

function parseCookies(header = "") {
  const cookies = {};
  header.split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index < 0) return;
    cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  });
  return cookies;
}

function cookie(token) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}`;
}

function clearCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    role: user.role,
    active: user.active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

async function ensureDefaultAdmin() {
  const supabase = getSupabase();
  const { data: existing, error: selectError } = await supabase.from("users").select("id").limit(1);
  if (selectError) throw selectError;
  if (existing.length) return;

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const { salt, hash } = hashPassword(password);
  const { error } = await supabase.from("users").insert({
    username: username.toLowerCase(),
    display_name: username,
    role: "admin",
    active: true,
    password_salt: salt,
    password_hash: hash,
  });
  if (error) throw error;
}

async function createSession(userId) {
  const supabase = getSupabase();
  const token = randomToken(32);
  const expires = new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
  const { error } = await supabase.from("sessions").insert({
    token_hash: hashText(token),
    user_id: userId,
    expires_at: expires,
  });
  if (error) throw error;
  return token;
}

async function getCurrentUser(event) {
  const token = parseCookies(event.headers.cookie || event.headers.Cookie || "")[SESSION_COOKIE];
  if (!token) return null;
  const supabase = getSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("sessions")
    .select("token_hash, users(*)")
    .eq("token_hash", hashText(token))
    .gt("expires_at", now)
    .maybeSingle();
  if (error) throw error;
  if (!data || !data.users || !data.users.active) return null;
  await supabase.from("sessions").update({
    expires_at: new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString(),
  }).eq("token_hash", data.token_hash);
  return data.users;
}

async function destroySession(event) {
  const token = parseCookies(event.headers.cookie || event.headers.Cookie || "")[SESSION_COOKIE];
  if (!token) return;
  const supabase = getSupabase();
  await supabase.from("sessions").delete().eq("token_hash", hashText(token));
}

async function requireUser(event, adminOnly = false) {
  const user = await getCurrentUser(event);
  if (!user) return { response: json(401, { ok: false, error: "請先登入。" }) };
  if (adminOnly && user.role !== "admin") return { response: json(403, { ok: false, error: "需要管理員權限。" }) };
  return { user };
}

module.exports = {
  hashPassword,
  verifyPassword,
  publicUser,
  ensureDefaultAdmin,
  createSession,
  destroySession,
  getCurrentUser,
  requireUser,
  cookie,
  clearCookie,
  json,
};
