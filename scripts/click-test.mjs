// Navigate, wait, click at (x,y) CSS px, wait, screenshot. Validates raycasting + overlay.
const URL = process.argv[2];
const OUT = process.argv[3];
const X = Number(process.argv[4]);
const Y = Number(process.argv[5]);
const WAIT = Number(process.argv[6] || 16000);

const list = await (await fetch("http://localhost:9222/json")).json();
const target = list.find((t) => t.type === "page") || list[0];
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
const logs = [];
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  } else if (m.method === "Runtime.exceptionThrown") {
    logs.push("[EXCEPTION] " + (m.params.exceptionDetails.exception?.description || ""));
  }
});
await new Promise((r) => (ws.onopen = r));
await send("Runtime.enable");
await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1000, deviceScaleFactor: 2, mobile: false });
await send("Page.navigate", { url: URL });
await new Promise((r) => setTimeout(r, WAIT));
async function click(x, y) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await new Promise((r) => setTimeout(r, 300));
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}
await click(X, Y);
await new Promise((r) => setTimeout(r, 1500));
const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot?.data) {
  const fs = await import("node:fs");
  fs.writeFileSync(OUT, Buffer.from(shot.data, "base64"));
  console.log("saved", OUT);
}
console.log("exceptions:", logs.length, logs.slice(0, 5).join(" | "));
ws.close();
process.exit(0);
