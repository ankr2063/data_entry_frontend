u = {
    backgroundScroll: $("body").css("overflow"),
    basePages: [],
    recogniseThesePhrases: [],
    recognizingVoice: false,
    recognition: '',
    additionalClasses: {
        notice: {
            showNotice: ''
        },
        alert: {
            showSuccess: '',
            showError: '',
            showHint: ''
        },
        toast: {
            showSuccess: '',
            showError: '',
            showInfo: '',
            showWarning: ''
        },
        modal: {
            openModal: ''
        }
    },

    // Doc Done
    supportingFunctions: {
        isIframe: () => {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },
        pageChangeActions: (url, createHistory = true) => {
            $(".loadingPage").remove();
            $(".loadingPageAtBack").remove();
            if (createHistory) {
                window.history.pushState(null, null, url);
            } else {
                window.history.replaceState(null, null, url);
            }
        },
        setContainers: () => {
            if ($('.uContainerTopCenter').length == 0) {
                $('body').append("<div id='uContainerTopCenter' class='uContainerTopCenter'></div>");
            }
            if ($('.uContainerTopRight').length == 0) {
                $('body').append("<div id='uContainerTopRight' class='uContainerTopRight'></div>");
            }
            if ($('.uContainerTopLeft').length == 0) {
                $('body').append("<div id='uContainerTopLeft' class='uContainerTopLeft'></div>");
            }
            if ($('.uContainerBottomRight').length == 0) {
                $('body').append("<div id='uContainerBottomRight' class='uContainerBottomRight'></div>");
            }
            if ($('.uContainerBottomLeft').length == 0) {
                $('body').append("<div id='uContainerBottomLeft' class='uContainerBottomLeft'></div>");
            }
        }
    },

    // Doc Done
    toast: {

        showToastMsg: ({ id, icon, title, msg, msgColor = "#212121", direction = "bottomRight", closeAfter, backgroundColor, closeBackgroundColor, closeColor, showClose = true, additionalClass = '' }) => {
            if (!id) {
                id = new Date().getTime();
            }

            u.supportingFunctions.setContainers();

            let html = "";
            html += `<div class='uToast ${additionalClass}' id='${id}'>
                        <div class='uToastCloseContainer' style='background-color: ${closeBackgroundColor}'><div  style='background-color: ${closeColor}; animation: uToastClose ${closeAfter}s forwards ease' class='uToastClose' ></div></div>
                        <div class='uToastContainer' style='background-color: ${backgroundColor}'>
                           <div class='uToastIcon'>${icon}</div>
                           <div class='uToastTitle'>${title}</div>
                           <div class='uToastMsg' style='color: ${msgColor}'>${msg}</div>
                        </div>`;
            if (showClose) {
                html += "   <div class='close' onclick='closeToast(\"" + id + "\")'><i class='bi bi-x' aria-hidden='true'></i></div>";
            }
            html += "   </div>";
            html += "</div>";

            if (direction == "bottomRight" || (window.innerWidth < 720 && (direction == "bottomRight" || direction == "bottomLeft"))) {
                $(".uContainerBottomRight").append(html);
            }
            else if (direction == "bottomLeft") {
                $(".uContainerBottomLeft").append(html);
            }
            else if (direction == "topRight" || (window.innerWidth < 720 && (direction == "topRight" || direction == "topLeft"))) {
                $(".uContainerTopRight").append(html);
            }
            else {
                $(".uContainerTopLeft").append(html);
            }

            setTimeout(() => {
                $('#' + id).addClass("closeToast");
                setTimeout(() => {
                    $('#' + id).remove();
                }, 600)
            }, closeAfter * 1000);
            return id;
        },

        showSuccess: ({
            id,
            icon = "<i class='bi bi-check-circle' aria-hidden='true'></i>",
            title = "Success",
            msg = "Thank you for your visit.",
            msgColor = "#212121",
            direction = "bottomRight",
            closeAfter = 5,
            backgroundColor = "#A5D6A7",
            closeBackgroundColor = "#1B5E20",
            closeColor = "#4CAF50",
            showClose = true,
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.toast.showSuccess;
            return u.toast.showToastMsg({ id, icon, title, msg, msgColor, direction, closeAfter, backgroundColor, closeBackgroundColor, closeColor, showClose, additionalClass });
        },

        showError: ({
            id,
            icon = "<i class='bi bi-x-circle' aria-hidden='true'></i>",
            title = "Error",
            msg = "Illegal operation.",
            msgColor = "#212121",
            direction = "bottomRight",
            closeAfter = 5,
            backgroundColor = "#EF9A9A",
            closeBackgroundColor = "#B71C1C",
            closeColor = "#EF5350",
            showClose = true,
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.toast.showError;
            return u.toast.showToastMsg({ id, icon, title, msg, msgColor, direction, closeAfter, backgroundColor, closeBackgroundColor, closeColor, showClose, additionalClass });
        },

        showWarning: ({
            id,
            icon = "<i class='bi bi-exclamation-circle' aria-hidden='true'></i>",
            title = "Warning",
            msg = "You forgot important data.",
            msgColor = "#212121",
            direction = "bottomRight",
            closeAfter = 5,
            backgroundColor = "#FFE082",
            closeBackgroundColor = "#FF6F00",
            closeColor = "#FFB300",
            showClose = true,
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.toast.showWarning;
            return u.toast.showToastMsg({ id, icon, title, msg, msgColor, direction, closeAfter, backgroundColor, closeBackgroundColor, closeColor, showClose, additionalClass });
        },

        showInfo: ({
            id,
            icon = "<i class='bi bi-info-circle' aria-hidden='true'></i>",
            title = "Info",
            msg = "Hello.",
            msgColor = "#212121",
            direction = "bottomRight",
            closeAfter = 5,
            backgroundColor = "#90CAF9",
            closeBackgroundColor = "#1565C0",
            closeColor = "#42A5F5",
            showClose = true,
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.toast.showInfo;
            return u.toast.showToastMsg({ id, icon, title, msg, msgColor, direction, closeAfter, backgroundColor, closeBackgroundColor, closeColor, showClose, additionalClass });
        },
    },

    // Doc Done
    alert: {
        closeCenterBodyContent: (id, closeAfter, backgroundScroll) => {
            setTimeout(() => {
                $("#" + id).fadeOut(400);
                setTimeout(() => {
                    $("#" + id).remove();
                    $("body").css("overflow", backgroundScroll);
                }, 450);
            }, closeAfter * 1000);
        },

        centerBodyContent: ({
            id = "uModal",
            title = "TITLE",
            msg = "MSG",
            direction = "center",
            backgroundColor = "#59B189",
            customButton = {},
            autoClose = false,
            closeAfter = -1,
            showAnimation = true,
            animationUrl = "https://assets7.lottiefiles.com/datafiles/67bae0ddb57b26679d10e9ce7c1d445f/data.json",
            animationSpeed = 1,
            animationLoop = false,
            closeOnBackgroundClick = true,
            titleColor = "#424242",
            msgColor = "rgba(66, 66, 66, 0.8)",
            buttonTxt = "Close",
            showButton = true,
            additionalClass = ''
        }) => {
            try {
                if ($("body").css("overflow") != "hidden") {
                    u.backgroundScroll = $("body").css("overflow");
                }
                let html = "";
                html += `<div class="uModal uModal_${direction} ${additionalClass}" id="${id}`;
                if (!autoClose && closeOnBackgroundClick) {
                    html += '" onclick="closeCenterBodyContentOnBackgroundClick(\'' + id + '\', \'' + u.backgroundScroll + '\')">';
                } else {
                    html += '" >';
                }

                html += '    <div class="uModal_Container" style="border-color:' + backgroundColor + '">';
                if (id == "loaderModal") {
                    html += '       <div class="decorator">';
                }
                else {
                    html += '       <div class="decorator" style="background-color:' + backgroundColor + '">';
                }
                if (showAnimation && u.functions.isDeviceOnline()) {
                    html += '        <lottie-player src="' + animationUrl + '" background="transparent" speed="' + animationSpeed + '" autoplay ';
                    if (animationLoop) {
                        html += " loop";
                    }
                    html += "></lottie-player>";
                }
                html += "       </div>";
                html += "       <div class='uModal_Container__contentHolder'>";
                if (title && title.length > 0) {
                    html +=
                        '         <div class="uModal_Container__Text"  style="color:' +
                        titleColor +
                        '">' +
                        title +
                        "</div>";
                }
                if (msg && msg.length > 0) {
                    html +=
                        '         <div class="uModal_Container__Msg" style="color:' +
                        msgColor +
                        '">' +
                        msg +
                        "</div>";
                }
                html += "       </div>";
                if (showButton) {
                    html += "   <div class='uModal_Container__displayFlex'>";
                    if ("buttonText" in customButton) {
                        html += "     <div class='uModal_Container__closeButtonContainer' onclick='closeCenterBodyContent(\"" + id + "\", \"" + u.backgroundScroll + "\");' style='border-color:" + backgroundColor + "; color:" + backgroundColor + "'> " + buttonTxt + "     </div>";
                        html += "     <div class='uModal_Container__closeButtonContainer' onclick='" + customButton.onClick[0] + "(\"" + customButton.onClick[1] + "\")' style='background-color:" + backgroundColor + "'> " + customButton.buttonText + "     </div>";
                    }
                    else {
                        html += "     <div class='uModal_Container__closeButtonContainer' onclick='closeCenterBodyContent(\"" + id + "\", \"" + u.backgroundScroll + "\");' style='background-color:" + backgroundColor + "'> " + buttonTxt + "     </div>";
                    }
                    html += "   </div>";
                }
                html += "    </div>";
                html += "</div>";

                $("body").append(html).css("overflow", "hidden");
                //$("*").blur();
                $("uModal_Container__closeButtonContainer").focus();
                if (autoClose && closeAfter != -1) {
                    u.alert.closeCenterBodyContent(id, closeAfter, u.backgroundScroll);
                }
            } catch (err) {
                console.log(err.message);
            }
        },

        showSuccess: ({
            id = "successMsg",
            title = "SUCCESS",
            msg = "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
            direction = "center",
            customButton = {},
            autoClose = false,
            closeAfter = 1.5,
            closeOnBackgroundClick = true,
            backgroundColor = "#66BB6A",
            buttonTxt = "Close",
            showButton = true,
            showAnimation = true,
            animationUrl = "./lottie/success.json",
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.alert.showSuccess;
            u.alert.centerBodyContent({
                id,
                title,
                msg,
                direction,
                customButton,
                autoClose,
                closeAfter,
                animationUrl,
                animationSpeed: 1,
                backgroundColor,
                buttonTxt,
                closeOnBackgroundClick,
                titleColor: backgroundColor,
                showButton,
                showAnimation,
                additionalClass
            });
        },

        showError: ({
            id = "errorMsg",
            title = "ERROR",
            msg = "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
            direction = "center",
            customButton = {},
            autoClose = false,
            closeAfter = 1.5,
            closeOnBackgroundClick = true,
            backgroundColor = "#EF5350",
            buttonTxt = "Close",
            showButton = true,
            showAnimation = true,
            animationUrl = "./lottie/error.json",
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.alert.showError;
            u.alert.centerBodyContent({
                id,
                title,
                msg,
                direction,
                customButton,
                autoClose,
                closeAfter,
                animationUrl,
                animationSpeed: 1,
                backgroundColor,
                buttonTxt,
                closeOnBackgroundClick,
                titleColor: backgroundColor,
                showButton,
                showAnimation,
                additionalClass
            });
        },

        showHint: ({
            id = "hintMsg",
            title = "HINT",
            msg = "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
            direction = "center",
            customButton = {},
            autoClose = false,
            backgroundColor = "#FFCA28",
            buttonTxt = "Close",
            closeAfter = 1.5,
            closeOnBackgroundClick = true,
            showButton = true,
            showAnimation = true,
            animationUrl = "./lottie/hint.json",
            additionalClass = ''
        }) => {
            additionalClass = additionalClass + ' ' + u.additionalClasses.alert.showHint;
            u.alert.centerBodyContent({
                id,
                title,
                msg,
                direction,
                customButton,
                autoClose,
                closeAfter,
                animationUrl,
                animationSpeed: 1,
                backgroundColor,
                buttonTxt,
                closeOnBackgroundClick,
                titleColor: backgroundColor,
                showButton,
                showAnimation,
                additionalClass
            });
        },

        showLoader: ({ msg = "Please be patient, we are fetching data..", direction = "center", backgroundColor = "#FFCA28", animationUrl = "./lottie/loader.json" }) => {
            if ($(".uModal")[0]) {
                $(".uModal_Container__Msg").html(msg);
                return;
            }

            u.alert.centerBodyContent({
                id: "loaderModal",
                title: "",
                msg,
                direction,
                backgroundColor,
                autoClose: false,
                closeAfter: -1,
                animationUrl,
                animationSpeed: 1,
                animationLoop: true,
                msgColor: "#424242d0",
                showButton: false,
                closeOnBackgroundClick: false,
            });
        },

        hideLoader: () => {
            $("#loaderModal").fadeOut(800);
            let backgroundScroll = u.backgroundScroll;
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    $("body").css("overflow", backgroundScroll);
                    $("#loaderModal").remove();
                    resolve();
                }, 850);
            });
        },
    },

    // Doc Done
    modal: {
        openModal: ({
            id = "uModal",
            header = "",
            body = '',
            footer = '',
            height = "15vh",
            width = "80vw",
            direction = "center",
            openDirection = "",

            onClose = null,

            borderRadius = "3px",
            closeOnBackgroundClick = true,
            showCloseButton = true,
            closeButtonBackgroundColor = "#FFF",
            closeButtonColor = "#636363",
            bodyBackgroundColor = "#FFFFFF",
            headerHeight = "7vh",
            headerBackgroundColor = "#E0E0E0",
            headerColor = "#212121",
            headerFontSize = "22px",
            headerTextAlign = "left",
            footerBackgroundColor = "#E0E0E0",
            footerHeight = "8vh",
            footerTextAlign = "left",

            isGrouped = false,
            showGroupSteps = true,
            changeModalOnClick = true,
            memberCount = 0,
            memberIndex = 0,
            groupName = "uGroupedModal",

            additionalClass = ''
        }) => {
            if ($("body").css("overflow") != "hidden") {
                u.backgroundScroll = $("body").css("overflow");
            }

            let containerStyle = "";
            containerStyle += `height: ${height}; `;
            containerStyle += `width: ${width}; `;
            containerStyle += `border-radius: ${borderRadius}; `;

            let headerMargintTop = "0";
            if (!header || !header.length) {
                headerHeight = "0vh";
            }

            let bodyHeight = `calc(${height} - ${headerHeight})`;
            if (footer && footer.length) {
                bodyHeight = `calc(${height} - ${headerHeight} - ${footerHeight})`;
            }

            let alignItems = "center";
            let justifyContent = "center";

            if (direction == "left") {
                justifyContent = "flex-start";
            } else if (direction == "right") {
                justifyContent = "flex-end";
            }

            let uMainModalClass = "";
            if (openDirection == "rtl") {
                uMainModalClass = "rtl";
            } else if (openDirection == "ltr") {
                uMainModalClass = "ltr";
            }

            let groupClass = "";
            if (isGrouped) {
                groupClass = groupName;
            }

            let html = '';
            let modalGroupedClass = '';
            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                html += `<div class="uMainModalBackground">`;
            }
            if (isGrouped) {
                modalGroupedClass = "modalGrouped";
            }

            additionalClass = additionalClass + ' ' + u.additionalClasses.modal.openModal;
            html += ` <div id="${id}" class="uMainModalContainer${memberIndex} ${modalGroupedClass} group-${groupClass} ${additionalClass}" data-group="group-${groupClass}" style="align-items: ${alignItems}; justify-content: ${justifyContent}"`;
            if (closeOnBackgroundClick) {
                html += ` onclick="closeMainModalOnBackgroundClick('${id}', '${u.backgroundScroll}', ${onClose} )"`;
            }

            html += ` >
                  <div class="uMainModal${uMainModalClass}" style="${containerStyle}">`;

            if (showCloseButton) {
                html += `     <div class="uMainModal_closeButton" style="background-color: ${closeButtonBackgroundColor}; color: ${closeButtonColor}" title="Close"><i onclick="closeMainModal('${id}', '${u.backgroundScroll}', ${onClose})" class="bi bi-x"></i></div>`;
            }

            if (isGrouped && showGroupSteps) {
                html += `<div class='groupMemberButtons'>`;
                for (let i = 0; i < memberCount; i++) {
                    if (changeModalOnClick) {
                        html += `<span class='groupMemberButton hoverableMemberButton' onclick="openGroupedModal(${i})"></span>`;
                    }
                    else {
                        html += `<span class='groupMemberButton'></span>`;
                    }
                }
                html += `</div>`;

                headerMargintTop = '5px';
            }

            if (header && header.length) {
                html += `     <div class="uMainModal_Title" style="text-align: ${headerTextAlign}; font-size: ${headerFontSize}; color: ${headerColor}; background-color: ${headerBackgroundColor}; height: ${headerHeight} !important">
                        <div style="margin-top: ${headerMargintTop};">${header}</div>
                      </div>`;
            }
            if (body && body.length) {
                html += `     <div class="uMainModal_Body" style="height: ${bodyHeight}; background-color: ${bodyBackgroundColor}; border-bottom: ${footer && footer.length ? 0 : 4}px solid ${headerBackgroundColor}; border-top: ${header && header.length ? 0 : 4}px solid ${footerBackgroundColor}">
                        ${body}
                      </div>`;
            }
            if (footer && footer.length) {
                html += `   <div class="uMainModal_Footer" style="background-color: ${footerBackgroundColor}; height: ${footerHeight}; text-align: ${footerTextAlign}">
                      ${footer}
                    </div>`;
            }
            html += `   </div>
               </div>`;
            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                html += `</div>`;
            }

            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                $("body").append(html);
                // .css("overflow", "hidden");
            } else {
                $(".uMainModalBackground").append(html);
            }
            $(`.groupMemberButton:nth-child(${memberCount + 1})`).addClass("uMainModalCurrentMemeber");

            $(`.uMainModalContainer0`).addClass("uMainModalContainer");
            $(`.groupMemberButton:nth-child(1)`).addClass(`uMainModalCurrentMemeber`);
            $(`.uMainModalBackground`).data("currentPage", "0");
        },

        openGroupedModal: (index) => {
            if ($(`.uMainModalContainer${index}`).hasClass("uMainModalContainer")) {
                return;
            }

            let currentPage = $(`.uMainModalBackground`).data("currentPage");
            if (index > currentPage) {
                $(`.uMainModalContainer`).addClass("uSlideMainModalLeft").removeClass("uBringMainModalFromLeft").removeClass("uBringMainModalFromRight");

                setTimeout(() => {
                    $(`.uMainModalContainer`).removeClass(`uMainModalContainer`).removeClass(`uSlideMainModalLeft`).removeClass(`uBringMainModalFromLeft`);
                    $(`.uMainModalContainer${index}`).addClass("uMainModalContainer").addClass("uBringMainModalFromLeft");

                    $(`.groupMemberButton`).removeClass("uMainModalCurrentMemeber");
                    $(`.groupMemberButton:nth-child(${index + 1})`).addClass("uMainModalCurrentMemeber");
                }, 100);
                $(`.uMainModalBackground`).data("currentPage", index);
            } else {
                $(`.uMainModalContainer`).addClass("uSlideMainModalRight").removeClass("uBringMainModalFromRight").removeClass("uBringMainModalFromLeft");

                setTimeout(() => {
                    $(`.uMainModalContainer`).removeClass(`uMainModalContainer`).removeClass(`uSlideMainModalRight`).removeClass(`uBringMainModalFromRight`);
                    $(`.uMainModalContainer${index}`).addClass("uMainModalContainer").addClass("uBringMainModalFromRight");

                    $(`.groupMemberButton`).removeClass("uMainModalCurrentMemeber");
                    $(`.groupMemberButton:nth-child(${index + 1})`).addClass("uMainModalCurrentMemeber");
                }, 100);
                $(`.uMainModalBackground`).data("currentPage", index);
            }
        },

        imageCanvas: ({
            id = "uModal",
            header = "",
            imageUrl = '',
            footer = '',
            width = "80vw",
            direction = "center",
            openDirection = "",

            onClose = null,

            borderRadius = "3px",
            closeOnBackgroundClick = true,
            showCloseButton = true,
            closeButtonBackgroundColor = "#FFF",
            closeButtonColor = "#636363",
            imageBackgroundColor = "#FFFFFF",
            headerHeight = "7vh",
            headerBackgroundColor = "#E0E0E0",
            headerColor = "#212121",
            headerFontSize = "22px",
            headerTextAlign = "left",
            footerBackgroundColor = "#E0E0E0",
            footerHeight = "8vh",
            footerTextAlign = "left",

            isGrouped = false,
            showGroupSteps = true,
            changeModalOnClick = true,
            memberCount = 0,
            memberIndex = 0,
            groupName = "uGroupedModal",
        }) => {
            if ($("body").css("overflow") != "hidden") {
                u.backgroundScroll = $("body").css("overflow");
            }

            let containerStyle = "";
            containerStyle += `height: auto; `;
            containerStyle += `width: ${width}; `;
            containerStyle += `border-radius: ${borderRadius}; `;

            let headerMargintTop = "0";
            if (!header || !header.length) {
                headerHeight = "0vh";
            }

            let bodyHeight = `auto`;
            if (footer && footer.length) {
                bodyHeight = `auto`;
            }

            let alignItems = "center";
            let justifyContent = "center";

            if (direction == "left") {
                justifyContent = "flex-start";
            } else if (direction == "right") {
                justifyContent = "flex-end";
            }

            let uMainModalClass = "";
            if (openDirection == "rtl") {
                uMainModalClass = "rtl";
            } else if (openDirection == "ltr") {
                uMainModalClass = "ltr";
            }

            let groupClass = "";
            if (isGrouped) {
                groupClass = groupName;
            }

            let html = '';
            let modalGroupedClass = '';
            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                html += `<div class="uMainModalBackground">`;
            }
            if (isGrouped) {
                modalGroupedClass = "modalGrouped";
            }
            html += ` <div id="${id}" class="uMainModalContainer${memberIndex} ${modalGroupedClass} group-${groupClass}" data-group="group-${groupClass}" style="align-items: ${alignItems}; justify-content: ${justifyContent}"`;
            if (closeOnBackgroundClick) {
                html += ` onclick="closeMainModalOnBackgroundClick('${id}', '${u.backgroundScroll}', ${onClose} )"`;
            }

            html += ` >
                  <div id="myresult" class="img-zoom-result"></div>
                  <div class="uMainModal${uMainModalClass}" style="${containerStyle}">`;

            if (showCloseButton) {
                html += `     <div class="uMainModal_closeButton" style="background-color: ${closeButtonBackgroundColor}; color: ${closeButtonColor}" onclick="closeMainModal('${id}', '${u.backgroundScroll}', ${onClose})" title="Close"><i class="bi bi-x" aria-hidden="true" style="pointer-events: none;"></i></div>`;
            }

            if (isGrouped && showGroupSteps) {
                html += `<div class='groupMemberButtons'>`;
                for (let i = 0; i < memberCount; i++) {
                    if (changeModalOnClick) {
                        html += `<span class='groupMemberButton hoverableMemberButton' onclick="openGroupedModal(${i})"></span>`;
                    }
                    else {
                        html += `<span class='groupMemberButton'></span>`;
                    }
                }
                html += `</div>`;

                headerMargintTop = '5px';
            }

            if (header && header.length) {
                html += `     <div class="uMainModal_Title" style="text-align: ${headerTextAlign}; font-size: ${headerFontSize}; color: ${headerColor}; background-color: ${headerBackgroundColor};">
                        <div style="margin-top: ${headerMargintTop};">${header}</div>
                      </div>`;
            }

            let canvasId = new Date().getTime();
            canvasId = "ucanvas";
            if (imageUrl && imageUrl.length) {
                html += `     <div class="uMainModal_Body" style="height: ${bodyHeight}; background-color: ${imageBackgroundColor}; border-bottom: ${footer && footer.length ? 0 : 4}px solid ${headerBackgroundColor}; border-top: ${header && header.length ? 0 : 4}px solid ${footerBackgroundColor}">
                        <img id="${canvasId}" class="uCanvas" width="auto" height="auto" src="${imageUrl}"></canvas>
                      </div>`;
            }
            if (footer && footer.length) {
                html += `   <div class="uMainModal_Footer" style="background-color: ${footerBackgroundColor}; height: ${footerHeight}; text-align: ${footerTextAlign}">
                      ${footer}
                    </div>`;
            }
            html += `   </div>
               </div>`;
            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                html += `</div>`;
            }

            if (!isGrouped || (isGrouped && memberIndex == 0)) {
                $("body").append(html).css("overflow", "hidden");
            } else {
                $(".uMainModalBackground").append(html);
            }
            $(`.groupMemberButton:nth-child(${memberCount + 1})`).addClass("uMainModalCurrentMemeber");

            $(`.uMainModalContainer0`).addClass("uMainModalContainer");
            $(`.groupMemberButton:nth-child(1)`).addClass(`uMainModalCurrentMemeber`);
            $(`.uMainModalBackground`).data("currentPage", "0");
        },
    },

    // Doc Done
    notification: {
        type1: ({ id, icon = "U", heading, content, closeAfter = 5, color = "#17A2B8", direction = "right", showCloseButton = true }) => {
            if (!id) {
                id = new Date().getTime();
            }
            u.supportingFunctions.setContainers();

            let html = "";
            let marginLeft = "2%";
            html += '<div class="uNotification uNotification_' + direction + '" id="' + id + '"  style="border-color: ' + color + '">';
            if (showCloseButton) {
                html += "   <div class='close' onclick='closeToast(\"" + id + "\")'><i class='bi bi-x' aria-hidden='true' style='color: " + color + "'></i></div>";
            }
            if (icon) {
                marginLeft = "18%";
                html += '   <div class="icon" style="background-color:' + color + '">' + icon + '</div>';
            }
            html += '   <div class="desc" style="margin-left: ' + marginLeft + '">';
            if (heading) {
                html += '     <div class="heading" style="color:' + color + '">' + heading + '     </div>';
            }
            if (content) {
                html += '     <div>' + content + '     </div>';
            }
            html += '   </div>';
            html += '</div>';

            if (direction == "center" || window.innerWidth < 720) {
                $(".uContainerTopCenter").append(html);
            }
            else if (direction == "left") {
                $(".uContainerTopLeft").append(html);
            }
            else {
                $(".uContainerTopRight").append(html);
            }

            setTimeout(() => {
                $('#' + id).addClass("closeToast");
                setTimeout(() => {
                    $('#' + id).remove();
                }, 600)
            }, closeAfter * 1000)
            return id;
        }
    },

    // Doc Done
    notice: {
        closeCenterBodyContent: (id, closeAfter, backgroundScroll) => {
            setTimeout(() => {
                $("#" + id).fadeOut(400);
                setTimeout(() => {
                    $("#" + id).remove();
                    $("body").css("overflow", backgroundScroll);
                }, 450);
            }, closeAfter * 1000);
        },

        showNotice: ({
            id = "uNotice",
            animationSpeed = 1,
            animationLoop = false,
            closeOnBackgroundClick = true,
            msgColor = "rgba(66, 66, 66, 0.8)",
            onClose = null,

            content = [],

            msgArr = [],
            title = "Notice",
            animationUrl = "",
            backgroundColor,
            titleColor,

            additionalClass = ''
        }) => {
            if (!content.length && msgArr.length) {
                let i, j;
                for (i = 0; j = msgArr.length, i < j; i++) {
                    let data = [];
                    data["msg"] = msgArr[i];
                    if (title) {
                        data["title"] = title;
                    }
                    if (animationUrl) {
                        data["animationUrl"] = animationUrl;
                    }
                    if (backgroundColor) {
                        data["backgroundColor"] = backgroundColor;
                    }
                    if (titleColor) {
                        data["titleColor"] = titleColor;
                    }
                    content.push({ ...data });
                }
            }

            try {
                if ($("body").css("overflow") != "hidden") {
                    u.backgroundScroll = $("body").css("overflow");
                }
                let html = "";
                additionalClass = additionalClass + ' ' + u.additionalClasses.notice.showNotice;
                html += `<div class="uModal uNotice uModal_center ${additionalClass}" id="${id}`;
                if (closeOnBackgroundClick) {
                    html += `" onclick="closeCenterBodyContentOnBackgroundClick('${id}', '${u.backgroundScroll}', ${onClose})">`;
                } else {
                    html += '" >';
                }

                let { title, msg, backgroundColor, titleColor, animationUrl } = content[0];
                [title, msg, backgroundColor, titleColor, animationUrl] = setDefaults(title, msg, backgroundColor, titleColor, animationUrl);

                html += '    <div class="uModal_Container" style="border-color:' + backgroundColor + '">';

                if (id == "loaderModal") {
                    html += '       <div class="decorator">';
                }
                else {
                    html += '       <div class="decorator" style="background-color:' + backgroundColor + '; height: 60px; justify-content: flex-start">';
                }
                if (animationUrl && animationUrl.length && u.functions.isDeviceOnline()) {
                    html += '        <lottie-player src="' + animationUrl + '" background="transparent" speed="' + animationSpeed + '" autoplay style="height: 40px;max-width: 60px;padding: 0 !important;"';
                    if (animationLoop) {
                        html += " loop";
                    }
                    html += "></lottie-player>";
                }
                if (title && title.length > 0) {
                    html +=
                        '         <div class="uModal_Container__Text"  style="color:' + titleColor + '; margin: 0; padding: 0; text-align: left;">' +
                        title +
                        "</div>";
                }
                html += "       </div>";
                html += "       <div class='uModal_Container__contentHolder' style='position: relative;'>";

                if (content.length > 1) {
                    html += `<div class='groupMemberButtons' style="top: 8px;">`;
                    for (let i = 0; i < content.length; i++) {
                        html += `<span class='groupMemberButton hoverableMemberButton' onclick="changeNotice(${i})"></span>`;
                    }
                    html += `</div>`;
                }

                if (msg && msg.length > 0) {
                    html += `         <div class="uModal_Container__Msg" style="color:${msgColor}; margin-top:35px;max-height: 50vh;max-width: 80vw; overflow: auto;">${msg}</div>`;
                }
                html += "       </div>";
                html += "   <div class='uModal_Container__displayFlex mt-3'>";
                if (content.length > 1) {
                    html += `     <div class='uModal_Container__closeButtonContainer prevNotice' onclick="prevNotice()" style='border-color:${backgroundColor}; color:${backgroundColor}; font-weight: bold; letter-spacing: 0.1em;'>Prev</div>`;
                    html += `     <div class='uModal_Container__closeButtonContainer nextNotice' onclick="nextNotice()" style='background-color:${backgroundColor}; color:white; font-weight: bold; letter-spacing: 0.1em;'>Next</div>`;
                }
                html += `     <div class='uModal_Container__closeButtonContainer closeNotice' style='background-color:${backgroundColor}; color:white; font-weight: bold; letter-spacing: 0.1em;' onclick="closeCenterBodyContentOnBackgroundClick('${id}', '${u.backgroundScroll}')">Close</div>`;
                html += "    </div>";
                html += "</div>";

                $("body").append(html).css("overflow", "hidden");
                $(".prevNotice").css("display", "none");
                if (content.length > 1) {
                    $(`.closeNotice`).css("display", "none");
                }
                $("uModal_Container__closeButtonContainer").focus();
                $(".uModal").data("content", content);
                $(".uModal").data("currentMem", 0);
                $(`.groupMemberButton:nth-child(1)`).addClass(`uMainModalCurrentMemeber`);
            } catch (err) {
                console.log(err.message);
            }
        },

        changeNotice: (mem) => {
            currentMem = $(".uModal").data("currentMem");
            if (mem == currentMem) {
                return;
            }
            newContent = $(".uModal").data("content")[mem];
            curContent = $(".uModal").data("content")[currentMem];

            [title, msg, backgroundColor, titleColor, animationUrl] = setDefaults(newContent.title, newContent.msg, newContent.backgroundColor, newContent.titleColor, newContent.animationUrl);

            if (msg != curContent.msg) {
                $(".uNotice .uModal_Container__Msg").fadeTo("fast", "0", () => {
                    $(".uNotice .uModal_Container__Msg").html(msg).fadeTo("fast", "1", () => { });
                });
            }

            let html = '        <lottie-player src="' + animationUrl + '" background="transparent" speed="1" autoplay style="height: 40px;max-width: 60px;padding: 0 !important;"></lottie-player>';
            if (title && title.length > 0) {
                html += '         <div class="uModal_Container__Text"  style="color:' + titleColor + ';  margin: 0; padding: 0; text-align: left;">' + title + "</div>";
            }
            $(".uNotice .decorator").html(html);

            $(".uNotice .decorator").css("backgroundColor", backgroundColor);
            $(".uNotice .uModal_Container").css("border-color", backgroundColor);

            $(".uModal").data("currentMem", mem);
            $(`.groupMemberButton`).removeClass(`uMainModalCurrentMemeber`);
            $(`.groupMemberButton:nth-child(${mem + 1})`).addClass(`uMainModalCurrentMemeber`);
        }
    },

    // Doc Done
    constants: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        months_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        days_short: ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"],
        days_single: ["S", "M", "T", "W", "T", "F", "S"],
    },

    // Doc Done
    drawers: {
        // Doc Done
        bottomDrawer: ({ heading = null, body = null, id = 'uBottomDrawer', closeOnBackgroundClick = true, borderRadius = 0, borderColor = "transparent", onClose = () => { } }) => {
            let html = "";
            html += "<div class='uDrawer' id='" + id + "' ";
            if (closeOnBackgroundClick) {
                html += ` onclick="closeDrawerOnBackgroundClick('${id}', ' ${u.backgroundScroll}', ${onClose})">`;
            } else {
                html += '" >';
            }
            html += "   <div class='uDrawer_container open_uDrawer_container' style='border-top-left-radius:" + borderRadius + "; border-top-right-radius:" + borderRadius + "; border-top: 4px solid " + borderColor + ";' >";
            if (heading) {
                html += `   <div class='uDrawer_container__heading'>
                              <div> ${heading}</div>
                              <div class='uDrawer_container__close' onclick="closeDrawer('${id}', '${u.backgroundScroll}', ${onClose})">x</div>
                            </div>`;
            }
            else {
                html += `   <div class='uDrawer_container__heading' style='border:0; height: 1vh;'>
                              <div class='uDrawer_container__closeWithoutHeader' onclick="closeDrawer('${id}', '${u.backgroundScroll}', ${onClose})">x</div>
                            </div>`;
            }
            if (body) {
                html += "   <div class='uDrawer_container__body'>" + body;
                html += "   </div>";
            }
            html += "   </div>";
            html += "</div>";
            //$("*").blur();
            $("body").append(html);
        },

        // Doc Done
        navDrawer: ({ beforeMenu, completeMenu = undefined, afterMenu, direction = 'left', id = 'uNavDrawer', closeOnBackgroundClick = true, backdropColor = 'transparent', logo = null, decoratorColor = '#d92319e0', hideLogo = false, width = undefined, onClose = () => {} }) => {
            let navClass = "";
            if (direction == 'left' && $(".uLeftDrawer").length > 0) {
                navClass = "uLeftDrawer";
                u.functions.openNavDrawer(navClass);
                return;
            }
            else if (direction == 'right' && $(".uRightDrawer").length > 0) {
                navClass = "uRightDrawer";
                u.functions.openNavDrawer(navClass);
                return;
            }

            if (!width && window.innerWidth > 600) {
                width = '25';
            } else if (!width) {
                width = '80';
            }

            if (direction == "left") {
                $("body").data('completeLeftMenu', completeMenu);
            }
            else {
                $("body").data('completeRightMenu', completeMenu);
            }

            if ($("body").css("overflow") != "hidden") {
                u.backgroundScroll = $("body").css("overflow");
            }
            let html = "";
            if (direction == 'left') {
                html += "<div id='" + id + "' class='uLeftDrawer openLeftDrawer' style='background-color: " + backdropColor + "' ";
            }
            else {
                html += "<div id='" + id + "' class='uRightDrawer openRightDrawer' style='background-color: " + backdropColor + "' ";
            }

            if (closeOnBackgroundClick) {
                if (direction == 'left') {
                    html += `onclick='closeNavDrawer("uLeftDrawer", ${onClose})'>`;
                }
                else {
                    html += `onclick='closeNavDrawer("uRightDrawer", ${onClose})'>`;
                }
            }
            else {
                html += " >";
            }

            html += `   <div class='uNavDrawer_container' style='width: ${width}vw; ${direction === 'left' ? 'right' : 'left'}: ${100 - width}vw'>
                            <div class='uNavDrawer_containerDecorator' style='background-color: ${decoratorColor}'></div>`;

            if (!hideLogo && logo && logo.length > 0) {
                html += "     <img src='" + logo + "' alt='APP ICON'>";
            }

            if (beforeMenu && beforeMenu.length > 0) {
                html += beforeMenu;
            }

            html += `   <div id='menuContainer'>
                            <div class='menuTitle'></div>
                            <div class='menuContents'></div>
                        </div>`;

            if (afterMenu && afterMenu.length > 0) {
                html += afterMenu;
            }

            html += "   </div>";
            html += "</div>";
            $("body").append(html);

            if (completeMenu !== undefined) {
                fillUpMenu("menu", direction);
            }
        },

        drawer: ({ direction = 'left', id = 'leftDrawer', closeOnBackgroundClick = true, heading = undefined, body = '', width = undefined, headingCss = '', headingWidth = '65px', closeIcon = undefined, onClose = () => { } }) => {
            $('.navInContainer').each(function (index) {
                let mt = $(this).css('margin-top');
                mt = mt ? mt : '0';
                $(this).css('margin-top', parseInt(mt.split('px')[0]) + 50 + 'px');
            });
            let html = "";
            if (direction == 'left') {
                html += `<div id='${id}' style="background-color: #00000020" class='uLeftDrawer openLeftDrawer leftDrawerContainer canCloseDrawer'`;
            }
            else {
                html += `<div id='${id}' style="background-color: #00000020" class='uRightDrawer openRightDrawer leftDrawerContainer canCloseDrawer'`;
            }

            if (closeOnBackgroundClick) {
                if (direction == 'left') {
                    html += `onclick='closeMultiDrawer("${id}", "${direction}", ${onClose})'>`;
                }
                else {
                    html += `onclick='closeMultiDrawer("${id}", "${direction}", ${onClose})'>`;
                }
            }
            else {
                html += " >";
            }

            if (closeIcon === undefined) {
                closeIcon = `<span class='u_allNavsOpen_closeBtn' onclick='closeMultiDrawer("${id}", "${direction}", ${onClose})'>X</span>`;
            }

            html += `   <div class='uNavDrawer_container' style="padding: 0;overflow: unset;${width ? `width: ${width} !important; ${direction === 'left' ? 'right' : 'left'}: unset; ${direction}: 0; min-width: unset;` : ''}">
                            <div id="u_allNavsOpen" style="${direction === 'left' ? `right: -${headingWidth}` : `left: -${headingWidth}`}">
                                <div class="navInContainer" style="${direction === 'left' ? 'display: flex; flex-direction: row-reverse;' : ''} ${headingCss}; width:${headingWidth}">
                                    <span class="canCloseDrawer" onclick='closeMultiDrawer("${id}", "${direction}", ${onClose})'><span>${closeIcon}</span></span>
                                    <div style="width:100%">${heading}</div>
                                </div>
                            </div>
                            <div class="u_allNavsContent">
                                ${body}
                            </div>
                        </div>
                    </div>`;
            $("body").append(html);
        }
    },

    pageLoad: {
        loadPageRight: async (url, createHistory = true) => {
            u.supportingFunctions.pageChangeActions(url, createHistory);
            var html = "";
            html +=
                "<iframe src='" +
                url +
                "' class='loadingPage' onload='transitionPage(\"right\")' ></iframe>";
            $("body").append(html);
        },
        loadPageUp: async (url, createHistory = true) => {
            u.supportingFunctions.pageChangeActions(url, createHistory);
            var html = "";
            html +=
                "<iframe src='" +
                url +
                "' class='loadingPageTop' onload='transitionPage(\"up\")' ></iframe>";
            $("body").append(html);
        },
    },

    slider: {
        initialMousePosition: undefined,
        nextHandle: undefined,
        prevHandle: undefined,
        valueCorrectors: {},
        valueDecorators: {},
        valuChangeCallBacks: {},
        chartClickCallbacks: {},

        createSlider: ({ id = "mySlider",
            selector = 'body',
            numSliders = 1,
            showCurrentVal = true,
            setValueOnSliderClick = true,
            valueRange = { from: 0, to: 100 },
            initialValue = undefined,
            steps = undefined,
            valueCorrector = undefined,
            valueDecorator = undefined,
            tickerDecorator = undefined,
            valueChangeCallBack = undefined,
            handleLabels = [],
            showTickers = true,

            hasChart = false,
            showChartTickers = true,
            chartValues = {},
            chartClickCallback = undefined
        }) => {

            u.slider.valueCorrectors[id] = valueCorrector;
            u.slider.valueDecorators[id] = valueDecorator;
            u.slider.valuChangeCallBacks[id] = valueChangeCallBack;
            u.slider.chartClickCallbacks[id] = chartClickCallback;

            let sliderHTML = '';
            for (let i = 0; i < numSliders; i++) {
                sliderHTML += ` <div class="sliderHandle" onmousedown="u.slider.moveOnMouseMove(this)" data-handle="${i + 1}" onmouseover="u.slider.showLabel(this)" onmouseout="u.slider.hideLabel(this)">
                                        ${showCurrentVal ? `<div class="currentVal">${handleLabels[i] ? `<div class="label">${handleLabels[i]}</div>` : ''}<div class="value" ${handleLabels[i] ? `style="font-weight: bold;"` : ''}></div></div>` : ''}
                                </div>
                            `
            }

            $(selector).append(`
                            <div class="sliderContainer" style="${hasChart ? 'margin-top: 80px' : ''}">
                                ${hasChart ? `<div class='sliderChart'></div>` : ''}
                                <div class="slider" id="${id}" ${setValueOnSliderClick ? `onclick="u.slider.setSliderHandlePosition(this)"` : ''} data-valuerange=${JSON.stringify(valueRange)} data-numsliders=${numSliders} data-initialValue=${initialValue} data-steps=${steps} data-setValueOnSliderClick=${setValueOnSliderClick} data-showcharttickers=${showChartTickers}>
                                    <div class="sliderRangeColor"></div>
                                    ${sliderHTML}
                                </div>
                                ${showTickers ? `<div class="ticker">
                                        <div class="tick">${tickerDecorator ? tickerDecorator(valueRange.from) : valueRange.from}</div>
                                        <div class="tick">${tickerDecorator ? tickerDecorator(valueRange.to) : valueRange.to}</div>
                                    </div>` : ''
                }
                            </div>
            `);
            u.slider.setValue(`#${id}`, initialValue);
            hasChart ? u.slider.createChart(`#${id}`, chartValues) : null;
        },

        createChart: (selector, chartValues) => {
            const parentWidth = $(selector).parent().find('.sliderChart').outerWidth();
            const valueRange = $(selector).data('valuerange');
            const showChartTickers = $(selector).data('showcharttickers');
            const id = $(selector).attr('id');
            const numBars = valueRange.to - valueRange.from;
            const valueDecorator = u.slider.valueDecorators[id] ? u.slider.valueDecorators[id] : (val) => val;

            let chartHTML = ``;
            let barCount = 0;
            const barWidth = (parentWidth / numBars);
            let maxValue = chartValues[Object.keys(chartValues)[0]];
            Object.keys(chartValues).forEach((key) => {
                maxValue = chartValues[key] && maxValue < chartValues[key] ? chartValues[key] : maxValue;
            });

            for (let i = valueRange.from; i <= valueRange.to; i += 1) {
                chartHTML += `
                    <div data-decoratedValue=${valueDecorator(i)} data-value=${chartValues[i]} data-xValue=${i} class="bar" onclick="u.slider.callChartCallBackFn(this)" ${showChartTickers ? `onmouseover="u.slider.showBarLabel(this)" onmouseout="u.slider.hideBarLabel(this)"` : ''} style="height: ${(chartValues[i] / maxValue) * 80}px; left: ${i === valueRange.from ? (barWidth * barCount) : (barWidth * barCount) - (barWidth / 2)}px; width: ${i === valueRange.from || i === valueRange.to ? barWidth / 2 : barWidth}px">
                        ${showChartTickers ? `<div class="currentVal">${chartValues[i] ? `<div class="label">Value @ ${valueDecorator(i)}</div>` : ''}<div class="value" ${chartValues[i] ? `style="font-weight: bold; color: black"` : ''}><div>${chartValues[i]}</div></div></div>` : ''}
                    </div>
                `;
                barCount += 1;
            }

            $(selector).parent().find('.sliderChart').html(chartHTML);

            const currentValue = u.slider.getValuesForSlider(id);
            u.slider.colorChart(id, currentValue);
        },

        colorChart: (id, currentValue) => {
            const allChildren = $(`#${id}`).parent().find('.sliderChart').children();
            const valueRange = $(`#${id}`).data('valuerange');

            $(`#${id}`).parent().find(`.sliderChart .bar.colored`).removeClass('colored');
            currentValue[0] = parseInt(currentValue[0]);
            currentValue[currentValue.length - 1] = parseInt(currentValue[currentValue.length - 1]);
            for (i = currentValue[0]; i <= currentValue[currentValue.length - 1]; i++) {
                $(allChildren[i - valueRange.from]).addClass('colored');
            }
        },

        hideLabel: (e) => {
            $(e).find('.currentVal').removeClass('show2');
        },

        showLabel: (e) => {
            $(e).find('.currentVal').addClass('show2');
        },

        hideBarLabel: (e) => {
            $(e).find('.currentVal').removeClass('show2');
            $(e).removeClass('colored2');
        },

        showBarLabel: (e) => {
            $(e).find('.currentVal').addClass('show2');
            $(e).addClass('colored2');
        },

        setRangeColor: (slider) => {
            const firstSlider = $(slider).find(`[data-handle='1']`);
            const numSliders = $(slider).data('numsliders');
            const lastSlider = $(slider).find(`[data-handle='${numSliders}']`);
            const start = numSliders === 1 ? $(slider).offset().left : firstSlider.offset().left;
            const end = lastSlider.offset().left;
            $(slider).find('.sliderRangeColor').offset({ left: start }).css('width', `${end - start}px`);
        },

        setSliderOffset: (slider, newLeftOffset) => {
            const parentLeftOffset = slider.parent().offset().left;
            const parentWidth = slider.parent().outerWidth();

            var maxTrans = parentWidth + parentLeftOffset - 10;
            maxTrans = u.slider.nextHandle ? $(u.slider.nextHandle).offset().left : maxTrans;
            var minTrans = parentLeftOffset - 10;
            minTrans = u.slider.prevHandle ? $(u.slider.prevHandle).offset().left : minTrans;
            newLeftOffset = newLeftOffset > maxTrans ? maxTrans : newLeftOffset;
            newLeftOffset = newLeftOffset < minTrans ? minTrans : newLeftOffset;
            slider.offset({ left: newLeftOffset });

            return newLeftOffset;
        },

        setSliderHandlePosition: (slider) => {
            const newLeftOffset = $(slider).offset().left + event.offsetX - 10;
            const allHandles = $(slider).find('.sliderHandle');

            const parentLeftOffset = $(slider).offset().left;
            const parentWidth = $(slider).outerWidth();

            const percentageSlide = ((newLeftOffset + 10 - parentLeftOffset) / parentWidth) * 100;
            const valueRange = $(slider).data('valuerange');
            const newVal = (percentageSlide * (valueRange.to - valueRange.from) / 100) + valueRange.from;

            let handleToMove = 0;

            if (allHandles.length === 1) {
                u.slider.setSliderOffset($(slider).find('.sliderHandle'), newLeftOffset);
            } else {
                const touchPosition = percentageSlide * parentWidth / 100;
                let handleDiff = Math.abs(touchPosition - parseFloat($(allHandles[0]).css('left').split('px')[0]));
                allHandles.each((index) => {
                    const left = parseFloat($(allHandles[index]).css('left').split('px')[0]);
                    if (Math.abs(touchPosition - left) < handleDiff) {
                        handleToMove = index;
                        handleDiff = Math.abs(touchPosition - left);
                    }
                });
                handleToMove += 1;
                u.slider.setSliderOffset($(slider).find(`.sliderHandle[data-handle="${handleToMove}"]`), newLeftOffset);
            }


            if (allHandles.length === 1) {
                u.slider.setValue(slider, [newVal], $(slider).data('handle'));
            } else {
                u.slider.setValue(slider, [newVal], handleToMove);
                setTimeout(() => {
                    $(slider).find('.currentVal').removeClass('show');
                }, 1050);
            }
            const id = $(slider).attr('id');
            const currentValue = u.slider.getValuesForSlider(id);
            u.slider.colorChart(id, currentValue)
            u.slider.callCallBackFn($(slider));
        },

        setValue: (selector, toVal, handleIndex = undefined) => {
            if ($(selector).is("div")) {
                selector = $(selector);
            }
            const id = selector.attr("id");
            const valueCorrector = u.slider.valueCorrectors[id] ? u.slider.valueCorrectors[id] : (val) => val?.toFixed?.(0) || val;
            const valueDecorator = u.slider.valueDecorators[id] ? u.slider.valueDecorators[id] : (val) => val;
            const parentLeftOffset = selector.offset().left;
            const parentWidth = selector.outerWidth();
            const valueRange = selector.data('valuerange');
            const steps = selector.data('steps');

            toVal.forEach((val, index) => {
                const percentageSlide = ((val - valueRange.from) * 100) / (valueRange.to - valueRange.from);
                const _handleIndex = handleIndex !== undefined ? handleIndex : index + 1;

                let newLeftOffset = (percentageSlide / 100 * parentWidth) - 10 + parentLeftOffset;
                newLeftOffset = u.slider.setSliderOffset(selector.find(`.sliderHandle[data-handle="${_handleIndex}"]`), newLeftOffset);

                val = valueCorrector ? valueCorrector(val) : val;
                if (steps !== 'undefined' && !((val - valueRange.from) % steps === 0)) {
                    val = val - ((val - valueRange.from) % steps);
                    val = valueCorrector ? valueCorrector(val) : val;
                }

                selector.find(`.sliderHandle[data-handle="${_handleIndex}"] .currentVal`).addClass('show').find('.value').html(`<div>${valueDecorator(val)}</div>`);
            });
            u.slider.setRangeColor($(selector));

            if (!handleIndex) {
                setTimeout(() => {
                    selector.find('.currentVal').removeClass('show');
                    const setValueOnSliderClick = $(selector).parent().data('setvalueonsliderclick');
                    $(selector).parent().attr('onclick', setValueOnSliderClick ? 'u.slider.setSliderHandlePosition(this)' : '');
                }, 1050);
            }
        },

        callChartCallBackFn: (e) => {
            const value = $(e).data('value');
            const xValue = $(e).data('xvalue');
            const decoratedXValue = $(e).data('decoratedvalue');
            const id = $(e).parent().parent().find('.slider').attr('id')

            u.slider.chartClickCallbacks[id] ? u.slider.chartClickCallbacks[id]({ id, xValue, barValue: value, decoratedXValue }) : null;
        },

        callCallBackFn: (selector) => {
            const id = selector.attr("id");

            u.slider.valuChangeCallBacks[id] ? u.slider.valuChangeCallBacks[id](id, u.slider.getValuesForSlider(id)) : null;
        },

        getValuesForSlider: (id) => {
            sliderHandles = $(`#${id}`).find('.sliderHandle');
            const valueCorrector = u.slider.valueCorrectors[id] ? u.slider.valueCorrectors[id] : (val) => val.toFixed(0);
            const steps = $(`#${id}`).data('steps');

            returnValue = [];
            sliderHandles.each((index) => {
                sliderHandle = sliderHandles[index];
                const sliderHandleParent = $(sliderHandle).parent();
                const newLeftOffset = $(sliderHandle).offset().left;
                const parentLeftOffset = sliderHandleParent.offset().left;
                const parentWidth = sliderHandleParent.outerWidth();
                const percentageSlide = ((newLeftOffset + 10 - parentLeftOffset) / parentWidth) * 100;
                const valueRange = sliderHandleParent.data('valuerange');

                let val = (percentageSlide * (valueRange.to - valueRange.from) / 100) + valueRange.from;
                val = valueCorrector ? valueCorrector(val) : val;
                if (steps !== 'undefined' && !((val - valueRange.from) % steps === 0)) {
                    val = val - ((val - valueRange.from) % steps);
                    val = valueCorrector ? valueCorrector(val) : val;
                }
                returnValue.push(val);
            });
            return returnValue;
        },

        moveOnMouseMove: (slider) => {
            $(window).bind('mousemove touchmove', e => {
                if (!u.slider.initialMousePosition) {
                    const pageX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                    const pageY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
                    u.slider.initialMousePosition = { x: pageX, y: pageY };
                    const currentHandle = parseInt($(slider).data('handle'));

                    const nextHandle = $(slider).parent().find(`[data-handle= '${currentHandle + 1}']`);
                    u.slider.nextHandle = nextHandle.length ? nextHandle : undefined;

                    const prevHandle = $(slider).parent().find(`[data-handle= '${currentHandle - 1}']`);
                    u.slider.prevHandle = prevHandle.length ? prevHandle : undefined;
                } else {
                    slider = $(slider);
                    $(slider).parent().attr('onclick', '');
                    const parentLeftOffset = slider.parent().offset().left;
                    const parentWidth = slider.parent().outerWidth();

                    const pageX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                    let newLeftOffset = pageX - 10;

                    newLeftOffset = u.slider.setSliderOffset(slider, newLeftOffset);

                    const percentageSlide = ((newLeftOffset + 10 - parentLeftOffset) / parentWidth) * 100;
                    const valueRange = $(slider).parent().data('valuerange');

                    const newVal = (percentageSlide * (valueRange.to - valueRange.from) / 100) + valueRange.from;
                    u.slider.setValue(slider.parent(), [newVal], slider.data('handle'));

                    u.slider.setRangeColor(slider.parent());

                    const id = slider.parent().attr('id');
                    const currentValue = u.slider.getValuesForSlider(id);
                    u.slider.colorChart(id, currentValue);
                }
            }).bind('mouseup touchend', e => {
                u.slider.initialMousePosition = undefined;
                $(window).off('mousemove');
                $(slider).find('.currentVal').removeClass('show');
                setTimeout(() => {
                    const setValueOnSliderClick = $(slider).parent().data('setvalueonsliderclick');
                    $(slider).parent().attr('onclick', setValueOnSliderClick ? 'u.slider.setSliderHandlePosition(this)' : '');
                    u.slider.callCallBackFn($(slider).parent());
                    $(window).off('mousemove touchmove mouseup touchend');
                }, 100);
            });
        }

    },

    copyTextToClipboard: (text) => {
        const fallbackCopyTextToClipboard = (text) => {
            var textArea = document.createElement("textarea");
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }

        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    },
    virtualList: {
        currentlyShowing: undefined,
        selectedValues: {},
        maxSelections: {},
        allowUnselectingAll: {},
        numColumns: {},
        options: {},
        onChange: {},
        style: {},
        create: ({
            selector = '',
            name = '',
            id = new Date().getTime(),
            itemHeight = 'auto',
            layout = 'vertical',
            selectedBackgroundColor = '#252E3D',
            selectedTextColor = '#F1F1F1',
            selectedFontBold,
            selectedFontItalic,
            selectedFontUnderline,
            unselectedFontBold,
            unselectedFontItalic,
            unselectedFontUnderline,
            unselectedBackgroundColor = '#F1F1F1',
            unselectedTextColor = '#1F1F1F',
            attributeSeperatorColor = '#F1F1F1',
            attributeSeperatorMargin = 0,
            maxSelections = undefined,
            allowUnselectingAll = false,
            numColumns = 1,
            textAlign = 'left',
            options = [],
            onChange = () => {},
        }) => {
            u.virtualList.options[selector] = options;
            u.virtualList.onChange[selector] = onChange;
            u.virtualList.style[selector] = {
                attributeSeperatorColor,
                attributeSeperatorMargin,
                itemHeight,
                layout,
                selectedBackgroundColor,
                selectedTextColor,
                selectedFontBold,
                selectedFontItalic,
                selectedFontUnderline,
                textAlign,
                unselectedBackgroundColor,
                unselectedTextColor,
                unselectedFontBold,
                unselectedFontItalic,
                unselectedFontUnderline,
            };
            u.virtualList.maxSelections[selector] = maxSelections;
            u.virtualList.allowUnselectingAll[selector] = allowUnselectingAll;
            u.virtualList.numColumns[selector] = numColumns;

            // Set default selected options
            if (maxSelections && !u.virtualList.selectedValues[selector]) {
                u.virtualList.selectedValues[selector] = {};
                options.forEach((option) => {
                    if (option.selected) {
                        u.virtualList.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                    }
                });
            } else if (!maxSelections && u.virtualList.selectedValues[selector] === undefined) {
                u.virtualList.selectedValues[selector] = {};
                if (options.length) {
                    const option = options[0];
                    u.virtualList.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                }
            }

            if (maxSelections && Object.keys(u.virtualList.selectedValues[selector] || {}).length > maxSelections) {
                u.virtualList.selectedValues[selector] = {};
            }

            // Set default selections
            if (u.virtualList.selectedValues[selector] === undefined) {
                if (!maxSelections) {
                    u.virtualList.markAllSelected(selector, true)
                } else {
                    u.virtualList.options[selector].slice(0, maxSelections).forEach((option) => {
                        u.virtualList.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                    });
                }    
            }

            // Build UI for menu trigger
            $(selector).parent().css('height', '100%').css('overflow', 'auto').css('font-size', '12px').data('id', id);
            u.virtualList.showOption({ selector, filter: '' });
        },
        toggleSelectedValue: (e, selector, optionIdx, maxSelections, label, value) => {
            event.stopPropagation();

            if (!maxSelections || maxSelections === 1) {
                if (u.virtualList.allowUnselectingAll[selector] && u.virtualList.selectedValues[selector][value]) {
                    u.virtualList.selectedValues[selector] = {};
                } else {
                    u.virtualList.selectedValues[selector] = {};
                    u.virtualList.selectedValues[selector][value] = { label, value };
                }
                $(e).parent().parent().find('.isSelected').removeClass('selected');
                $(e).find('.isSelected').addClass('selected');
            } else if (maxSelections === -1 || maxSelections > Object.keys(u.virtualList.selectedValues[selector]).length || u.virtualList.selectedValues[selector][value]) {
                if (u.virtualList.selectedValues[selector][value]) {
                    delete u.virtualList.selectedValues[selector][value];
                } else {
                    u.virtualList.selectedValues[selector][value] = { label, value };
                }
                $(e).find('.isSelected').addClass('selected');
            } else {
                u.toast.showWarning({ msg: `Max ${maxSelections} options can be selected at once.`, direction: 'topRight' })
            }

            u.virtualList.showOption({ selector, filter: '' });
            u.virtualList.onChange[selector]({
                selectedValues: Object.values(u.virtualList.selectedValues[selector] || {}),
                allSelected: Object.keys(u.virtualList.selectedValues[selector]).length === u.virtualList.options[selector].length,
                selectedOptionIdx: optionIdx
            });
        },
        showOption: ({ selector, filter = ''}) => {
            const maxSelections = u.virtualList.maxSelections[selector];
            const numColumns = u.virtualList.numColumns[selector];
            const layout = u.virtualList.style[selector].layout;
            const attributeSeperatorColor = u.virtualList.style[selector].attributeSeperatorColor;
            const attributeSeperatorMargin = u.virtualList.style[selector].attributeSeperatorMargin;
            const itemHeight = u.virtualList.style[selector].itemHeight;
            const selectedBackgroundColor = u.virtualList.style[selector].selectedBackgroundColor;
            const selectedTextColor = u.virtualList.style[selector].selectedTextColor;
            const selectedFontBold = u.virtualList.style[selector].selectedFontBold;
            const selectedFontItalic = u.virtualList.style[selector].selectedFontItalic;
            const selectedFontUnderline = u.virtualList.style[selector].selectedFontUnderline;
            const unselectedBackgroundColor = u.virtualList.style[selector].unselectedBackgroundColor;
            const unselectedTextColor = u.virtualList.style[selector].unselectedTextColor;
            const unselectedFontBold = u.virtualList.style[selector].unselectedFontBold;
            const unselectedFontItalic = u.virtualList.style[selector].unselectedFontItalic;
            const unselectedFontUnderline = u.virtualList.style[selector].unselectedFontUnderline;
            const textAlign = u.virtualList.style[selector].textAlign;
            const id = $(selector).parent().data('id');
            let allOptionsHTML = `
                <div class="uVirtualList" id="${id}">
                    <div class="${layout}" style="${numColumns && numColumns > 1 ? `columns: ${numColumns}` : ''}">
            `;

            u.virtualList.options[selector].forEach((option, optionIdx) => {
                isSelected = u.virtualList.selectedValues[selector]?.[option.value];
                allOptionsHTML += `
                    <div class="listItem ${isSelected ? `selected ${selectedFontBold ?  'font-bold' : ''} ${selectedFontItalic ?  'font-italic' : ''} ${selectedFontUnderline ?  'font-underline' : ''}` : `${unselectedFontBold ?  'font-bold' : ''} ${unselectedFontItalic ?  'font-italic' : ''} ${unselectedFontUnderline ?  'font-underline' : ''}`}" style="${isSelected ? `background-color: ${selectedBackgroundColor}; color: ${selectedTextColor};` : `background-color: ${unselectedBackgroundColor}; color: ${unselectedTextColor}; border-color: ${attributeSeperatorColor}`}; margin-${layout === 'vertical' ? 'bottom': 'right'}: ${attributeSeperatorMargin}px; display: flex; align-items: center; justify-content: ${textAlign || 'left'}; height: ${itemHeight}px"
                        onclick="u.virtualList.toggleSelectedValue(this, '${selector}', ${optionIdx}, ${maxSelections || 1}, '${!option.label ? option.label : option.label?.toString()?.replaceAll("'", "\\\'")?.replaceAll('"', "\\\"")}', '${!option.value ? option.value : option.value?.toString()?.replaceAll("'", "\\\'")?.replaceAll('"', "\\\"")}')">
                        ${option.label}
                    </div>
                `;
            });

            if (!allOptionsHTML.length) {
                allOptionsHTML += `<small>No records to display</small>`;
            }

            allOptionsHTML += `
                    </div>
                </div>
            `;

            $(selector).html(allOptionsHTML);
        }
    },
    multiSelect: {
        currentlyShowing: undefined,
        selectedValues: {},
        maxSelections: {},
        options: {},
        onChange: {},
        create: ({
            selector = '',
            name = '',
            id = new Date().getTime(),
            maxSelections = undefined,
            options = [],
            onChange = () => {},
        }) => {
            u.multiSelect.options[selector] = options;
            u.multiSelect.onChange[selector] = onChange;
            u.multiSelect.maxSelections[selector] = maxSelections;

            // Set default selected options
            if (!maxSelections && !u.multiSelect.selectedValues[selector]) {
                u.multiSelect.selectedValues[selector] = {};
                options.forEach((option) => {
                    if (option.selected) {
                        u.multiSelect.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                    }
                });    
            } else if (u.multiSelect.selectedValues[selector] === undefined) {
                u.multiSelect.selectedValues[selector] = {};
            }

            if (maxSelections && Object.keys(u.multiSelect.selectedValues[selector] || {}).length > maxSelections) {
                u.multiSelect.selectedValues[selector] = {};
            }

            // Set default selections
            if (u.multiSelect.selectedValues[selector] === undefined) {
                if (!maxSelections) {
                    u.multiSelect.markAllSelected(selector, true)
                } else {
                    u.multiSelect.options[selector].slice(0, maxSelections).forEach((option) => {
                        u.multiSelect.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                    });
                }    
            }

            // Build UI for menu trigger
            $(selector).html(`
                <div class="uMultiSelect trigger" id="${id}">
                    <span class='selectedValuesContainer'>
                        <span class='numSelectedValues'>
                            ${u.multiSelect.getSelectedValuesHTML(selector)}
                        </span>
                    </span>
                    <span class='selectedValues'></span>
                </div>
            `);

            // Bind click event on trigger
            $(`#${id}`).on('click', () => u.multiSelect.showOptionsContainer({ selector, name, maxSelections, onChange }));
        },
        markAllSelected: (selector, allSelected) => {
            event.stopPropagation();

            u.multiSelect.options[selector].forEach((option) => {
                if (allSelected) {
                    u.multiSelect.selectedValues[selector][option.value] = { label: option.label, value: option.value };
                } else {
                    delete u.multiSelect.selectedValues[selector][option.value];
                }
            });
            $(selector).find('.numSelectedValues').html(u.multiSelect.getSelectedValuesHTML(selector));

            u.multiSelect.showOption({ selector, filter: $('#uMultiSelectFilter').val() });
        },
        showOptionsContainer: ({ selector, name }) => {
            u.multiSelect.currentlyShowing = { selector, name };

            const openListBottom = window.innerHeight - $(selector)[0].getClientRects()[0].bottom > 220;
            const optionsContainer = `
                <div class="d-flex flex-column${openListBottom ? '' : '-reverse'}">
                    <div class="uMultiSelectFilterContainer"><input type='search' id='uMultiSelectFilter' placeholder='Filter' onclick='u.multiSelect.stopPropagation()' onkeyup='u.multiSelect.filterUpdated(this, "${selector}")' /></div>
                    <div class="allOptions"></div>
                </div>
            `;

            u.popover.showPopover({
                selector,
                id: new Date().getTime(),
                additionalClasses: 'uMultiSelectOptionContainer',
                closeOnBackgroundClick: true,
                position: openListBottom ? 'bottom' : 'top',
                convertToModalOnSmallDevice: false,
                body: optionsContainer,
                showArrowDecorator: false,
                eventsToHidePopover: '',
                onClose: () => {
                    const currentlyShowing = u.multiSelect.currentlyShowing;
                    u.multiSelect.onChange[currentlyShowing.selector]({
                        name: currentlyShowing.name,
                        selectedValues: Object.values(u.multiSelect.selectedValues[currentlyShowing.selector] || {}),
                        allSelected: Object.keys(u.multiSelect.selectedValues[currentlyShowing.selector]).length === u.multiSelect.options[currentlyShowing.selector].length
                    })
                }
            });

            u.multiSelect.showOption({ selector, filter: '' });
        },
        filterUpdated: (e, selector) => {
            const filter = $(e).val();
            u.multiSelect.showOption({ selector, filter });
        },
        showOption: ({ selector, filter = ''}) => {
            const maxSelections = u.multiSelect.maxSelections[selector];
            const allSelected = Object.keys(u.multiSelect.selectedValues[selector]).length === u.multiSelect.options[selector].length;
            const optionsToDisplay = u.multiSelect.options[selector].filter((option) => (option.label || '')?.toString()?.toLowerCase().includes(filter.toLowerCase()));

            let allOptionsHTML = '';
            const containerHeight = Math.min(180, optionsToDisplay.length * 30);

            $('.uMultiSelectOptionContainer').find('.allOptions')
                .html(`<div class="optionContainer overflow-hidden position-relative" style="height: ${(optionsToDisplay.length + (maxSelections ? 0 : 1)) * 30}px"></div>`)
                .off('scroll')
                .on('scroll', () => {
                    u.multiSelect.showOption({ selector, filter });
                });

            const singleOptionHeight = 30;
            const numOptionsToDisplay = parseInt(containerHeight / singleOptionHeight);
            const startAtIndex = Math.max(0, parseInt($('.uMultiSelectOptionContainer').find('.allOptions').scrollTop() / singleOptionHeight) - 10);
            const endAtIndex = startAtIndex + numOptionsToDisplay + 20;

            if (!maxSelections) {
                allOptionsHTML += `
                    <div class='option' onclick="u.multiSelect.markAllSelected('${selector}', ${ allSelected ? false : true })">
                        <span class='isSelected ${allSelected ? 'selected' : ''}'></span>
                        <span>Select All</span>
                    </div>
                `;
            }

            optionsToDisplay.slice(startAtIndex, endAtIndex + 1).forEach((option, optionIndex) => {
                if ((option.label || '')?.toString()?.toLowerCase().includes(filter.toLowerCase())) {
                    allOptionsHTML += `
                        <div class='option position-absolute w-100' style="top: ${(optionIndex + startAtIndex + (maxSelections ? 0 : 1))*30}px" onclick="u.multiSelect.toggleSelectedValue(this, '${selector}', ${maxSelections || undefined}, '${!option.label ? option.label : option.label?.toString()?.replaceAll("'", "\\\'")?.replaceAll('"', "\\\"")}', '${!option.value ? option.value : option.value?.toString()?.replaceAll("'", "\\\'")?.replaceAll('"', "\\\"")}')">
                            <span class='isSelected ${maxSelections === '1' ? 'singleSelect' : '' } ${u.multiSelect.selectedValues[selector][option.value] ? 'selected' : ''}'></span>
                            <span class='optionValue' data-value='${!option.value ? option.value : option.value?.toString()?.replaceAll("'", "\\\'")?.replaceAll('"', "\\\"")}'>${option.label}</span>
                        </div>
                    `;
                }
            });
            if (!allOptionsHTML.length) {
                allOptionsHTML += `<small>No records to display</small>`;
            }
            $('.uMultiSelectOptionContainer').find('.allOptions .optionContainer').html(allOptionsHTML);
        },
        stopPropagation: () => {
            event.stopPropagation();
        },
        getSelectedValuesHTML: (selector) => {
            let selectedTags = '';
            const maxSelectionsToDisplay = 5;
            if (Object.keys(u.multiSelect.selectedValues[selector]).length === 0) {
                return '0 selected';
            } else if (Object.keys(u.multiSelect.selectedValues[selector]).length === u.multiSelect.options[selector].length) {
                return 'All selected';
            }
            Object.keys(u.multiSelect.selectedValues[selector]).slice(0, maxSelectionsToDisplay).forEach((selected) => {
                selectedTags += `<span class="multiselect-selected-value">${u.multiSelect.selectedValues[selector][selected]['label']}</span>`;
            });
            if (Object.keys(u.multiSelect.selectedValues[selector]).length > maxSelectionsToDisplay) {
                selectedTags += `<span class="multiselect-selected-value bg-white italic">+ ${Object.keys(u.multiSelect.selectedValues[selector]).length - maxSelectionsToDisplay} more</span>`;
            }
            return selectedTags;
        },
        toggleSelectedValue: (e, selector, maxSelections, label, value) => {
            event.stopPropagation();
            if (!u.multiSelect.selectedValues[selector][value]) {
                if (!maxSelections || maxSelections > Object.keys(u.multiSelect.selectedValues[selector]).length) {
                    u.multiSelect.selectedValues[selector][value] = { label, value };
                    $(e).find('.isSelected').addClass('selected');
                } else if (maxSelections === 1) {
                    u.multiSelect.selectedValues[selector] = {};
                    u.multiSelect.selectedValues[selector][value] = { label, value };
                    $(e).parent().parent().find('.isSelected').removeClass('selected');
                    $(e).find('.isSelected').addClass('selected');
                } else {
                    u.toast.showWarning({ msg: `Max ${maxSelections} options can be selected at once.`, direction: 'topRight' })
                }
            } else {
                delete u.multiSelect.selectedValues[selector][value];
                $(e).find('.isSelected').removeClass('selected');
            }

            if (Object.keys(u.multiSelect.selectedValues[selector]).length === u.multiSelect.options[selector].length) {
                u.multiSelect.markAllSelected(selector, true)
            } else {
                $(selector).find('.numSelectedValues').html(`<span>${u.multiSelect.getSelectedValuesHTML(selector)}</span>`);
            }
            u.multiSelect.showOption({ selector, filter: '' });
        },
        getSelectedValues: ({ selector }) => {
            return Object.keys(u.multiSelect.selectedValues[selector]);
        }
    },
    input: {
        ctrlPressed: false,
        shiftPressed: false,
        inputChangeCallback: {},
        inputFocusedCallback: {},
        inputBlurredCallback: {},
        isValidNewChar: {},
        dateRangeOptions: {},
        zoomOpenFor: undefined,
        create: ({
            selector = '',
            id = undefined,
            placeholder = '',
            type = 'text',
            format = '',
            name = '',
            autocomplete = 'off',
            onchange = () => { },
            isValidNewChar = () => { return true; },
            onfocus = () => { },
            onblur = () => { },
            textAlign = undefined,
            blocks = [],
            delimeter = ' ',

            // input type fille
            multiple = false,
            accept = '',
            inputFileLimit = 999,

            // input type date
            showDateSelector = true,
            dateRange = { date: new Date() },
            dateRangeOptions = [],
            isDateRangeSelector = false
        }) => {
            id = id !== undefined ? id : selector.replace(" ", "_").replace("#", "") + "_uInput";
            u.input.isValidNewChar[id] = isValidNewChar;
            u.input.inputChangeCallback[id] = onchange;
            u.input.inputFocusedCallback[id] = onfocus;
            u.input.inputBlurredCallback[id] = onblur;

            if (textAlign === undefined && ['int-currency', 'ind-currency'].includes(format)) {
                textAlign = 'right';
            } else if (textAlign === undefined) {
                text = 'left';
            }

            if (type === 'file') {
                inputHTML = ` <div class="inputContainer">
                                    <div class="inputDisplay files">
                                        <button class="addFileButton" onclick="u.input.getFileInput(this)">Add File</button>
                                        <div class="files"></div>
                                        <div class="numberOfFiles"></div>
                                    </div>
                                    <input type="${type}" id='${id}' class="userInputController" name='${name}' ${multiple ? 'multiple' : ''} ${accept}
                                        onfocus="u.input.inputFocused(this)" onblur="u.input.inputBlurred(this)" onkeyup="u.input.inputChanged(this)" onchange="u.input.fileInputRecieved(this)" data-inputfilelimit=${inputFileLimit}
                                        data-type="${type}" />
                                </div>
                            `;
            } else if (type === 'date') {
                u.input.dateRangeOptions[id] = dateRangeOptions;
                inputHTML = `   <div class="inputContainer" data-selector='${selector}'>
                                    <div class="inputDisplay" onclick="u.input.handleInput(this)">
                                        <pre class="lValue"></pre>
                                        <pre class="rValue"></pre>
                                    </div>
                                    <input type="text" id='${id}' class="userInputController" autocomplete="${autocomplete}" placeholder="${placeholder}" name='${name}'
                                        onfocus="u.input.inputFocused(this)" onblur="u.input.inputBlurred(this)" onkeydown="u.input.inputChanged(this)"
                                        data-type="${type}" data-contentdirection="${textAlign}" data-format="${format}" data-showdateselector="${showDateSelector}" data-daterange=${JSON.stringify(dateRange)} data-isdaterangeselector=${isDateRangeSelector}
                                        data-blocks="${JSON.stringify(blocks)}" data-delimeter="${delimeter}" />
                                </div>
                            `;
            } else {
                inputHTML = `    <div class="inputContainer">
                                    <div class="inputDisplay" onclick="u.input.handleInput(this)">
                                        <pre class="lValue"></pre>
                                        <pre class="rValue"></pre>
                                    </div>
                                    <input type="text" id='${id}' class="userInputController" autocomplete="${autocomplete}" placeholder='${placeholder}' name='${name}'
                                        onfocus="u.input.inputFocused(this)" onblur="u.input.inputBlurred(this)" onkeydown="u.input.inputChanged(this)"
                                        data-type="${type}" data-contentdirection="${textAlign}" data-format="${format}"
                                        data-blocks="${JSON.stringify(blocks)}" data-delimeter="${delimeter}" />
                                </div>
                            `;
            }
            $(selector).html(inputHTML);

            const inputDisplay = $(selector).find('.inputDisplay');
            u.input.default.checkForPlaceholderDisplay(inputDisplay);
            if (textAlign === 'right') {
                $(inputDisplay).css('justify-content', 'end').css('flex-direction', 'row-reverse');
            }
        },
        getFiles: (selector) => {
            return $(selector).find('.inputContainer .inputDisplay').data('images');
        },
        clearAllSelectedFiles: (selector) => {
            $(selector).find('.inputContainer .inputDisplay').data('images', []);
            u.input.showFilesInInputBox($(selector).find('.inputContainer .inputDisplay'));
        },
        getFileInput: (e) => {
            $(e).parent().parent().find('.userInputController')[0].click();
        },
        fileInputRecieved: (e) => {
            const files = e.files;
            const inputFileLimit = $(e).data('inputfilelimit');
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const currentImages = $(e).parent().find('.inputDisplay').data('images') || [];
                    if (currentImages.length >= inputFileLimit) {
                        u.toast.showError({ msg: `No more than ${inputFileLimit} can be added. Please remove added files first.` });
                        return;
                    }
                    const newFile = reader.result;
                    if (currentImages.indexOf(newFile) === -1) {
                        currentImages.push(newFile);
                        $(e).parent().find('.inputDisplay').data('images', currentImages);
                        u.input.showFilesInInputBox(e);
                    } else {
                        u.toast.showHint({ msg: 'A duplicate image was not added' });
                    }
                }

                reader.readAsDataURL(file);
            });

        },
        showFilesInInputBox: (e) => {
            const currentImages = $(e).parent().find('.inputDisplay').data('images') || [];
            let imagesHTML = '';
            currentImages.forEach((image) => {
                imagesHTML += ` <img src="${image}" onclick="u.input.showFileThumbnailInModal(this)" /> `;
            });
            $(e).parent().find('.files .files').html(imagesHTML);
            $(e).parent().find('.inputDisplay .numberOfFiles').html(currentImages.length > 0 ? currentImages.length : '')
                .css("display", currentImages.length > 0 ? "flex" : "none");
        },
        removeFileFromSelected: (imageIndex) => {
            const currentImages = $(u.input.zoomOpenFor).data('images') || [];
            currentImages.splice(imageIndex, 1);
            $(u.input.zoomOpenFor).data('images', currentImages);
            u.input.showFilesInInputBox($(u.input.zoomOpenFor));

            $(u.input.zoomOpenFor).parent().find('.userInputController').val('');

            $(`#selectedImagesInUContainerModal`).addClass("uCloseMainModalContainer").html('');
            $("body").css("overflow", 'auto');
            setTimeout(() => {
                $(`#selectedImagesInUContainerModal`).parent().fadeOut();
            }, 200);
            setTimeout(() => {
                $(`#selectedImagesInUContainerModal`).parent().remove();
            }, 600)
        },
        showFileThumbnailInModal: (e) => {
            u.input.zoomOpenFor = $(e).parent().parent();
            const thisImage = $(e).attr('src');
            const allImages = $(e).parent().parent().data('images');
            const thisImageIndex = allImages.indexOf(thisImage);

            allImages.forEach((image, imageIndex) => {
                const body = `<div class="zoomedImageContainer" style="padding: 50px 0;">
                                <div class="zoomedImageContainer_imageControls">
                                    <div class="prevImage" onclick="${imageIndex > 0 ? `openGroupedModal(${imageIndex - 1})` : `() => {}`}"></div>
                                    <img src='${image}' style="height: auto; max-height: 80vh; max-width: 90vw; width: auto;"></img>
                                    <div class="nextImage" onclick="${imageIndex < allImages.length - 1 ? `openGroupedModal(${imageIndex + 1})` : `() => {}`}"></div>
                                </div>
                                <div class="zoomedImageContainer_bottomControls"><button onclick="u.input.removeFileFromSelected(${imageIndex})" class="zoomedImageContainer_deleteButton"><i class="fa fa-trash-o" aria-hidden="true"></i> Remove</button></div>
                              <div>`;
                u.modal.openModal({ id: 'selectedImagesInUContainerModal', body, height: 'max-content', width: 'max-content', isGrouped: true, memberCount: allImages.length, memberIndex: imageIndex });
            });

            setTimeout(() => {
                openGroupedModal(thisImageIndex);
            }, 500);
        },
        handleInput: (e) => {
            $(e).parent().find('.userInputController').focus();
            $(e).addClass('isFocused');
        },
        default: {
            displayValueToUser: (inputDisplay) => {
                const lVal = u.input.getLValue(inputDisplay);
                const rVal = u.input.getRValue(inputDisplay);

                $(inputDisplay).find('.lValue').html(lVal);
                $(inputDisplay).find('.rValue').html(rVal);
            },
            checkForPlaceholderDisplay: (inputDisplay) => {
                const lVal = u.input.getLValue(inputDisplay);
                const rVal = u.input.getRValue(inputDisplay);

                if (lVal.length + rVal.length > 0) {
                    $(inputDisplay).find('.rValue').removeClass('placeholder');
                    // $(inputDisplay).css('flex-direction', 'unset');
                    return;
                }

                const placeholder = $(inputDisplay).parent().find('.userInputController').attr('placeholder') || undefined;
                $(inputDisplay).find('.rValue').addClass('placeholder').html(placeholder);
                // $(inputDisplay).css('flex-direction', 'row-reverse')
            }
        },
        date: {
            isValidNewChar: (inputDisplay, key, proposedNewValue) => {
                return false;
            },
            displayValueToUser: (inputDisplay) => {
                return;
            }
        },
        number: {
            isValidNewChar: (inputDisplay, key, proposedNewValue) => {
                returnVal = false;
                if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(key)) || ['.'].includes(key)) {
                    returnVal = true;
                }
                if (proposedNewValue.indexOf('.') !== proposedNewValue.lastIndexOf('.')) {
                    returnVal = returnVal && false;
                }

                const format = $(inputDisplay).parent().find('.userInputController').data('format');
                if (u.input.number.formatSpecificCharValidity[format]) {
                    returnVal = returnVal && u.input.number.formatSpecificCharValidity[format]({ inputDisplay, proposedNewValue });
                }

                return returnVal;
            },
            formatSpecificCharValidity: {
                'ind-currency': ({ proposedNewValue }) => {
                    if (proposedNewValue.split('.')[1] && proposedNewValue.split('.')[1].length > 2) {
                        return false;
                    }
                    return true;
                },
                'int-currency': ({ proposedNewValue }) => {
                    if (proposedNewValue.split('.')[1] && proposedNewValue.split('.')[1].length > 2) {
                        return false;
                    }
                    return true;
                },
                'block': ({ inputDisplay, proposedNewValue }) => {
                    const blocks = $(inputDisplay).parent().find('.userInputController').data('blocks');
                    const maxNumCharacters = blocks.reduce((sum, a) => sum + a, 0);
                    return maxNumCharacters >= proposedNewValue.length;
                }
            },
            format: {
                'u-currency': ({ lVal, rVal, validator }) => {
                    let displayRValue = '';
                    rDecimal = '';
                    lDecimal = '';
                    if (rVal.includes('.')) {
                        rDecimal = `.${rVal.split('.')[1]}`;
                        rVal = rVal.split('.')[0];
                    }

                    rVal = rVal.split("").reverse().join("");
                    for (i of rVal) {
                        if (i !== undefined) {
                            displayRValue = i + displayRValue;
                            displayRValue = validator(displayRValue.length) ? ' ' + displayRValue : displayRValue;
                        }
                    }

                    if (lVal[lVal.length - 1] === '.') {
                        displayRValue = displayRValue.trimStart();
                    }
                    let displayLValue = '';
                    if (lVal.includes('.')) {
                        lDecimal = `.${lVal.split('.')[1]}`;
                        lVal = lVal.split('.')[0];
                    }
                    lVal = lVal.split("").reverse().join("");
                    for (i of lVal) {
                        if (i !== undefined) {
                            displayLValue = i + displayLValue;
                            displayLValue = validator(displayLValue.length + (lDecimal === '' ? displayRValue.length : '')) ? ' ' + displayLValue : displayLValue;
                        }
                    }
                    displayLValue = displayLValue.trimStart();

                    displayRValue += rDecimal.length ? `${rDecimal}` : '';
                    displayLValue += lDecimal.length ? `${lDecimal}` : '';

                    displayLValue = displayLValue.replace(/ /g, ', ');
                    if (displayLValue.includes('.')) {
                        displayRValue = displayRValue.replace(/ /g, '');
                    } else {
                        displayRValue = displayRValue.replace(/ /g, ', ');
                    }

                    if (displayRValue[0] === ',' && displayLValue.length === 0) {
                        displayRValue = displayRValue.replace(/,/, '');
                    }

                    return { displayLValue, displayRValue };
                },
                'ind-currency': ({ lVal, rVal }) => {
                    const validator = (val) => val % 3 === 0;
                    return u.input.number.format['u-currency']({ lVal, rVal, validator });
                },
                'int-currency': ({ lVal, rVal }) => {
                    const validator = (val) => (val - 3) % 4 === 0;
                    return u.input.number.format['u-currency']({ lVal, rVal, validator });
                },
                'block': ({ lVal, rVal, inputDisplay }) => {
                    let blocks = [...$(inputDisplay).parent().find('.userInputController').data('blocks')];
                    const delimeter = $(inputDisplay).parent().find('.userInputController').data('delimeter') || ' ';
                    blocks.reverse();
                    let displayLValue = '';
                    let displayRValue = '';

                    for (i of lVal) {
                        displayLValue += i;
                        if (displayLValue.length === blocks[blocks.length - 1]) {
                            displayLValue = displayLValue + delimeter;
                            e = blocks.pop();
                            blocks[blocks.length - 1] += e + 1;
                        }
                    }
                    for (i of rVal) {
                        displayRValue += i;
                        if (displayLValue.length + displayRValue.length === blocks[blocks.length - 1]) {
                            displayRValue = displayRValue + delimeter;
                            e = blocks.pop();
                            blocks[blocks.length - 1] += e + 1;
                        }
                    }
                    if (!displayRValue.length) {
                        displayLValue = displayLValue.trimEnd();
                        if (displayLValue[displayLValue.length - 1] === delimeter) {
                            displayLValue = displayLValue.slice(0, -1);
                        }
                    }
                    if (displayRValue[displayRValue.length - 1] === delimeter) {
                        displayRValue = displayRValue.slice(0, -1);
                    }

                    return { displayRValue, displayLValue };
                }
            },
            displayValueToUser: (inputDisplay) => {
                let lVal = u.input.getLValue(inputDisplay);
                let rVal = u.input.getRValue(inputDisplay);
                const format = $(inputDisplay).parent().find('.userInputController').data('format');

                let displayLValue, displayRValue;
                if (u.input.number.format[format]) {
                    ({ displayLValue, displayRValue } = u.input.number.format[format]({ lVal, rVal, inputDisplay }));
                } else {
                    displayLValue = lVal;
                    displayRValue = rVal;
                }

                if ($(inputDisplay).parent().find('.userInputController').data('contentdirection') === 'right' && !(displayLValue.length + displayRValue.length)) {
                    $(inputDisplay).css('flex-direction', 'row-reverse')
                } else {
                    $(inputDisplay).css('flex-direction', 'row')
                }

                $(inputDisplay).find('.lValue').html(displayLValue);
                $(inputDisplay).find('.rValue').html(displayRValue);

            }
        },
        getLValue: (inputDisplay) => {
            let value = $(inputDisplay).find('.lValue').data('lValue');
            return value ? value : '';
        },
        getRValue: (inputDisplay) => {
            let value = $(inputDisplay).find('.rValue').data('rValue');
            return value ? value : '';
        },
        correntInputValue: (inputDisplay) => {
            const lVal = u.input.getLValue(inputDisplay);
            const rVal = u.input.getRValue(inputDisplay);
            $(inputDisplay).parent().find('.userInputController').val(lVal + rVal);
        },
        setValue: ({ id, value = '' }) => {
            console.log(value);
            const changeCallback = u.input.inputChangeCallback[id];
            u.input.inputChangeCallback[id] = () => { };

            const input = $(`#${id}`);
            const currentVal = $(input).val() || '';
            currentVal.split('').forEach((char) => {
                u.input.inputChanged(input, 'Backspace');
            });
            value.split('').forEach((char, charIndex) => {
                if (charIndex === value.length - 1) {
                    u.input.inputChangeCallback[id] = changeCallback;
                }
                u.input.inputChanged(input, char);
            });
        },
        pasteContentFromClipboard: (input) => {
            navigator.clipboard.readText()
                .then((value) => {
                    u.input.setValue({ id: $(input).attr('id'), value })
                })
                .catch(err => {
                    console.log('Failed to read clipboard contents.', err);
                });
        },
        inputChanged: (input, key) => {
            let keyPressed;
            if (key === undefined) {
                keyPressed = event.key;
                u.input.ctrlPressed = event.metaKey || event.ctrlKey;
                u.input.shiftPressed = event.shiftKey;
            } else {
                keyPressed = key;
                u.input.ctrlPressed = false;
                u.input.shiftPressed = false;
            }

            const inputDisplay = $(input).parent().find('.inputDisplay');
            const lVal = u.input.getLValue(inputDisplay);
            const rVal = u.input.getRValue(inputDisplay);
            const type = $(input).data('type');
            const id = $(input).attr('id');
            let callUserOnChangeCallback = false;

            // Handle user input
            if (['c', 'C'].includes(keyPressed) && u.input.ctrlPressed) {
                u.copyTextToClipboard(u.input.getLValue(inputDisplay) + u.input.getRValue(inputDisplay));
            } else if (['v', 'V'].includes(keyPressed) && u.input.ctrlPressed) {
                u.input.pasteContentFromClipboard(input);
            } else if (keyPressed === 'ArrowLeft' || keyPressed === 'ArrowUp') {
                if (keyPressed === 'ArrowUp') {
                    u.input.ctrlPressed = true;
                }
                u.input.arrowLeftPressed(input);
                u.input.correntInputValue(inputDisplay);
            } else if (keyPressed === 'ArrowRight' || keyPressed === 'ArrowDown') {
                if (keyPressed === 'ArrowDown') {
                    u.input.ctrlPressed = true;
                }
                u.input.arrowRightPressed(input);
                u.input.correntInputValue(inputDisplay);
            } else if (keyPressed === 'Backspace') {
                u.input.backspacePressed(input);
                u.input.correntInputValue(inputDisplay);
                callUserOnChangeCallback = true;
            } else if (keyPressed === 'Delete') {
                u.input.deletePressed(input);
                u.input.correntInputValue(inputDisplay);
                callUserOnChangeCallback = true;
            } else {
                if (u.input[type] && u.input[type].isValidNewChar && u.input[type].isValidNewChar(inputDisplay, keyPressed, lVal + keyPressed + rVal) && u.input.isValidNewChar[id]({ keyPressed, proposedNewVal: lVal + keyPressed + rVal, currentVal: lVal + rVal, input, action: 'newChar' })) {
                    const newLValue = lVal + keyPressed;
                    $(inputDisplay).find('.lValue').data('lValue', newLValue);
                    u.input.correntInputValue(inputDisplay);
                    callUserOnChangeCallback = true;
                } else if ((!u.input[type] || !u.input[type].isValidNewChar) && keyPressed.length === 1 && u.input.isValidNewChar[id]({ keyPressed, proposedNewVal: lVal + keyPressed + rVal, currentVal: lVal + rVal, input, action: 'newChar' })) {
                    const newLValue = lVal + keyPressed;
                    $(inputDisplay).find('.lValue').data('lValue', newLValue);
                    u.input.correntInputValue(inputDisplay);
                    callUserOnChangeCallback = true;
                } else {
                    $(input).parent().find('.userInputController').val(lVal + rVal)
                }
            }

            // Display value to user
            if (u.input[type] && u.input[type].displayValueToUser) {
                u.input[type].displayValueToUser(inputDisplay);
            } else {
                u.input.default.displayValueToUser(inputDisplay);
            }
            u.input.default.checkForPlaceholderDisplay(inputDisplay);

            // Input changed callback
            if (callUserOnChangeCallback && u.input.inputChangeCallback[id]) {
                const newVal = u.input.getLValue(inputDisplay) + u.input.getRValue(inputDisplay);
                const prevVal = lVal + rVal;
                if (newVal !== prevVal) {
                    u.input.inputChangeCallback[id]({ newVal, prevVal, input, action: 'onchange' });
                }
            }

            $(inputDisplay).find('.lValue').scrollLeft(99999);
            $(inputDisplay).find('.rValue').scrollLeft(-99999);
        },
        inputBlurred: (input) => {
            $(input).parent().find('.inputDisplay').removeClass('isFocused');
            u.input.inputFocusedCallback[$(input).attr('id')] && u.input.inputBlurredCallback[$(input).attr('id')]({ input, action: 'blurred' });
        },
        inputFocused: (input) => {
            const isFocused = $(input).parent().find('.inputDisplay').hasClass('isFocused');
            if (isFocused) {
                return;
            }

            u.input.inputFocusedCallback[$(input).attr('id')] && u.input.inputFocusedCallback[$(input).attr('id')]({ input, action: 'focused' });
            $(input).parent().find('.inputDisplay').addClass('isFocused');

            if ($(input).data('type') === 'date' && $(input).data('showdateselector')) {
                const newId = 'id_' + new Date().getTime().toString();
                $(input).parent().attr("id", newId);

                const dateRange = $(input).data('daterange');
                const id = $(input).attr("id");
                const dateRangeOptions = u.input.dateRangeOptions[id];
                const isDateRangeSelector = $(input).data("isdaterangeselector");

                body = u.input.createDatePopover(newId, dateRange, dateRangeOptions, isDateRangeSelector);
                u.popover.create({ selector: `#${newId}`, body, position: 'bottom', additionalClasses: 'dateRangeSelector' });

                const _date = new Date(dateRange.date);
                const date = _date.getDate();
                const month = _date.getMonth();
                const year = _date.getFullYear();

                u.input.showMonth(date, month, year, 0, `#${newId}_uPopover .uDateSelector1`, true);
                if (isDateRangeSelector) {
                    u.input.showMonth(date, month, year, 0, `#${newId}_uPopover .uDateSelector2`, true);
                    u.input.showMonth(date, month, year, 0, `#${newId}_uPopover .uDateSelector1`, true);
                }
            }
        },
        getDateRangeOptionsHTML: (id, dateRangeOptions, isDateRangeSelector) => {
            dateRangeOptionsHTML = '';
            if (!isDateRangeSelector) {
                dateRangeOptions.forEach((option) => {
                    dateRangeOptionsHTML += `<div onclick="
                        u.input.showMonth(${option.date.date}, ${option.date.month}, ${option.date.year}, 0, '#${id}_uPopover .uDateSelector1', true);
                        u.input.setDate({selector: '#${`${id}_uPopover .uDateSelector1`}', date: ${option.date.date}, month: ${option.date.month}, year: ${option.date.year}});
                    ">${option.label}</div>`;
                });
            } else {
                dateRangeOptions.forEach((option) => {
                    dateRangeOptionsHTML += `<div onclick="
                        u.input.showMonth(${option.startDate.date}, ${option.startDate.month}, ${option.startDate.year}, 0, '#${id}_uPopover .uDateSelector1', true);
                        u.input.showMonth(${option.endDate.date}, ${option.endDate.month}, ${option.endDate.year}, 0, '#${id}_uPopover .uDateSelector2', true);
                        u.input.showMonth(${option.startDate.date}, ${option.startDate.month}, ${option.startDate.year}, 0, '#${id}_uPopover .uDateSelector1', true);
                        u.input.setDate({selector: '#${`${id}_uPopover .uDateSelector1`}', date: ${option.startDate.date}, month: ${option.startDate.month}, year: ${option.startDate.year}});
                        u.input.setDate({selector: '#${`${id}_uPopover .uDateSelector2`}', date: ${option.endDate.date}, month: ${option.endDate.month}, year: ${option.endDate.year}});
                    ">${option.label}</div>`;
                });
            }
            return dateRangeOptionsHTML;
        },
        createDatePopover: (id, dateRange, dateRangeOptions, isDateRangeSelector) => {
            let dateHTML = '';
            if ('date' in dateRange) {
                dateHTML += `
                <div style="display: flex">
                    ${dateRangeOptions && dateRangeOptions.length ? `<div class="uDateRangeOptions"> ${u.input.getDateRangeOptionsHTML(id, dateRangeOptions, isDateRangeSelector)} </div>` : ''}
                    <div class="uDateSelector1" style="flex: 1">
                        <div class="uDateRange_month">
                            <div class="uPrevMonth"><</div>
                            <div class="uCurrentMonth"></div>
                            <div class="uNextMonth">></div>
                        </div>
                        <div class="u_dateRange_weeks">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div class="u_dateRange_daysOfMonth">
                        </div>
                    </div>
                    ${isDateRangeSelector ?
                        `<div class="uDateSelector2" style="flex: 1; margin-left: 20px">
                            <div class="uDateRange_month">
                                <div class="uPrevMonth"><</div>
                                <div class="uCurrentMonth"></div>
                                <div class="uNextMonth">></div>
                            </div>
                            <div class="u_dateRange_weeks">
                                <div>S</div>
                                <div>M</div>
                                <div>T</div>
                                <div>W</div>
                                <div>T</div>
                                <div>F</div>
                                <div>S</div>
                            </div>
                            <div class="u_dateRange_daysOfMonth">
                            </div>
                        </div>` : ''
                    }
                </div>
                `;
            }
            return dateHTML;
        },
        showDecade: (year, selector) => {
            const decadeStart = parseInt(parseInt(year / 10) + '0');
            const decadeEnd = parseInt(parseInt(year / 10) + '9');
            let yearPickerHTML = '';

            for (let yearIndex = 0; yearIndex < 10; yearIndex++) {
                if (yearIndex % 3 === 0) {
                    yearPickerHTML += '<div class="uDateRange_row maxWidth">';
                }
                yearPickerHTML += `<div onclick="u.input.showYear(${decadeStart + yearIndex}, '${selector}')">${decadeStart + yearIndex}</div>`;
                if ((yearIndex + 1) % 3 === 0) {
                    yearPickerHTML += '</div>';
                }
            }
            yearPickerHTML += '';
            $('.u_dateRange_weeks').css("display", "none");

            $(`${selector} .uPrevMonth`).off('click').click(() => u.input.showDecade(parseInt(decadeStart) - 1, selector));
            $(`${selector} .uCurrentMonth`).html(`${decadeStart} - ${decadeEnd}`).off('click');
            $(`${selector} .uNextMonth`).off('click').click(() => u.input.showDecade(parseInt(decadeEnd) + 1, selector));
            $(`${selector} .u_dateRange_daysOfMonth`).html(yearPickerHTML);
        },
        showYear: (year, selector) => {
            let monthPickerHTML = '';
            u.constants.months_short.forEach((month, monthIndex) => {
                if (monthIndex % 3 === 0) {
                    monthPickerHTML += '<div class="uDateRange_row maxWidth">'
                }
                monthPickerHTML += `<div onclick="u.input.showMonth(undefined, ${monthIndex}, ${year}, 0, '${selector}')">${month}</div>`
                if ((monthIndex + 1) % 3 === 0) {
                    monthPickerHTML += '</div>';
                }
            });
            monthPickerHTML += '';
            $(`${selector} .u_dateRange_weeks`).css("display", "none");
            $(`${selector} .uPrevMonth`).off('click').click(() => u.input.showYear(year - 1, selector));
            $(`${selector} .uCurrentMonth`).html(`${year}`).off('click').click(() => u.input.showDecade(year, selector));
            $(`${selector} .uNextMonth`).off('click').click(() => u.input.showYear(year + 1, selector));
            $(`${selector} .u_dateRange_daysOfMonth`).html(monthPickerHTML);
        },
        showMonth: (date, month, year, change, selector, setStartAndEndDates = false) => {
            if (setStartAndEndDates && selector.includes('uDateSelector1')) {
                $(selector.split(' ')[0]).data('startDate', [date, month, year]);
            } else if (setStartAndEndDates && selector.includes('uDateSelector2')) {
                $(selector.split(' ')[0]).data('endDate', [date, month, year]);
            }
            const startDate = $(selector.split(' ')[0]).data('startDate');
            const endDate = $(selector.split(' ')[0]).data('endDate');
            month += change;
            if (month < 0) {
                month = 11;
                year -= 1;
            } else if (month >= 12) {
                month = 0;
                year += 1;
            }
            const dateRangePickerHTML = u.input.createDatePickerForMonth(selector, date, month, year, startDate, endDate);
            $(`${selector} .u_dateRange_weeks`).css("display", "flex");
            $(`${selector} .uPrevMonth`).off('click').click(() => u.input.showMonth(undefined, month, year, -1, selector));
            $(`${selector} .uCurrentMonth`).html(`${u.constants.months[month]} ${year}`).off('click').click(() => u.input.showYear(year, selector));
            $(`${selector} .uNextMonth`).off('click').click(() => u.input.showMonth(undefined, month, year, 1, selector));
            $(`${selector} .u_dateRange_daysOfMonth`).html(dateRangePickerHTML);
        },
        createDatePickerForMonth: (selector, date, month, year, startDate, endDate) => {
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
            const numberOfDaysInLastMonth = new Date(year, month, 0).getDate();
            const lastDayOfMonth = new Date(year, month, numberOfDaysInMonth).getDay();

            let daysOfMonth = [];
            for (let i = firstDayOfMonth; i > 0; i--) {
                daysOfMonth.push([numberOfDaysInLastMonth - i + 1, 'uPrevMonthDates']);
            }

            const _startDate = new Date(startDate[2], startDate[1], startDate[0]).getTime();
            const _endDate = endDate === undefined ? 0 : new Date(endDate[2], endDate[1], endDate[0]).getTime();
            for (let i = 1; i <= numberOfDaysInMonth; i++) {
                let additionalClass = '';
                const currentDate = new Date(year, month, i).getTime();

                if (endDate === undefined && currentDate === _startDate) {
                    additionalClass = 'selected';
                } else if (endDate !== undefined && currentDate >= _startDate && currentDate <= _endDate) {
                    if (currentDate === _startDate && _startDate !== _endDate) {
                        additionalClass = 'selected startDate';
                    } else if (currentDate === _endDate && _startDate !== _endDate) {
                        additionalClass = 'selected endDate';
                    } else {
                        additionalClass = 'selected';
                    }
                }

                if ($(selector).parent().find('.uDateSelector2').length) {
                    if (selector.includes('.uDateSelector2') && currentDate < _startDate) {
                        additionalClass = 'uNextMonthDates';
                    }

                    if (selector.includes('.uDateSelector1') && currentDate > _endDate) {
                        additionalClass = 'uNextMonthDates';
                    }
                }

                daysOfMonth.push([i, additionalClass]);
            }
            for (let i = 6; i >= lastDayOfMonth && daysOfMonth.length % 7 !== 0; i--) {
                daysOfMonth.push([7 - i, 'uNextMonthDates']);
            }

            daysOfMonthHTML = '';
            daysOfMonth.forEach((date, dateIndex) => {
                if (dateIndex % 7 === 0) {
                    daysOfMonthHTML += '<div class="uDateRange_row">'
                }
                daysOfMonthHTML += `<div ${['uPrevMonthDates', 'uNextMonthDates'].includes(date[1]) ? '' : `onclick="u.input.setDate({selector: '${selector}', date: ${date[0]}, month: ${month}, year: ${year}})"`} class="${date[1]}">${date[0]}</div>`
                if ((dateIndex + 1) % 7 === 0) {
                    daysOfMonthHTML += '</div>';
                }
            });

            return daysOfMonthHTML;
        },
        setDate: ({ selector, date, month, year }) => {
            let startDate = $(selector.split(' ')[0]).data('startDate');
            let endDate = $(selector.split(' ')[0]).data('endDate');
            if (selector.includes('uDateSelector1')) {
                startDate = [date, month, year];
            } else if (selector.includes('uDateSelector2')) {
                endDate = [date, month, year];
            }

            $(selector.split(' ')[0]).data('startDate', startDate);
            $(selector.split(' ')[0]).data('endDate', endDate);

            u.input.showMonth(undefined, startDate[1] + 1, startDate[2], -1, selector.split(' ')[0] + ' .uDateSelector1');
            if (endDate !== undefined) {
                u.input.showMonth(undefined, endDate[1] + 1, endDate[2], -1, selector.split(' ')[0] + ' .uDateSelector2');
            }

            startDate = `${startDate[0]} ${u.constants.months_short[startDate[1]]} ${startDate[2]}`;
            if (endDate === undefined) {
                $(selector.split(' ')[0].split('_uPopover')[0]).find('.lValue').html(startDate);
            } else {
                endDate = `${endDate[0]} ${u.constants.months_short[endDate[1]]} ${endDate[2]}`;
                $(selector.split(' ')[0].split('_uPopover')[0]).find('.lValue').html(startDate + ' - ' + endDate);
            }
            $(selector.split(' ')[0].split('_uPopover')[0]).find('.rValue').html('');
        },
        arrowLeftPressed: (input) => {
            const inputDisplay = $(input).parent().find('.inputDisplay');
            const lVal = u.input.getLValue(inputDisplay);
            const rVal = u.input.getRValue(inputDisplay);
            let lastLChar = lVal[lVal.length - 1];
            let newLVal = lVal.substring(0, lVal.length - 1);
            if (u.input.ctrlPressed) {
                lastLChar = lVal;
                newLVal = '';
            }
            if (lastLChar === undefined) {
                return;
            }
            const newRVal = lastLChar + rVal;
            $(inputDisplay).find('.lValue').data('lValue', newLVal);
            $(inputDisplay).find('.rValue').data('rValue', newRVal);
        },
        arrowRightPressed: (input) => {
            const inputDisplay = $(input).parent().find('.inputDisplay');
            const lVal = u.input.getLValue(inputDisplay);
            const rVal = u.input.getRValue(inputDisplay);
            let firstRChar = rVal[0];
            let newRVal = rVal.substring(1, rVal.length);
            if (u.input.ctrlPressed) {
                firstRChar = rVal;
                newRVal = '';
            }
            if (firstRChar === undefined) {
                return;
            }
            const newLVal = lVal + firstRChar;
            $(inputDisplay).find('.lValue').data('lValue', newLVal);
            $(inputDisplay).find('.rValue').data('rValue', newRVal);
        },
        backspacePressed: (input) => {
            const inputDisplay = $(input).parent().find('.inputDisplay');
            let lVal = u.input.getLValue(inputDisplay);
            let lastLChar = lVal[lVal.length - 1];
            if (u.input.ctrlPressed) {
                lastLChar = lVal;
                lVal = '';
            }
            if (lastLChar === undefined) {
                return;
            }
            const newLVal = lVal.substring(0, lVal.length - 1);
            $(inputDisplay).find('.lValue').data('lValue', newLVal);
        },
        deletePressed: (input) => {
            const inputDisplay = $(input).parent().find('.inputDisplay');
            let rVal = u.input.getRValue(inputDisplay);
            let firstRChar = rVal[0];
            if (u.input.ctrlPressed) {
                firstRChar = rVal;
                rVal = '';
            }
            if (firstRChar === undefined) {
                return;
            }
            const newRVal = rVal.substring(firstRChar.length, rVal.length);
            $(inputDisplay).find('.rValue').data('rValue', newRVal);
        }
    },

    popover: {
        create: ({
            selector = '.uTitle',
            id = undefined,
            additionalClasses = "",
            closeOnBackgroundClick = true,
            position = 'right',
            bindToRightClick = false,
            openNow = false,
            convertToModalOnSmallDevice = false,
            body = undefined,
            getBodyFrom = undefined,
            showArrowDecorator = true,
            eventsToShowPopover = 'mouseover',
            eventsToHidePopover = 'mouseout',
            alignToPointerLocation = false
        }) => {
            $(selector).each((index, e) => {
                id = id !== undefined ? id : `${selector.replaceAll("#", "").replaceAll(" ", "_").replaceAll(".", "_")}_uPopover`;

                if (bindToRightClick) {
                    $(e).mousedown((e) => {
                        if (e.target === e.currentTarget && e.button == 2) {
                            u.popover.showPopover({ selector: e, id, additionalClasses, closeOnBackgroundClick, position, convertToModalOnSmallDevice, body, getBodyFrom, showArrowDecorator, eventsToHidePopover });
                            if (alignToPointerLocation) {
                                $(`#${id}`).css('top', event.y).css('left', event.x);
                            }
                        }
                    });
                }

                if (eventsToShowPopover) {
                    $(e)
                        .off(eventsToShowPopover)
                        .off(eventsToHidePopover)
                        .on(eventsToShowPopover, (e) => {
                            u.popover.showPopover({ selector: e, id, additionalClasses, closeOnBackgroundClick, position, convertToModalOnSmallDevice, body, getBodyFrom, showArrowDecorator, eventsToHidePopover });
                        }).on(eventsToHidePopover, (e) => {
                            u.popover.close({ selector });
                        });
                }

                if (openNow) {
                    u.popover.showPopover({ selector: e, id, additionalClasses, closeOnBackgroundClick, position, convertToModalOnSmallDevice, body, getBodyFrom, showArrowDecorator, eventsToHidePopover });
                }
            });
        },
        showPopover: ({ selector, id, additionalClasses, closeOnBackgroundClick, position, convertToModalOnSmallDevice, body, getBodyFrom, showArrowDecorator, eventsToHidePopover, allowBackgroundClick=false, onResizeKeepWithinScreen=false, onClose=() => {} }) => {
            if (convertToModalOnSmallDevice && (window.innerWidth <= 800)) {
                u.modal.openModal({ id, body, header: 'SELECT ONE', height: '40vh', headerBackgroundColor: "transparent" });
            } else {
                const selectorPosition = u.popover.getSelectorPosition(selector);
                if (getBodyFrom !== undefined) {
                    selector = selector.currentTarget || selector;
                    body = $(selector).attr(getBodyFrom);
                    if (body === undefined || body.length === 0) {
                        return;
                    }
                    body = `<div style="padding: 2px 10px; font-family: Arial; color: #212121">${body}</div>`;
                } else if (getBodyFrom === undefined && body === undefined) {
                    // Default getbodyFrom ehen none of body or getBodyFrom is defined
                    selector = selector.currentTarget || selector;
                    body = $(selector).attr('data-title');
                    if (body === undefined || body.length === 0) {
                        return;
                    }
                    body = `<div style="padding: 8px; font-family: Arial; color: #000; font-size: 12px;">${body}</div>`;
                }

                if ($(`#${id}.uPopover`).parent().hasClass("uPopoverBackground")) {
                    $(`#${id}.uPopover`).parent().remove();
                } else {
                    $(`#${id}.uPopover`).remove();
                }
                if (position.startsWith('data')) {
                    position = $(selector).data(position.replace('data-', ''));
                }

                const popoverHTML = `
                                    ${!eventsToHidePopover.includes('mouseout') && !allowBackgroundClick ? `<div class="uPopoverBackground" ${closeOnBackgroundClick ? `onclick="u.popover.closePopover('${id}', true, ${onClose})"` : ''} onContextMenu="return false">` : ''}
                                        <div id="${id}" class="uPopover ${showArrowDecorator ? 'showArrowDecorator' : ''} ${position} ${additionalClasses}" style="${u.popover.getPosition(position, selectorPosition, showArrowDecorator)}">
                                            ${body}
                                        </div>
                                    ${!eventsToHidePopover.includes('mouseout') && !allowBackgroundClick ? `</div>` : ''}
                                    `;

                $('body').append(popoverHTML);
                // Fix popover position if it is overflowing
                const popover = $(`#${id} > div`)[0];
                if (popover) {
                    if (popover.getClientRects()[0].top < 0) {
                        $(`#${id} > div`).css('transform', `translateY(${-popover.getClientRects()[0].top}px)`);
                    } else if (popover.getClientRects()[0].bottom > window.innerHeight) {
                        $(`#${id} > div`).css('transform', `translateY(${window.innerHeight - popover.getClientRects()[0].bottom}px)`);
                    } else if (popover.getClientRects()[0].left < 0) {
                        $(`#${id} > div`).css('transform', `translateX(${-popover.getClientRects()[0].left}px)`);
                    } else if (popover.getClientRects()[0].right > window.innerWidth) {
                        $(`#${id} > div`).css('transform', `translateX(${window.innerWidth - popover.getClientRects()[0].right}px)`);
                    }
                }

                setTimeout(() => {
                    $('.uPopoverBackground[onclick]').off('contextmenu').on('contextmenu', () => u.popover.closePopover(undefined, true, onClose));
                }, 400);

                if (onResizeKeepWithinScreen) {
                    const observedDiv = document.getElementById(id);
                    let isResizing = false;
                    let resizeTimeout;

                    const resizeObserver = new ResizeObserver(entries => {
                      for (let entry of entries) {
                        if (entry.target === observedDiv) {
                          clearTimeout(resizeTimeout);
                          isResizing = true;

                          // Delay the final callback slightly to ensure all transitions are complete
                          resizeTimeout = setTimeout(() => {
                            isResizing = false;
                            const concernedPopover = entry.target;
                            const currentBottom = concernedPopover.getBoundingClientRect().bottom;
                            const windowHeight = window.innerHeight;
                            if (windowHeight < currentBottom) {
                                const moveUpBy = currentBottom - windowHeight;
                                $(entry.target).find(onResizeKeepWithinScreen)[0].style.transition = `0.2s`;
                                $(entry.target).find(onResizeKeepWithinScreen)[0].style.transform = `translateY(-${moveUpBy}px)`;
                            }
                            // Callback logic here
                          }, 100); // Adjust timeout duration as necessary
    
                        }
                      }
                    });

                    resizeObserver.observe(observedDiv);

                    // Listen for the end of the transition event on the accordion elements
                    document.querySelectorAll('.collapse').forEach(collapseElement => {
                      collapseElement.addEventListener('transitionend', (event) => {
                        // Ensure the transitionend event is due to height change
                        if (event.propertyName === 'height' && !isResizing) {
                          clearTimeout(resizeTimeout);
                        }
                      });
                    });    
                }
            }
        },
        getPosition: (position, selectorPosition, showArrowDecorator) => {
            if (position === 'bottom') {
                return `top: ${selectorPosition.bottom}px; left: ${selectorPosition.left}px; width: ${selectorPosition.width}px; ${showArrowDecorator ? 'transform: translateY(12px)' : ''}`
            } else if (position === 'bottom-left') {
                return `top: ${selectorPosition.bottom}px; right: calc(100% - ${selectorPosition.right}px); width: ${selectorPosition.width}px; ${showArrowDecorator ? 'transform: translateY(12px)' : ''}`
            } else if (position === 'bottom-right') {
                return `top: ${selectorPosition.bottom}px; right: calc(100% - ${selectorPosition.right}px); width: ${selectorPosition.width}px; ${showArrowDecorator ? 'transform: translateY(12px)' : ''}`
            } else if (position === 'left') {
                return `bottom: ${window.innerHeight - selectorPosition.bottom}px; right: ${window.innerWidth - selectorPosition.x}px; width: max-content; transform: translateY(calc(50% - ${selectorPosition.height / 2}px)) ${showArrowDecorator ? 'translateX(-12px)' : ''};;`;
            } else if (position === 'left-top') {
                return `top: ${selectorPosition.top}px; right: ${window.innerWidth - selectorPosition.x}px; width: max-content; ${showArrowDecorator ? 'transform: translateX(-12px)' : ''}`;
            } else if (position === 'left-bottom') {
                return `bottom: ${window.innerHeight - selectorPosition.bottom}px; right: ${window.innerWidth - selectorPosition.x}px; width: max-content; ${showArrowDecorator ? 'transform: translateX(-12px)' : ''}`;
            } else if (position === 'right') {
                return `bottom: ${window.innerHeight - selectorPosition.bottom}px; left: ${selectorPosition.right}px; width: max-content; transform: translateY(calc(50% - ${selectorPosition.height / 2}px)) ${showArrowDecorator ? 'translateX(12px)' : ''};`;
            } else if (position === 'right-top') {
                return `top: ${selectorPosition.top}px; left: ${selectorPosition.right}px; width: max-content; ${showArrowDecorator ? 'transform: translateX(12px)' : ''}`;
            } else if (position === 'right-bottom') {
                return `bottom: ${window.innerHeight - selectorPosition.bottom}px; left: ${selectorPosition.right}px; width: max-content; ${showArrowDecorator ? 'transform: translateX(12px)' : ''}`;
            } else if (position === 'top') {
                return `bottom: ${window.innerHeight - selectorPosition.top}px; left: ${selectorPosition.left}px; width: ${selectorPosition.width}px; ${showArrowDecorator ? 'transform: translateY(-12px)' : ''}`;
            } else if (position === 'top-left') {
                return `bottom: ${window.innerHeight - selectorPosition.top}px; right: ${window.innerWidth - selectorPosition.right}px; width: ${selectorPosition.width}px; ${showArrowDecorator ? 'transform: translateY(-12px)' : ''}`;
            }
        },
        getSelectorPosition: (selector) => {
            selector = $(selector)[0].currentTarget || $(selector)[0];
            let selectorPosition = selector.getBoundingClientRect();
            return selectorPosition;
        },
        close: ({ id = undefined, selector = undefined, onClose = null }) => {
            id = id !== undefined ? id : `${selector.replaceAll("#", "").replaceAll(" ", "_").replaceAll(".", "_")}_uPopover`;
            u.popover.closePopover(id, true, onClose);
        },
        closePopover: (id, forceClose = false, onClose) => {
            if (forceClose || (event && $(event.target).hasClass('uPopoverBackground'))) {
                if (id && $(`[id="${id}"]`).parent().hasClass('uPopoverBackground')) {
                    $(`[id="${id}"]`).parent().remove();
                } else {
                    $(`[id="${id}"]`).remove();
                }

                if (onClose) {
                    onClose();
                }
            }
        }
    },


    // Doc Done
    functions: {
        // Doc Done
        correctDate: ({ date = new Date() }) => {
            date = new Date(date.toString().replace(/ /g, 'T'));
            return u.functions.setNumericPrecision(date.getDate(), 2) + '-' + u.functions.setNumericPrecision(date.getMonth() + 1, 2) + '-' + u.functions.setNumericPrecision(date.getFullYear(), 4);
        },
        // Doc Done
        correctDateAlpha: ({ date = new Date(), shortMonth = false }) => {
            if (typeof date == "string") {
            } else {
                date = date.toDateString();
            }
            date = new Date(date.replace(/-/g, '/'));
            let ret = u.functions.setNumericPrecision(date.getDate(), 2);
            if (shortMonth) {
                ret += ' ' + u.constants.months_short[date.getMonth()];
            }
            else {
                ret += ' ' + u.constants.months[date.getMonth()];
            }
            ret += ' ' + date.getFullYear();
            return ret;
        },
        // Doc Done
        deviceConnection: () => {
            return { downlink: window.navigator.connection.downlink, effectiveType: window.navigator.connection.effectiveType };
            // Doc Done
        },
        // Doc Done
        indianNumberFormat: ({ number = 0, currency = "" }) => {
            return number.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                style: currency ? 'currency' : "decimal",
                currency: currency ? currency : undefined
            });
        },
        // Doc Done
        internationalNumberFormat: ({ number = 0, currency = "" }) => {
            return number.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                style: currency ? 'currency' : "decimal",
                currency: currency ? currency : undefined
            });
        },
        // Doc Done
        isDeviceOnline: () => {
            return window.navigator.onLine;
        },
        // Doc Done
        lockInDevTools: () => {
            setTimeout(() => { debugger }, 1000);
        },
        // Doc Done
        openNavDrawer: (navClass, fillMenu) => {
            if (navClass == "uLeftDrawer") {
                if (fillMenu === undefined || fillMenu) {
                    fillUpMenu("menu", "left");
                }
                $("." + navClass).removeClass("closedLeftDrawer").css("transform", "translateX(-100vw)").addClass("openLeftDrawer");
            }
            else {
                if (fillMenu === undefined || fillMenu) {
                    fillUpMenu("menu", "right");
                }
                $("." + navClass).removeClass("closedRightDrawer").css("transform", "translateX(100vw)").addClass("openRightDrawer");
            }
        },
        // Doc Done
        setNumericPrecision: (data, precision) => {
            data = '' + data;

            data = data.split(".");
            let decimal = data[1];
            data = data[0];

            while (data.length < precision) {
                data = '0' + data;
            }
            if (decimal) {
                return data + "." + decimal;
            }
            else {
                return data;
            }
        },
        // Doc Done
        sleep: (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        // Doc Done
        tabs: {
            init: ({ selector = '', headerDirection = "topLeft", tabContentHeight = -1, defaultTabBackgroundColor = "#F1F1F1", defaultContentBackgroundColor = "#F1F1F1", defaultTabColor = "#212529", selectedTabBackgroundColor = "#2196F3", selectedTabColor = "white", initialTab, onActivate = null }) => {
                if (window.innerWidth < 600) {
                    $(` ${selector} .uTabsHeader`).css("flex-direction", "column").css("height", $($(` ${selector} .uTabsHeader div`)[0]).innerHeight() + "px").css("overflow", "scroll").css("width", "100%");
                    $(` ${selector} .uTabsHeader div`).css("min-width", $(` ${selector} .uTabsHeader`).innerWidth() + "px");
                    $(` ${selector} .uTabsHeader div`).append(`<div class='uTabsToggleHeaderHeight'><i class="fa fa-caret-down" aria-hidden="true"></i></div>`);

                    $(`${selector} .uTabsToggleHeaderHeight`).click((e) => {
                        if ($(` ${selector} .uTabsHeader i`).hasClass("fa-caret-down")) {
                            // Needs To be opened
                            u.functions.tabs.openTabMenu({ selector });
                        } else {
                            // Needs To be closed
                            u.functions.tabs.closeTabMenu({ selector });
                        }
                    });
                }
                u.functions.tabs.initClickEvents({ selector });
                if (headerDirection == "topCenter") {
                    $(` ${selector} > .uTabsHeader`).css("align-self", "center");
                } else if (headerDirection == "topRight") {
                    $(` ${selector} > .uTabsHeader`).css("align-self", "flex-end");
                } else if (headerDirection == "bottomLeft") {
                    $(`${selector}.uTabsContainer`).css("flex-direction", "column-reverse");
                } else if (headerDirection == "bottomCenter") {
                    $(`${selector}.uTabsContainer`).css("flex-direction", "column-reverse");
                    $(` ${selector} > .uTabsHeader`).css("align-self", "center");
                } else if (headerDirection == "bottomRight") {
                    $(`${selector}.uTabsContainer`).css("flex-direction", "column-reverse");
                    $(` ${selector} > .uTabsHeader`).css("align-self", "flex-end");
                }

                if (tabContentHeight != -1) {
                    $(`${selector} > .uTabs > li`).css("height", tabContentHeight);
                }

                $(` ${selector} > .uTabsHeader`).data("defaultTabBackgroundColor", defaultTabBackgroundColor);
                $(` ${selector} > .uTabsHeader`).data("defaultTabColor", defaultTabColor);
                $(` ${selector} > .uTabsHeader`).data("selectedTabBackgroundColor", selectedTabBackgroundColor);
                $(` ${selector} > .uTabsHeader`).data("selectedTabColor", selectedTabColor);
                $(` ${selector} > .uTabsHeader`).data("onActivate", onActivate);

                $(`${selector} .uTabs`).css("background-color", defaultContentBackgroundColor);
                $(`${selector} > .uTabsHeader > div.selectedTab label`).css("background-color", selectedTabBackgroundColor).css("color", selectedTabColor);
                $(`${selector} > .uTabsHeader > div:not(.selectedTab) label`).css("background-color", defaultTabBackgroundColor).css("color", defaultTabColor);

                u.functions.tabs.changeTabToPage({selector, page: initialTab || 1});
                if (onActivate) {
                    onActivate(initialTab || 1);
                }
            },
            initClickEvents: ({ selector  }) => {
                $(`${selector} > .uTabsHeader div`).off('click').click((e) => {
                    if (
                        $(e.target).hasClass("uTabsToggleHeaderHeight") ||
                        ($($($(e.target)[0])[0]).hasClass("fa-caret-up") || $($($(e.target)[0])[0]).hasClass("fa-caret-down"))
                    ) {
                        return;
                    }
                    if ($($($(e.target).parent())[0]).hasClass("selectedTab") || $($($($(e.target).parent()[0]).parent()[0])).hasClass("selectedTab")) {
                        u.functions.tabs.closeTabMenu({selector, openTabMenu: false});
                        return;
                    }
                    $(`${selector} .uTabsHeader *`).css("pointer-events", "none");
                    let div = $($(e.target)[0])[0];
                    if (div.tagName == "LABEL") {
                        div = $(div).parent()[0];
                    } else if (div.tagName == "I") {
                        div = $($(div).parent()[0]).parent()[0];
                    }
                    
                    let page = $(div).data("page");
                    u.functions.tabs.changeTabToPage({selector, page});
                    
                    let onActivate = $(`${selector} .uTabsHeader`).data("onActivate");
                    if (onActivate) {
                        onActivate(page);
                    }

                    $(`${selector} .uTabsHeader *`).css("pointer-events", "all");
                });
            },
            changeTabToPage: ({selector, page}) => {
                $(`${selector} > .uTabs > li`).each((index, item) => {
                    if ($(item).data("page") == page) {
                        $(`${selector} .uTabs > li`).fadeOut(150);
                        // setTimeout(() => {
                        $(`${selector} .uTabs > li`).css("display", "none");
                        $(item).fadeIn(150);
                        // }, 150);
                    }
                });
                $(`${selector} > .uTabsHeader div`).each((index, item) => {
                    if ($(item).data("page") == page) {
                        let defaultTabBackgroundColor = $(`${selector} .uTabsHeader`).data("defaultTabBackgroundColor");
                        let defaultTabColor = $(`${selector} .uTabsHeader`).data("defaultTabColor");
                        $(`${selector} .uTabsHeader .selectedTab label`).css("background-color", defaultTabBackgroundColor).css("color", defaultTabColor);
                        $(`${selector} .uTabsHeader .selectedTab`).removeClass("selectedTab");
                        $(item).addClass("selectedTab");

                        let selectedTabBackgroundColor = $(`${selector} .uTabsHeader`).data("selectedTabBackgroundColor");
                        let selectedTabColor = $(`${selector} .uTabsHeader`).data("selectedTabColor");
                        $(`${selector} .selectedTab label`).css("background-color", selectedTabBackgroundColor).css("color", selectedTabColor);
                    }
                });

                if ($(`${selector} > .uTabsToggleHeaderHeight`).length > 0) {
                    u.functions.tabs.closeTabMenu({ selector });
                    let position = $(".selectedTab").position().top;
                    $(`${selector} .uTabsHeader`).scrollTop(position);
                }
            },
            openTabMenu: ({ selector }) => {
                $(`${selector} .uTabsContainer`).css("padding-top", $(`${selector} .uTabsHeader`).innerHeight() + 5 + "px");
                $(`${selector} .uTabsHeader`).css("position", "absolute").css("top", "0").css("box-shadow", "rgb(130, 130, 130) 0px 2px 6px 0px");
                $(`${selector} .uTabsHeader`).css("height", "auto");
                $(`${selector} .uTabsHeader .uTabsToggleHeaderHeight i`).removeClass("fa-caret-down").addClass("fa-caret-up");
            },
            closeTabMenu: ({selector, openTabMenu = true}) => {
                $(`${selector} .uTabsContainer`).css("padding-top", "0px");
                $(`${selector} .uTabsHeader`).css("position", "relative");
                // .css("box-shadow", "rgb(130, 130, 130) 0px 0px 0px 0px");
                $(`${selector} .uTabsHeader`).css("height", $($(`${selector} .uTabsHeader div`)[0]).innerHeight() + "px");
                $(`${selector} .uTabsHeader .uTabsToggleHeaderHeight i`).removeClass("fa-caret-up").addClass("fa-caret-down");

                if (openTabMenu) {
                    $(`${selector} .uTabsHeader div`).off("click");
                    u.functions.tabs.initClickEvents({ selector });
                    $(`${selector} .uTabsHeader .selectedTab`).click(() => {
                        u.functions.tabs.openTabMenu({ selector });
                    });
                }
            },
        },
        // Doc Done
        voiceRecognition: {
            init: () => {
                var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
                var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
                var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

                var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + u.recogniseThesePhrases.join(' | ') + ' ;';

                var speechRecognitionList = new SpeechGrammarList();
                speechRecognitionList.addFromString(grammar, 1);

                u.recognition = new SpeechRecognition();
                u.recognition.grammars = speechRecognitionList;
                u.recognition.continuous = false;
                u.recognition.lang = 'en-US';
                u.recognition.interimResults = false;
                u.recognition.maxAlternatives = 1;

                u.recognition.onresult = event => {
                    let customEvent = new CustomEvent(
                        "voiceRecognition",
                        {
                            detail: {
                                result: true,
                                type: "result",
                                transcript: event.results[0][0].transcript,
                                confidence: event.results[0][0].confidence
                            },
                            bubbles: true,
                            cancelable: true
                        }
                    );
                    document.body.dispatchEvent(customEvent);
                }

                u.recognition.onspeechend = () => {
                    u.recognition.stop();
                }

                u.recognition.onnomatch = event => {
                    let customEvent = new CustomEvent(
                        "voiceRecognition",
                        {
                            detail: {
                                result: false,
                                type: "no match",
                                transcript: "Could not recognize that",
                            },
                            bubbles: true,
                            cancelable: true
                        }
                    );
                    document.body.dispatchEvent(customEvent);
                }

                u.recognition.onerror = event => {
                    let customEvent = new CustomEvent(
                        "voiceRecognition",
                        {
                            detail: {
                                result: false,
                                type: "error",
                                transcript: "Error occured in recognition",
                            },
                            bubbles: true,
                            cancelable: true
                        }
                    );
                    document.body.dispatchEvent(customEvent);
                }
            },

            startRecognition: () => {
                if (u.recognizingVoice) {
                    u.functions.voiceRecognition.stopRecognition();
                    u.recognizingVoice = false;
                    return;
                }
                u.recognizingVoice = true;
                u.recognition.start();
            },

            stopRecognition: () => {
                u.recognition.stop();
            },
        },
    },
}

