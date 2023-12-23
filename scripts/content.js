setTimeout(() => {

    const isD2l = document.querySelector("body.d2l-body");

    let editableScore, overallGradeContainer, overallGradeInput, percDisplay,
        secondaryShadowHost, score, total, totalScoreShadowHost;
    let percAmount = 10; // bump increment

    const decGrade = (el) => {
        const pointsAmount = Number(total/percAmount);
        const result = Number((el).value) - pointsAmount;
        (el).value = Math.max(0, result);
        (el).dispatchEvent(new Event("change", { bubbles: true }));
        (el).dispatchEvent(new Event("blur"));
    }

    const findElementInShadowDom = (root, target) => {

        let matchesTarget = root?.classList?.contains(target);

        if (matchesTarget) {
            return root;
        }

        if (root?.shadowRoot) {
            const foundInShadow = findElementInShadowDom(root.shadowRoot, target);
            if (foundInShadow) {
                return foundInShadow;
            }
        }

        if (root?.children) {
            for (const child of root.children) {
                const foundInChildren = findElementInShadowDom(child, target);
                if (foundInChildren) {
                    return foundInChildren;
                }
            }
        }

        return null;
    };

    const incGrade = (el) => {
        const pointsAmount = Number(total/percAmount);
        const result = Number((el).value) + pointsAmount;
        (el).value = Math.min(total, result);
        (el).dispatchEvent(new Event("change", { bubbles: true }));
        (el).dispatchEvent(new Event("blur"));
    }

    const scorePercentage = (score, total) => {
        const percentage = (score / total) * 100;
        return percentage % 1 !== 0 ? percentage.toFixed(1) : percentage.toFixed(0);
    }

    const updatePercentDisplay = (tar, src) => {
        score = Number((src).getAttribute("value"));
        total = Number(((src).getAttribute("unit")).replace("/ ", ""));
        (tar).textContent = score > 0 ? `${scorePercentage(score, total)}%` : `-%`;
    }

    if (isD2l) {

        const rootElement = document.querySelector("body.d2l-body");
        const outerShadowHost = document.querySelector("body.d2l-body").querySelector("d2l-consistent-evaluation");

        if(outerShadowHost) {
            const outerShadowRoot = outerShadowHost.shadowRoot;
            secondaryShadowHost = outerShadowRoot.querySelector("d2l-consistent-evaluation-page");
        }

        /* ------------------------------------------------------------- */
        /* percentage display                                            */
        /* ------------------------------------------------------------- */

        // find top Total Score container
        if (findElementInShadowDom(rootElement, "out-of-score-container")) {
            totalScoreShadowHost = findElementInShadowDom(rootElement, "out-of-score-container");
            editableScore = totalScoreShadowHost.querySelector("d2l-rubric-editable-score");
            editableScore = editableScore.shadowRoot;
            editableScore = editableScore.querySelector(".editable-container");
            editableScore = editableScore.querySelector("#input-container")
            editableScore = editableScore.querySelector(".total-score-container");
            editableScore = editableScore.querySelector(".editing-component input");
        }

        // find Overall Grade container 
        if (findElementInShadowDom(rootElement, "d2l-grade-result-presentational-container")) {
            overallGradeContainer = findElementInShadowDom(rootElement, "d2l-grade-result-presentational-container");
        }

        // find Overall Grade input
        if (findElementInShadowDom(secondaryShadowHost, "d2l-grade-result-numeric-score-score")) {
            overallGradeInput = findElementInShadowDom(secondaryShadowHost, "d2l-grade-result-numeric-score-score");
            overallGradeInput = overallGradeInput.querySelector("d2l-form");
            overallGradeInput = overallGradeInput.querySelector("d2l-input-number");
        }

        // build Percentager container
        const percContainer = document.createElement("div");
        percContainer.classList.add("brightspace-percentager");
        percContainer.style.marginTop = "5px";
        overallGradeContainer.insertAdjacentElement("afterend", percContainer);

        // heading
        const heading = document.createElement("h3");
        heading.classList.add("d2l-label-text");
        heading.classList.add("d2l-skeletize");
        heading.style.fontSize = "0.75em";
        heading.style.marginTop = "0";
        heading.style.marginBottom = "0.3em";
        heading.textContent = "Adjust grade";
        percContainer.appendChild(heading);

        // build percentage display
        percDisplay = document.createElement("span");
        percDisplay.style.cursor = "default";
        percDisplay.style.fontSize = "0.85em";
        percDisplay.style.margin = "0 0.5rem";
        updatePercentDisplay(percDisplay, overallGradeInput);
        overallGradeContainer.insertBefore(percDisplay, overallGradeContainer.children[1]); // after first child

        /* ------------------------------------------------------------- */
        /* percentage bumper                                             */
        /* ------------------------------------------------------------- */

        // wrapper
        const percWrapper = document.createElement("div");
        percWrapper.classList.add("wrapper");
        percWrapper.style.display = "flex";
        percContainer.appendChild(percWrapper);

        // percDecrease
        percDecrease = document.createElement("button");
        percDecrease.innerHTML = "&minus;";
        percDecrease.style.cursor = "pointer";
        percDecrease.style.width = "4ch";
        percDecrease.addEventListener("click", () => { decGrade(editableScore) });
        percWrapper.appendChild(percDecrease);

        // input
        percField = document.createElement("input");
        percField.setAttribute("name", "percentager-percent");
        percField.max = 100;
        percField.min = 0;
        percField.style.borderColor = "#666";
        percField.style.borderRadius = "5px";
        percField.style.borderStyle = "solid";
        percField.style.borderWidth = "1px";
        percField.style.fontFamily = "'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
        percField.style.fontSize = "0.8em";
        percField.style.marginRight = "1px";
        percField.style.marginLeft = "1px";
        percField.style.maxWidth = "6ch";
        percField.style.maxWidth = "4.5ch";
        percField.style.padding = "0.25em 0.225em";
        percField.type = "number";
        percField.value = percAmount;
        percWrapper.appendChild(percField);

        // percIncrease
        percIncrease = document.createElement("button");
        percIncrease.innerHTML = "&plus;";
        percIncrease.style.borderColor = "#666";
        percIncrease.style.borderRadius = "5px";
        percIncrease.style.borderStyle = "solid";
        percIncrease.style.borderWidth = "1px";
        percIncrease.style.cursor = "pointer";
        percIncrease.style.width = "4ch";
        percIncrease.addEventListener("click", () => { incGrade(editableScore) });
        percWrapper.appendChild(percIncrease);

        /* ------------------------------------------------------------- */
        /* watch elements for changes                                    */
        /* ------------------------------------------------------------- */

        if (overallGradeInput) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        updatePercentDisplay(percDisplay, overallGradeInput);
                    }
                });
            });
        
            observer.observe(overallGradeInput, { attributes: true });
        }

    }

}, 4000);
