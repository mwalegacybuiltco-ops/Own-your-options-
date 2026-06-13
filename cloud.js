const cloudConfigKey = "oyo-cloud-config";
const sessionKey = "oyo-cloud-session";
const defaultCloudConfig = {
  url: "https://tuhxctvpljfqgakfspjb.supabase.co",
  anonKey: "sb_publishable_a18abo02gPh5mmDt_lZ2Wg_wSiUpKL2"
};

export function getCloudConfig() {
  return JSON.parse(localStorage.getItem(cloudConfigKey) || "null") || defaultCloudConfig;
}

export function saveCloudConfig(url, anonKey) {
  localStorage.setItem(cloudConfigKey, JSON.stringify({ url: url.replace(/\/$/, ""), anonKey }));
}

export function clearCloudConfig() {
  localStorage.removeItem(cloudConfigKey);
  localStorage.removeItem(sessionKey);
}

export function getSession() {
  return JSON.parse(localStorage.getItem(sessionKey) || "null");
}

async function request(path, options = {}, useSession = false) {
  const config = getCloudConfig();
  if (!config) throw new Error("Cloud is not connected");
  const session = getSession();
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${useSession && session?.access_token ? session.access_token : config.anonKey}`,
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.msg || error.message || error.error_description || "Cloud request failed");
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function testConnection() {
  await request("/auth/v1/settings");
  return true;
}

export async function signIn(email, password) {
  const session = await request("/auth/v1/token?grant_type=password", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password })
  });
  localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export async function signUp(email, password, name) {
  return request("/auth/v1/signup", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, data: { name } })
  });
}

export function signOut() {
  localStorage.removeItem(sessionKey);
}

export async function fetchContent() {
  return request("/rest/v1/oyo_content?select=*&order=created_at.desc", {}, true);
}

export async function upsertContent(item) {
  const record = { ...item };
  delete record.fileName;
  return request("/rest/v1/oyo_content?on_conflict=id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record)
  }, true);
}

export async function removeContent(id) {
  return request(`/rest/v1/oyo_content?id=eq.${id}`, { method: "DELETE" }, true);
}

export async function uploadFile(file) {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  await request(`/storage/v1/object/oyo-content/${safeName}`, {
    method: "POST", headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "true" }, body: file
  }, true);
  return safeName;
}

export async function createFileLink(path) {
  if (!path) return "";
  const result = await request(`/storage/v1/object/sign/oyo-content/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expiresIn: 3600 })
  }, true);
  const config = getCloudConfig();
  return `${config.url}/storage/v1${result.signedURL}`;
}
