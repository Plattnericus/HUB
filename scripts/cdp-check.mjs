// Minimal CDP client (uses Node 24's global WebSocket) to load the app,
// capture console output + JS exceptions, then screenshot.
const BASE = process.argv[2] || "http://localhost:4321/";
const OUT = process.argv[3] || "/tmp/hub-shot.png";
const WAIT = Number(process.argv[4] || 7000);

const list = await (await fetch("http://localhost:9222/json")).json();
let target = list.find((t) => t.type === "page") || list[0];
if (!target) {
  console.error("no CDP target");
  process.exit(1);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
function send(method, params = {}) {
  return new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}
const logs = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.consoleAPICalled") {
    const txt = (msg.params.args || []).map((a) => a.value ?? a.description ?? a.type).join(" ");
    logs.push(`[${msg.params.type}] ${txt}`);
  } else if (msg.method === "Runtime.exceptionThrown") {
    const e = msg.params.exceptionDetails;
    logs.push(`[EXCEPTION] ${e.exception?.description || e.text}`);
  }
});
await new Promise((r) => (ws.onopen = r));
await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", {
  width: 1600,
  height: 1000,
  deviceScaleFactor: 2,
  mobile: false,
});
await send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-reduced-motion", value: process.env.REDUCED ? "reduce" : "no-preference" },
  ],
});
await send("Page.navigate", { url: BASE });
await new Promise((r) => setTimeout(r, WAIT));
const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot?.data) {
  const fs = await import("node:fs");
  fs.writeFileSync(OUT, Buffer.from(shot.data, "base64"));
  console.log("screenshot saved:", OUT);
}
console.log("=== CONSOLE (" + logs.length + ") ===");
for (const l of logs.slice(0, 40)) console.log(l);
ws.close();
process.exit(0);
