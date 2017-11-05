"use strict";

const gInterface = (function () {

    let AskToLogin = function () {
        gInterface.showError("Please login to continue.");
    };

    return {
        bindEvents: function () {
            let self = this;
            $("#question_form").on("submit", function (e) {
                e.preventDefault();
                if (socketModule.isConnected()) {
                    let $questionInput = $(e.target).find("input#question");
                    socketModule.sendQuestion($questionInput.val());
                    $questionInput.val("");
                } else {
                    AskToLogin();
                }
            })
        },
        showError: function (error) {
            let $errorModal = $("#errorModal");
            $errorModal.find(".modal-content").text(error);
            $errorModal.modal("show");
        },
        addThread: function (threadHTML) {
            $("#threads").append(threadHTML);
        }
    }
})();

$(document).ready(function () {
    gInterface.bindEvents();
});