async function youtubeUnsubscriber() {
    let delay = 300; //This is a fine speed , if you reduce it from 300 maybe bad things might happen.

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function unsubscribeFromChannel() {
        try {
            let unsubscribeButton = document.querySelector('.ytd-subscribe-button-renderer');
            if (!unsubscribeButton) {
                console.log("No unsubscribe button found, scrolling...");
                return false;
            }
            unsubscribeButton.click();

            await sleep(delay);

            let confirmButton = document.getElementById("confirm-button");
            if (!confirmButton) {
                console.log("No confirm button found, retrying...");
                return false;
            }
            confirmButton.click();

            await sleep(delay);

            return true;
        } catch (error) {
            console.error("Error during unsubscription:", error);
            return false;
        }
    }

    async function processUnsubscriptions() {
        while (true) {
            let count = document.querySelectorAll("ytd-channel-renderer:not(.ytd-item-section-renderer)").length;
            if (count === 0) {
                console.log("No more channels found, scrolling...");
                window.scrollTo(0, document.body.scrollHeight);
                await sleep(5000);
                count = document.querySelectorAll("ytd-channel-renderer:not(.ytd-item-section-renderer)").length;
                if (count === 0) {
                    console.log("No more channels to unsubscribe from.");
                    break;
                }
            }

            let success = await unsubscribeFromChannel();
            if (success) {
                let unsubscribedElement = document.querySelector("ytd-channel-renderer");
                if (unsubscribedElement && unsubscribedElement.parentNode) {
                    unsubscribedElement.parentNode.removeChild(unsubscribedElement);
                }
                console.log("Unsubscribed from a channel. Remaining count:", count - 1);
            } else {
                console.log("Retrying unsubscription...");
                await sleep(2000); 
            }
        }
    }

    processUnsubscriptions();
}

youtubeUnsubscriber();
