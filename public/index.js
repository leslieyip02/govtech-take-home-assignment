"use strict";
window.onload = () => {
    const form = document.getElementById("redemptionForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        const staffPassIdInput = document.getElementById("staffPassId");
        fetch(`${document.location}redeem/${staffPassIdInput.value}`)
            .then((res) => res.json())
            .then((data) => {
            console.log(data);
            if (data["canRedeem"] === true) {
            }
        });
    };
};
