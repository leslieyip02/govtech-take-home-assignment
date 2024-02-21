import { Modal } from "bootstrap";

import updateHint from "./hint";

export default function updateModal(
    staffPassId: string,
    teamId: number,
    teamName: string
) {
    const confirmationModal = new Modal(
        document.getElementById("confirmationModal")!
    );
    const confirmationLabelText = document.getElementById(
        "confirmationModalLabelText"
    )!;
    confirmationLabelText.innerText = `Redeeming for Team ${teamName}`;

    const redemptionButton = document.getElementById("redemptionButton")!;
    redemptionButton.onclick = async (_) => {
        const redemptionBody = {
            staffPassId: staffPassId,
            teamId: teamId,
        };
        const redemptionResult = await fetch(
            `${document.location}redeem/${teamId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(redemptionBody),
            }
        ).then((res) => res.json());
        if (redemptionResult["success"]) {
            updateHint("Gift successfully redeemed!", true);
        } else {
            updateHint(redemptionResult["message"], false);
        }
        confirmationModal.hide();
    };

    confirmationModal.show();
}
