import "@govtechsg/sgds/css/sgds.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap";

import updateHint from "./hint";
import updateModal from "./modal";

window.onload = () => {
    const form = document.getElementById("redemptionForm")!;
    form.onsubmit = async (e) => {
        e.preventDefault();

        // clear previous message
        const redemptionMessage = document.getElementById("redemptionMessage")!;
        redemptionMessage.style.display = "none";

        // GET the staff's team
        const staffPassIdInput = document.getElementById(
            "staffPassId"
        )! as HTMLInputElement;
        const staffPassId = staffPassIdInput.value;
        const team = await fetch(
            `${document.location}staff/${staffPassId}`
        ).then((res) => res.json());
        if (!team["exists"]) {
            updateHint(team["message"], false);
            return;
        }

        // GET the eligiblity of the staff's team
        const teamId = team["teamId"];
        const teamName = team["teamName"];
        const redeemability = await fetch(
            `${document.location}redeem/${teamId}`
        ).then((res) => res.json());
        if (!redeemability["canRedeem"]) {
            updateHint(redeemability["message"], false);
            return;
        }

        // Redeem
        updateModal(staffPassId, teamId, teamName);
    };
};
