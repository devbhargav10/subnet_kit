import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./subnet.js", import.meta.url), "utf8");
const { parseIp } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("parseIp accepts valid dotted-decimal IPv4 addresses", () => {
  assert.deepEqual(parseIp("0.0.0.0"), [0, 0, 0, 0]);
  assert.deepEqual(parseIp("255.255.255.255"), [255, 255, 255, 255]);
  assert.deepEqual(parseIp(" 192.168.1.10 "), [192, 168, 1, 10]);
});

test("parseIp rejects empty and malformed octets", () => {
  for (const address of [
    "192..1.1",
    "192.168.1.",
    ".192.168.1",
    "...",
    "192.168.+1.1",
    "192.168. 1.1",
    "192.168.1.1000",
    "192.168.1.256",
    "192.168.1.-1",
  ]) {
    assert.equal(parseIp(address), null, `${address} should be rejected`);
  }
  assert.equal(parseIp(null), null);
});
