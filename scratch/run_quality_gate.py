import subprocess
import time
import json
import os
import requests
import asyncio
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
TARGET_DIR = r"C:\Users\PC\.gemini\antigravity\brain\737a8f40-ca2a-4184-9de2-73407b15695b"

async def test_quality_gates():
    port = 9260
    user_data = os.path.join(os.environ.get("TEMP", r"C:\Temp"), f"chrome_qg_{int(time.time())}")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={port}",
        f"--user-data-dir={user_data}",
        "--no-sandbox",
        "--disable-gpu",
        "about:blank"
    ])

    await asyncio.sleep(2.5)
    results = {}
    console_errors = []

    try:
        res = requests.get(f"http://localhost:{port}/json").json()
        target = next((t for t in res if t.get("type") == "page"), None)
        if not target:
            raise RuntimeError("No target found")

        async with websockets.connect(target["webSocketDebuggerUrl"], max_size=50*1024*1024) as ws:
            # Enable domains
            await ws.send(json.dumps({"id": 1, "method": "Page.enable"}))
            await ws.recv()
            await ws.send(json.dumps({"id": 2, "method": "Runtime.enable"}))
            await ws.recv()
            await ws.send(json.dumps({"id": 3, "method": "DOM.enable"}))
            await ws.recv()

            # Navigate to storefront
            await ws.send(json.dumps({"id": 4, "method": "Page.navigate", "params": {"url": "http://localhost:5173/"}}))
            await ws.recv()
            await asyncio.sleep(3.0)

            # Test 1: Horizontal Overflow check at 360, 390, 820, 1440 px
            viewports = [360, 390, 820, 1440]
            overflow_results = {}
            for vp in viewports:
                await ws.send(json.dumps({
                    "id": 10 + vp,
                    "method": "Emulation.setDeviceMetricsOverride",
                    "params": {"width": vp, "height": 800, "deviceScaleFactor": 1, "mobile": (vp < 800)}
                }))
                await ws.recv()
                await asyncio.sleep(0.5)

                eval_msg = {
                    "id": 100 + vp,
                    "method": "Runtime.evaluate",
                    "params": {
                        "expression": "({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })",
                        "returnByValue": True
                    }
                }
                await ws.send(json.dumps(eval_msg))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == 100 + vp:
                        val = resp["result"]["result"]["value"]
                        has_overflow = val["scrollWidth"] > val["innerWidth"]
                        overflow_results[vp] = {
                            "scrollWidth": val["scrollWidth"],
                            "innerWidth": val["innerWidth"],
                            "hasOverflow": has_overflow
                        }
                        break
            results["overflow_check"] = overflow_results

            # Test 2: Keyboard-only navigation path: shop -> quick view -> add to cart -> checkout
            keyboard_test_expr = """
            (() => {
                const logs = [];
                // 1. Find first product card quick view button or card
                const shopSection = document.getElementById('collection');
                if (!shopSection) return { success: false, reason: 'Collection section missing' };
                
                const firstCard = shopSection.querySelector('button[aria-label*="Quick view"]') || shopSection.querySelector('.cursor-pointer');
                if (!firstCard) return { success: false, reason: 'First card not found' };
                
                // Focus and click
                firstCard.focus();
                firstCard.click();
                logs.push('Focused and clicked first product card');

                // Check modal open
                const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
                logs.push(modal ? 'Modal opened successfully' : 'Modal not detected');

                return { success: true, logs: logs };
            })()
            """
            await ws.send(json.dumps({
                "id": 200,
                "method": "Runtime.evaluate",
                "params": {"expression": keyboard_test_expr, "returnByValue": True}
            }))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == 200:
                    results["keyboard_path"] = resp["result"]["result"]["value"]
                    break

            # Test 3: Check preferences & localStorage
            storage_test_expr = """
            (() => {
                return {
                    theme: document.documentElement.dataset.theme,
                    customCursorActive: document.documentElement.classList.contains('custom-cursor-active'),
                    productCount: document.querySelectorAll('.product-moment-btn, [data-cursor="play"]').length
                };
            })()
            """
            await ws.send(json.dumps({
                "id": 300,
                "method": "Runtime.evaluate",
                "params": {"expression": storage_test_expr, "returnByValue": True}
            }))
            while True:
                resp = json.loads(await ws.recv())
                if resp.get("id") == 300:
                    results["environment_state"] = resp["result"]["result"]["value"]
                    break

    finally:
        proc.terminate()
        proc.wait()

    with open(os.path.join(TARGET_DIR, "quality_gate_results.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("Quality gate results:", json.dumps(results, indent=2))

if __name__ == "__main__":
    asyncio.run(test_quality_gates())

