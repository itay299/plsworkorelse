Game.registerMod("BetterCookieClicker", {

    init: function () {

        Game.Notify("BetterCookieClicker", "Loaded (press ; for GUI)", [16, 5], 3);

        window.ccGUI = window.ccGUI || {
            gui: null,
            initialized: false,

            autoClick: false,
            autoGolden: false,
            autoBest: false,
            autoUpgrade: false,

            clickInt: null,
            goldenInt: null,
            bestInt: null,
            upgradeInt: null
        };

        document.addEventListener("keydown", (e) => {
            if (e.key === ";") {
                if (!ccGUI.initialized) {
                    buildGUI();
                    ccGUI.initialized = true;
                } else {
                    ccGUI.gui.style.display =
                        ccGUI.gui.style.display === "none" ? "block" : "none";
                }
            }
        });

        function buildGUI() {

            const gui = document.createElement("div");
            ccGUI.gui = gui;

            gui.style.position = "fixed";
            gui.style.top = "120px";
            gui.style.left = "120px";
            gui.style.width = "230px";
            gui.style.background = "#1e1e1e";
            gui.style.color = "#fff";
            gui.style.border = "2px solid #444";
            gui.style.borderRadius = "10px";
            gui.style.zIndex = "2147483647";
            gui.style.fontFamily = "Arial";

            const title = document.createElement("div");
            title.style.padding = "8px";
            title.style.cursor = "move";
            title.style.background = "#2a2a2a";
            title.innerText = "Better Cookie Clicker";

            const close = document.createElement("span");
            close.innerText = "✖";
            close.style.float = "right";
            close.style.cursor = "pointer";
            title.appendChild(close);

            gui.appendChild(title);

            const content = document.createElement("div");
            content.style.padding = "10px";
            gui.appendChild(content);

            // ================= TOGGLES =================
            function toggle(name, key) {
                const btn = document.createElement("button");

                function update() {
                    btn.innerText = `${name}: ${ccGUI[key] ? "ON" : "OFF"}`;
                    btn.style.background = ccGUI[key] ? "#2ecc71" : "#3a3a3a";
                    btn.style.width = "100%";
                    btn.style.marginBottom = "8px";
                    btn.style.border = "none";
                    btn.style.borderRadius = "6px";
                    btn.style.padding = "6px";
                    btn.style.color = "#fff";
                }

                btn.onclick = () => {
                    ccGUI[key] = !ccGUI[key];

                    if (key === "autoClick") {
                        if (ccGUI.autoClick)
                            ccGUI.clickInt = setInterval(() => Game.ClickCookie(), 10);
                        else clearInterval(ccGUI.clickInt);
                    }

                    if (key === "autoGolden") {
                        if (ccGUI.autoGolden)
                            ccGUI.goldenInt = setInterval(() => {
                                for (let s of Game.shimmers)
                                    if (s.type === "golden") s.pop();
                            }, 500);
                        else clearInterval(ccGUI.goldenInt);
                    }

                    if (key === "autoBest") {
                        if (ccGUI.autoBest)
                            ccGUI.bestInt = setInterval(runAI, 800);
                        else clearInterval(ccGUI.bestInt);
                    }

                    if (key === "autoUpgrade") {
                        if (ccGUI.autoUpgrade)
                            ccGUI.upgradeInt = setInterval(() => {
                                for (let u of Game.UpgradesInStore) {
                                    if (u.getPrice() <= Game.cookies) {
                                        u.buy();
                                        break;
                                    }
                                }
                            }, 1000);
                        else clearInterval(ccGUI.upgradeInt);
                    }

                    update();
                };

                update();
                content.appendChild(btn);
            }

            toggle("Auto Click", "autoClick");
            toggle("Auto Golden", "autoGolden");
            toggle("Auto Buy", "autoBest");
            toggle("Auto Upgrade", "autoUpgrade");

            document.body.appendChild(gui);

            // ================= CLOSE FIX =================
            close.onclick = () => {
                gui.style.display = "none";
            };

            // ================= DRAG FIX =================
            let drag = false, ox = 0, oy = 0;

            title.onmousedown = (e) => {
                drag = true;
                ox = e.clientX - gui.offsetLeft;
                oy = e.clientY - gui.offsetTop;
            };

            document.onmouseup = () => drag = false;

            document.onmousemove = (e) => {
                if (drag) {
                    gui.style.left = (e.clientX - ox) + "px";
                    gui.style.top = (e.clientY - oy) + "px";
                }
            };
        }

        // ================= RANDOM BUY =================
        function runAI() {

            const money = Game.cookies;
            const cps = Game.cookiesPs;

            let cap = Math.min(20 + Math.floor(Math.log10(cps + 1)) * 10, 120);

            let options = [];

            for (let n in Game.Objects) {
                let obj = Game.Objects[n];
                let price = obj.bulkPrice || obj.getPrice();

                if (price <= money && obj.amount < cap) {
                    options.push(obj);
                }
            }

            if (!options.length) return;

            options[Math.floor(Math.random() * options.length)].buy();
        }

    }

});