window.onload = (e) => {
    $('body').data("pageLoad", []);

}

if (u_isMobileDevice()) {

    u_createBackPageEvent = (gotoLocation) => {
        // var event = new CustomEvent("cat", { detail: { hazcheeseburger: true } });
        var evt = new CustomEvent("backPageTransition", { detail: { url: gotoLocation } });
        window.top.dispatchEvent(evt);
    }

    window.onpopstate = history.onpushstate = function (e) {
        gotoLocation = e.target.location.href;
        callBackPageEvent();
        if ($(".prevPage").length > 0) {
            // Previous page exists
            directions = $("body").data("pageLoad");
            x = directions.pop();
            $("body").data("pageLoad", directions);
            if (x == "right") {
                $(".activePage").addClass("transitionPageRight");
            } else if (x == "up") {
                $(".activePage").addClass("transitionPageDown");
            }

            setTimeout(() => {
                $(".activePage").remove();
                $(".prevPage")
                    .removeClass("prevPage")
                    .removeClass(function (index, className) {
                        return (className.match(/(^|\s)transitionPage\S+/g) || []).join(' ');
                    })
                    .addClass("activePage")
                    .css("transition", "0s")
                    .css("transform", "translateX(0)");

                if ($(".activePage").css("z-index") == "-1") {
                    $(".activePage").css("z-index", "0");
                }

            }, 500);

            u_createBackPageEvent(gotoLocation);
        } else {
            // Previous Page does not exists
            $(".loadingPage").remove();
            $(".loadingPageAtBack").remove();
            if (u.basePages.includes(gotoLocation)) {
                window.top.location.href = gotoLocation;
                return;
            }
            var html = "";
            html +=
                "<iframe src='" +
                gotoLocation +
                "' class='loadingPageAtBack' onload='transitionToBackPage()' ></iframe>";
            $("body").append(html);
        }
    };
}

