export default function createAlert(errorMessage: string) {
    const alertContainer = document.getElementById("alertContainer")!;
    const alertElement = document.createElement("div");
    alertElement.innerHTML = `<div id="alert" role="alert" class="fade d-flex align-items-center alert alert-primary alert-dismissible show sgds">
        <button type="button" class="btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close alert"></button>
        <i class="bi bi-exclamation-circle me-4"></i>
        <div>
            <div class="alert-heading h4">${errorMessage}</div>
        </div>
    </div>`;

    if (alertContainer.childElementCount > 0) {
        alertContainer.innerHTML = "";
    }
    alertContainer.appendChild(alertElement);
}
