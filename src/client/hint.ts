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