closeCenterBodyContent = (id, backgroundScroll = $("body").css("overflow"), onClose) => {
    $("#" + id).fadeOut(400);
    setTimeout(() => {
        $("body").css("overflow", backgroundScroll);
        $("#" + id).remove();
        if (onClose) {
            onClose();
        }
    }, 450);
};

closeDrawer = (id, backgroundScroll = "auto", onClose) => {
    $("#" + id).fadeOut(400);
    $("#" + id + " .uDrawer_container")
        .removeClass("open_uDrawer_container")
        .css("transition", "0s")
        .css("transform", "translateY(-100vh)")
        .addClass("close_uDrawer_container");

    $("body").css("overflow", backgroundScroll);
    setTimeout(() => {
        $("#" + id).remove();
        if (onClose) {
            onClose();
        }
    }, 150)
};

closeCenterBodyContentOnBackgroundClick = (id, backgroundScroll = "auto", onClose) => {
    if ($(event.target).hasClass("uModal") || $(event.target).hasClass("closeNotice")) {
        closeCenterBodyContent(id, backgroundScroll, onClose);
    }
};

closeDrawerOnBackgroundClick = (id, backgroundScroll = "auto", onClose) => {
    if ($(event.target).hasClass("uDrawer")) {
        closeDrawer(id, backgroundScroll, onClose);
        $("body").css("overflow", backgroundScroll);
    }
}

