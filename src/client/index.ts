import "@govtechsg/sgds/css/sgds.css";
import { Modal } from "bootstrap";

import createAlert from "./alert";

window.onload = () => {
    const form = document.getElementById("redemptionForm")!;
    form.onsubmit = async (e) => {
        e.preventDefault();

        const staffPassIdInput = document.getElementById(
            "staffPassId"
        )! as HTMLInputElement;
        const staffPassId = staffPassIdInput.value;
        const team = await fetch(
            `${document.location}staff/${staffPassId}`
        ).then((res) => res.json());
        if (!team["exists"]) {
            createAlert(team["message"]);
            return;
        }

        const teamId = team["teamId"];
        const redeemability = await fetch(
            `${document.location}redeem/${teamId}`
        ).then((res) => res.json());
        if (!redeemability["canRedeem"]) {
            createAlert(redeemability["message"]);
            return;
        }

        const confirmationModal = new Modal(
            document.getElementById("confirmationModal")!
        );

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
            if (!redemptionResult["redeemed"]) {
                createAlert(redemptionResult["message"]);
                return;
            } else {
                createAlert("Gift successfully redeemed!");
            }
            confirmationModal.hide();
        };

        confirmationModal.show();
    };
};
