Game.registerMod("BetterCookieClicker", {

    init: function () {

        Game.Notify("BetterCookieClicker", "Loaded successfully", [16, 5], 5);

        if (window.ccGUI && ccGUI.cleanup) ccGUI.cleanup();

        window.ccGUI = {
            autoClick: false,
            autoGolden: false,
            autoBest: false,
            autoUpgrade: false,

            clickInt: null,
            goldenInt: null,
            bestInt: null,
            upgradeInt: null
        };

        // ============ GUI ============
        const gui = document.createElement("div");
        gui.style.position = "fixed";
        gui.style.top = "120px";
        gui.style.left = "120px";
        gui.style.width = "230px";
        gui.style.background = "#1e1e1e";
        gui.style.color = "#fff";
        gui.style.border = "2px solid #444";
        gui.style.borderRadius = "10px";
        gui.style.zIndex = "999999";
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
                            for (let s of Game.shimmers) if (s.type === "golden") s.pop();
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

        // ============ DRAG ============
        let drag = false, ox = 0, oy = 0;

        title.onmousedown = e => {
            drag = true;
            ox = e.clientX - gui.offsetLeft;
            oy = e.clientY - gui.offsetTop;
        };

        document.onmouseup = () => drag = false;

        document.onmousemove = e => {
            if (drag) {
                gui.style.left = (e.clientX - ox) + "px";
                gui.style.top = (e.clientY - oy) + "px";
            }
        };

        close.onclick = () => ccGUI.cleanup();

        // ============ RANDOM BUY ============
        function runAI() {

            const money = Game.cookies;
            const cps = Game.cookiesPs;

            let caps = {};
            let zeros = Math.floor(Math.log10(cps + 1));
            let cap = Math.min(20 + zeros * 10, 120);

            for (let n in Game.Objects) caps[n] = cap;

            let options = [];

            for (let n in Game.Objects) {
                let obj = Game.Objects[n];
                let price = obj.bulkPrice || obj.getPrice();

                if (price <= money && obj.amount < caps[n]) {
                    options.push(obj);
                }
            }

            if (!options.length) return;

            options[Math.floor(Math.random() * options.length)].buy();
        }

        // ============ CLEANUP ============
        ccGUI.cleanup = () => {
            clearInterval(ccGUI.clickInt);
            clearInterval(ccGUI.goldenInt);
            clearInterval(ccGUI.bestInt);
            clearInterval(ccGUI.upgradeInt);
            gui.remove();
        };

    },

    save: function () {
        return "";
    },

    load: function (str) {
        return true;
    }

});