closeNavDrawer = (navClass, onClose) => {
    if ($(event.target).hasClass('uRightDrawer') || $(event.target).hasClass('uLeftDrawer')) {
        $("body").css("overflow", u.backgroundScroll);

        if (navClass == "uLeftDrawer") {
            fillUpMenu("menu", "left");
            $("." + navClass).addClass("closedLeftDrawer").removeClass("openLeftDrawer");
        }
        else {
            fillUpMenu("menu", "right");
            $("." + navClass).addClass("closedRightDrawer").removeClass("openRightDrawer");
        }
        // Correct this location
        if (onClose) {
            onClose();
        }
    } else if ($(event.target).hasClass('leftDrawerContainer')) {
        $("body").css("overflow", u.backgroundScroll);
        if (navClass == "uLeftDrawer") {
            $("." + navClass).addClass("closedLeftDrawer").removeClass("openLeftDrawer");
        }
        else {
            $("." + navClass).addClass("closedRightDrawer").removeClass("openRightDrawer");
        }
        // Correct this location
        if (onClose) {
            onClose();
        }
    }
}

closeMainModal = (id, backgroundScroll, onClose, forceClose = false) => {
    if (forceClose || $(event.target).hasClass("bi-x") || $(event.target).hasClass("uMainModalContainer") || $(event.target).hasClass("uMainModal_closeButton")) {
        $("#" + id).addClass("uCloseMainModalContainer");
        // $("body").css("overflow", backgroundScroll);
        setTimeout(() => {
            $($("#" + id)).parent().fadeOut();
        }, 200);
        setTimeout(() => {
            $($("#" + id)).parent().remove();
        }, 600)
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 500);
    }
}

