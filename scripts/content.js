setTimeout(() => {

    // find the contextBar that contains the learner details
    const isD2l = document.querySelector("body.d2l-body");

    // put on your DOM trunks, we're going for a swim
    if (isD2l) {
        const outerShadowHost = document.querySelector("body.d2l-body").querySelector("d2l-consistent-evaluation");
        const outerShadowRoot = outerShadowHost.shadowRoot;
        const secondaryShadowHost = outerShadowRoot.querySelector("d2l-consistent-evaluation-page");
        const secondaryShadowRoot = secondaryShadowHost.shadowRoot;
        const secondaryPrimary = secondaryShadowRoot.querySelector("d2l-template-primary-secondary");
        const secondarySlot = secondaryPrimary.querySelector("div[slot='secondary']");
        const constEvalRightPanelShadowHost = secondarySlot.querySelector("consistent-evaluation-right-panel");
        const constEvalRightPanelShadowRoot = constEvalRightPanelShadowHost.shadowRoot;
        const constEvalRightPanel = constEvalRightPanelShadowRoot.querySelector(".d2l-consistent-evaluation-right-panel");
        const constEvalRightPanelEval = constEvalRightPanel.querySelector(".d2l-consistent-evaluation-right-panel-evaluation");
        const constEvalRightPanelEvalShadowHost = constEvalRightPanelEval.querySelector("consistent-evaluation-right-panel-evaluation");
        const constEvalRightPanelEvalShadowRoot = constEvalRightPanelEvalShadowHost.shadowRoot;
        const constEvalRightPanelBlock = constEvalRightPanelEvalShadowRoot.querySelector("div > d2l-consistent-evaluation-right-panel-block:nth-child(2)");
        const gradeResultShadowHost = constEvalRightPanelBlock.querySelector("d2l-consistent-evaluation-right-panel-grade-result");
        const gradeResultShadowRoot = gradeResultShadowHost.shadowRoot;
        const scoreElement = gradeResultShadowRoot.querySelector("d2l-labs-d2l-grade-result-presentational");

        // build the percentage element
        const score = scoreElement.getAttribute("scorenumerator");
        const total = scoreElement.getAttribute("scoredenominator");

        scorePercentage = (score) => {
            return (score/total)*100
        }

        const percentageElement = document.createElement("small");
        percentageElement.classList.add("brightspace-percenter"); // add class to leverage to show we have modified the DOM
        percentageElement.style.display = "inline-block";
        percentageElement.style.fontSize = "0.75em";
        percentageElement.style.textAlign = "right";
        percentageElement.style.width = "100px";
        percentageElement.appendChild(document.createTextNode('-%'));
        scoreElement.insertAdjacentElement("afterend", percentageElement);

        // watch the a change to the score
        if (scoreElement) {
            // Create a new Mutation Observer and specify a callback function
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    // Check if the attribute we're interested in has changed
                    if (mutation.type === 'attributes' && mutation.attributeName === 'scorenumerator') {
                        const newScore = scoreElement.getAttribute('scorenumerator');
                        percentageElement.innerHTML = `${scorePercentage(newScore)}%`;
                    }
                });
            });
        
            // Configure the Mutation Observer to watch for attribute changes
            observer.observe(scoreElement, { attributes: true });
        }

    }

}, 4000);
