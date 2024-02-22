/**
 * Updates hint text under the text input to give feedback to user
 *
 * @param message Message to display to user
 * @param success Toggle color of message
 */
export default function updateHint(message: string, success: boolean) {
    const redemptionMessage = document.getElementById("redemptionMessage")!;
    redemptionMessage.innerText = message;
    redemptionMessage.style.display = "block";

    if (success) {
        redemptionMessage.classList.remove("text-red-600");
        redemptionMessage.classList.add("text-green-400");
    } else {
        redemptionMessage.classList.remove("text-green-400");
        redemptionMessage.classList.add("text-red-600");
    }
}