closeMainModalOnBackgroundClick = (id, backgroundScroll, onClose) => {
    if ($(event.target).hasClass("uMainModalContainer")) {
        closeMainModal(id, backgroundScroll, onClose);
    }
}

closeToast = (id) => {
    $('#' + id).addClass("closeToast");
    setTimeout(() => {
        $('#' + id).remove();
    }, 600)

}

uConsole = ({ type = "", data, css }) => {
    if (type == "log" || type == "") {
        if (type == "log") {
            console.log(data);
        }
        else if (typeof data == "string") {
            console.log("%c " + data, css);
        }
        else if (typeof data == "object") {
            if (data.length < 50) {
                console.table(data);
            }
            else {
                console.log(data);
            }
        }
        else {
            console.log(typeof data);
            console.log(data);
        }
    }
    else {
        console[type](data);
    }
}

setNavMenuTitle = (direction) => {
    let menuTitle = "";


    let depth = $(".menuTitle").data("depth");
    let opacity = 1;
    if (depth?.length == 1) {
        menuTitle += "<span>" + depth[0][1] + "</span>";
    }
    else if (depth?.length > 1) {
        for (let i = 0; i < depth.length; i++) {
            if (i != depth.length - 1) {
                menuTitle += "<span style='opacity: " + opacity + "' onclick='fillUpMenu(\"" + depth[i][0] + "\", \"" + direction + "\",\"\", " + true + ")'>" + depth[i][1] + " ></span> ";
            }
            else {
                menuTitle += "<span style='opacity: " + opacity + "'>" + depth[i][1] + "</span>";
            }

            if (opacity > 0.4) {
                opacity -= 0.2;
            }
            else {
                opacity -= 0.05;
            }
        }
    }
    $(".menuTitle").html(menuTitle);
    var leftPos = $('.menuTitle').scrollLeft();
    $(".menuTitle").animate({ scrollLeft: leftPos + 200 }, 800);
}


