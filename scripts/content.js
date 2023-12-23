setTimeout(() => {

    const isD2l = document.querySelector("body.d2l-body");

    let editableScore, overallGradeContainer, overallGradeInput, percDisplay,
        secondaryShadowHost, score, total, totalScoreShadowHost;

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

    const scorePercentage = (score, total) => {
        const percentage = (score / total) * 100;
        return percentage % 1 !== 0 ? percentage.toFixed(1) : percentage.toFixed(0);
    }

    const updatePercentDisplay = (tar, src) => {
        score = (src).getAttribute("value");
        total = ((src).getAttribute("unit")).replace("/ ", "");
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
        percContainer.style.marginTop = "10px";
        overallGradeContainer.insertAdjacentElement("afterend", percContainer);

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

        let percAmount, pointsAmount;
        percAmount = 10;
        pointsAmount = total/percAmount;

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