fillUpMenu = (heading, direction, clicked = "menu", goingBack = false) => {

    if (goingBack) {
        let depth = $(".menuTitle").data("depth");
        while (depth[depth.length - 1][0] != heading) {
            depth.pop();
        }
        $(".menuTitle").data("depth", depth);
    }
    else {
        if (heading == "menu") {
            $(".menuTitle").data("depth", [["menu", "menu"]]);
        }
        else {
            let depth = $(".menuTitle").data("depth");
            depth.push([heading, clicked]);
            $(".menuTitle").data("depth", depth);
        }
    }

    $(".menuContents").fadeOut(100);

    let completeMenu = [];
    if (direction == "left") {
        completeMenu = $("body").data('completeLeftMenu');
    }
    else {
        completeMenu = $("body").data('completeRightMenu');
    }

    setTimeout(() => {
        var html = "";
        let menu = completeMenu[heading];
        for (let i = 0; i < menu.length; i++) {
            if (menu[i][2] >= 0 && menu[i][2] != null) {
                if (direction == "left") {
                    html += "<div id='menuItems' class='verticallyCenterAligned' onclick='fillUpMenu(\"" + menu[i][2] + "\", \"left\" ,\"" + menu[i][1] + "\")'>";
                }
                else {
                    html += "<div id='menuItems' class='verticallyCenterAligned' onclick='fillUpMenu(\"" + menu[i][2] + "\", \"right\" ,\"" + menu[i][1] + "\")'>";
                }
            }
            else if (menu[i][3].length > 0) {
                html += "<div id='menuItems' class='verticallyCenterAligned' onclick='" + menu[i][3] + "(" + menu[i][4] + ")'>";
            }
            else {
                html += "<div id='menuItems' class='verticallyCenterAligned'>";
            }

            html += " <i class='" + menu[i][0] + "'></i>";
            html += menu[i][1];
            if (menu[i][2] >= 0 && menu[i][2] != null) {
                html += "<i style='margin-right: 0;' class='fa fa-caret-right alignRightAbsolute'></i>";
            }
            html += "</div>";
        }

        setNavMenuTitle(direction);
        $(".menuContents").html(html).fadeIn(100);

    }, 125);
}

fillUpMenu2 = (heading, direction, clicked = "menu", goingBack = false) => {

    if (goingBack) {
        let depth = $(".menuTitle").data("depth");
        while (depth[depth.length - 1][0] != heading) {
            depth.pop();
        }
        $(".menuTitle").data("depth", depth);
    }
    else {
        if (heading == "menu") {
            $(".menuTitle").data("depth", [["menu", "menu"]]);
        }
        else {
            let depth = $(".menuTitle").data("depth");
            depth.push([heading, clicked]);
            $(".menuTitle").data("depth", depth);
        }
    }

    $(".menuContents").fadeOut(100);

    let completeMenu = [];
    if (direction == "left") {
        completeMenu = $("body").data('completeLeftMenu');
    }
    else {
        completeMenu = $("body").data('completeRightMenu');
    }

    setTimeout(() => {
        var html = "";
        let menu = completeMenu[heading];
        for (let i = 0; i < menu.length; i++) {
            if (menu[i][2].length > 0) {
                if (direction == "left") {
                    html += "<div id='menuItems' class='verticallyCenterAligned' onclick='fillUpMenu(\"" + menu[i][2] + "\", \"left\" ,\"" + menu[i][1] + "\")'>";
                }
                else {
                    html += "<div id='menuItems' class='verticallyCenterAligned' onclick='fillUpMenu(\"" + menu[i][2] + "\", \"right\" ,\"" + menu[i][1] + "\")'>";
                }
            }
            else if (menu[i][3].length > 0) {
                html += "<div id='menuItems' class='verticallyCenterAligned' onclick='" + menu[i][3] + "(" + menu[i][4] + ")'>";
            }
            else {
                html += "<div id='menuItems' class='verticallyCenterAligned'>";
            }

            html += " <i class='" + menu[i][0] + "'></i>";
            html += menu[i][1];
            if (menu[i][2].length > 0) {
                html += "<i style='margin-right: 0;' class='fa fa-caret-right alignRightAbsolute'></i>";
            }
            html += "</div>";
        }

        setNavMenuTitle(direction);
        $(".menuContents").html(html).fadeIn(100);

    }, 125);
}

transitionPage = (direction) => {
    if (direction == "right") {
        $(".prevPage").remove();
        $(".loadingPage").addClass("transitionPageLeft");

        x = $("body").data("pageLoad");
        if (!x || x == undefined) {
            x = [];
        }
        x.push("right");
        $('body').data("pageLoad", x);

        setTimeout(() => {
            $(".activePage").removeClass("activePage").addClass("prevPage");
            $(".loadingPage")
                .removeClass("loadingPage")
                .removeClass("transitionPageLeft")
                .addClass("activePage")
                .css("transition", "0s")
                .css("transform", "translateX(0)");
            callPageLoadedEvent();
        }, 500);
    }
    else if (direction == "up") {
        $(".prevPage").remove();
        $(".activePage");
        $(".loadingPageTop").addClass("transitionPageUp");

        x = $("body").data("pageLoad");
        x.push("up");
        $('body').data("pageLoad", x);

        setTimeout(() => {
            $(".activePage").removeClass("activePage").addClass("prevPage");
            $(".loadingPageTop")
                .removeClass("loadingPageTop")
                .removeClass("transitionPageUp")
                .addClass("activePage")
                .css("transition", "0s");
            callPageLoadedEvent();
        }, 500);
    }
};

callBackPageEvent = () => {
    setTimeout(() => {
        // Page load complete
        let customEvent = new CustomEvent(
            "backPageEvent",
            {
                detail: {
                    result: false,
                    type: "no match",
                    transcript: "Could not recognize that",
                },
                bubbles: true,
                cancelable: true
            }
        );
        window.top.document.body.dispatchEvent(customEvent);

    }, 300);
}

callPageLoadedEvent = () => {
    setTimeout(() => {
        // Page load complete
        let customEvent = new CustomEvent(
            "pageLoadComplete",
            {
                detail: {
                    result: false,
                    type: "no match",
                    transcript: "Could not recognize that",
                },
                bubbles: true,
                cancelable: true
            }
        );
        document.body.dispatchEvent(customEvent);

    }, 300);
}


transitionToBackPage = () => {

    directions = $("body").data("pageLoad");
    let x;
    if (!directions || !directions.length) {
        x = "right";
    } else {
        x = directions.pop();
    }

    $("body").data("pageLoad", directions);
    if (x == "right") {
        $(".activePage").addClass("transitionPageRight");
    } else if (x == "up") {
        $(".activePage").addClass("transitionPageDown");
    }

    setTimeout(() => {
        $(".activePage").remove();
        $(".loadingPageAtBack")
            .removeClass("loadingPageAtBack")
            .removeClass(function (index, className) {
                return (className.match(/(^|\s)transitionPage\S+/g) || []).join(' ');
            })
            .addClass("activePage")
            .css("transition", "0s")
            .css("transform", "translateX(0)");
    }, 500);

};

openGroupedModal = (index) => {
    if ($(`.uMainModalContainer${index}`).hasClass("uMainModalContainer")) {
        return;
    }

    let currentPage = $(`.uMainModalBackground`).data("currentPage");
    if (index > currentPage) {
        $(`.uMainModalContainer`).addClass("uSlideMainModalLeft").removeClass("uBringMainModalFromLeft").removeClass("uBringMainModalFromRight");

        setTimeout(() => {
            $(`.uMainModalContainer`).removeClass(`uMainModalContainer`).removeClass(`uSlideMainModalLeft`).removeClass(`uBringMainModalFromLeft`);
            $(`.uMainModalContainer${index}`).addClass("uMainModalContainer").addClass("uBringMainModalFromLeft");

            $(`.groupMemberButton`).removeClass("uMainModalCurrentMemeber");
            $(`.groupMemberButton:nth-child(${index + 1})`).addClass("uMainModalCurrentMemeber");
        }, 100);
        $(`.uMainModalBackground`).data("currentPage", index);
    } else {
        $(`.uMainModalContainer`).addClass("uSlideMainModalRight").removeClass("uBringMainModalFromRight").removeClass("uBringMainModalFromLeft");

        setTimeout(() => {
            $(`.uMainModalContainer`).removeClass(`uMainModalContainer`).removeClass(`uSlideMainModalRight`).removeClass(`uBringMainModalFromRight`);
            $(`.uMainModalContainer${index}`).addClass("uMainModalContainer").addClass("uBringMainModalFromRight");

            $(`.groupMemberButton`).removeClass("uMainModalCurrentMemeber");
            $(`.groupMemberButton:nth-child(${index + 1})`).addClass("uMainModalCurrentMemeber");
        }, 100);
        $(`.uMainModalBackground`).data("currentPage", index);
    }
}

setDefaults = (title, msg, backgroundColor, titleColor, animationUrl) => {
    if (!title || !title.length) {
        title = "NOTICE";
    }
    if (!msg || !msg.length) {
        msg = "Notice Msg";
    }
    if (!backgroundColor || !backgroundColor.length) {
        backgroundColor = "#FFCA28";
    }
    if (!titleColor || !titleColor.length) {
        titleColor = "#FFF";
    }
    if (!animationUrl || !animationUrl.length) {
        animationUrl = "./lottie/hint.json";
    }

    return [title, msg, backgroundColor, titleColor, animationUrl];
}

changeNotice = (mem) => {
    currentMem = $(".uModal").data("currentMem");
    if (mem == currentMem) {
        return;
    }
    newContent = $(".uModal").data("content")[mem];
    curContent = $(".uModal").data("content")[currentMem];

    [title, msg, backgroundColor, titleColor, animationUrl] = setDefaults(newContent.title, newContent.msg, newContent.backgroundColor, newContent.titleColor, newContent.animationUrl);

    if (msg != curContent.msg) {
        $(".uNotice .uModal_Container__Msg").fadeTo("fast", "0", () => {
            $(".uNotice .uModal_Container__Msg").html(msg).fadeTo("fast", "1", () => { });
        });
    }

    let html = '        <lottie-player src="' + animationUrl + '" background="transparent" speed="1" autoplay style="height: 40px;max-width: 60px;padding: 0 !important;"></lottie-player>';
    if (title && title.length > 0) {
        html += '         <div class="uModal_Container__Text"  style="color:' + titleColor + ';  margin: 0; padding: 0; text-align: left;">' + title + "</div>";
    }
    $(".uNotice .decorator").html(html);

    $(".uNotice .decorator").css("backgroundColor", backgroundColor);
    $(".uNotice .uModal_Container").css("border-color", backgroundColor);

    $(".uModal").data("currentMem", mem);
    $(`.groupMemberButton`).removeClass(`uMainModalCurrentMemeber`);
    $(`.groupMemberButton:nth-child(${mem + 1})`).addClass(`uMainModalCurrentMemeber`);

    $(".prevNotice").css("border-color", backgroundColor).css("color", backgroundColor);
    $(".nextNotice").css("background-color", backgroundColor);
    $(".closeNotice").css("background-color", backgroundColor);;

    content = $(".uModal").data("content");
    setNoticeButtons(mem, content);
}

prevNotice = () => {
    currentMem = $(".uModal").data("currentMem");
    content = $(".uModal").data("content");

    changeNotice(currentMem - 1);
}

nextNotice = () => {
    currentMem = $(".uModal").data("currentMem");
    content = $(".uModal").data("content");

    changeNotice(currentMem + 1);
}

setNoticeButtons = (currentMem, content) => {
    if (currentMem == 0) {
        $(".prevNotice").css("display", "none");
    } else {
        $(".prevNotice").css("display", "flex");
    }

    if (currentMem == content.length - 1) {
        $(".nextNotice").css("display", "none");
    } else {
        $(".nextNotice").css("display", "flex");
    }

    if (currentMem == content.length - 1) {
        $(".closeNotice").css("display", "flex")
    } else {
        $(".closeNotice").css("display", "none")
    }

}

selectNavInleftDrawer = (e, id) => {
    $(`.leftDrawerContainer.${id} #u_allNavsOpen .currentlySelected`).removeClass('currentlySelected');
    $(e).addClass('currentlySelected');
    const _id = $(e).text().replaceAll(' ', '_');
    console.log(_id);
    $(`.leftDrawerContainer.${id} .u_allNavsContent .currentlyShowing`).removeClass('currentlyShowing').addClass('d-none');
    $(`.leftDrawerContainer.${id} .u_allNavsContent #${_id}`).removeClass('d-none').addClass('currentlyShowing');
}

closeMultiDrawer = (id, direction, onClose) => {
    if (event && !($(event.target).hasClass('canCloseDrawer') || $(event.target).parent().parent().hasClass('canCloseDrawer'))) {
        return;
    }

    if (onClose) {
        onClose();
    }

    $(`#${id}`).css('background-color', 'transparent');
    if (direction === 'left') {
        $(`#${id}`).addClass("closedLeftDrawer").removeClass("openLeftDrawer");
    } else {
        $(`#${id}`).addClass("closedRightDrawer").removeClass("openRightDrawer");
    }

    const count = $('.navInContainer').length - 1;
    $('.navInContainer').each(function (index) {
        index += 1;
        let mt = (50 * (count - index)) + 2;
        $(this).css('margin-top', mt + 'px');
    });
    setTimeout(() => {
        $(`#${id}`).remove();
    }, 300);
}

function u_isMobileDevice() {
    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    return isMobile;
}