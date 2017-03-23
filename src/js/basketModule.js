export default function() {
    //let count = 0;
    //return count;
}
export function isNumber(strn) {
    let patt1 = /\D/g;
    var result = String(strn).match(patt1);
    if (result === null) {
        return true;
    } else {
        return false;
    }
}
export function valItemCount(elm) {
    if (!isNumber(elm.value)) {
        alert("Not a number");
    }
}
export function decrementItemCount() {
    if (isNumber(document.getElementById("itemCount").value)) {
        let itemCount = parseInt(document.getElementById("itemCount").value);
        //console.log(itemCount + " " + typeof itemCount);
        let decCount = itemCount - 1;
        if (decCount <= 0) {
            document.getElementById("decrBut").disabled = true;
        } else {
            document.getElementById("itemCount").value = parseInt(decCount);
        }
    } else {
        alert("Enter a number in this field");
    }

}
export function incrementItemCount() {
    if (isNumber(document.getElementById("itemCount").value)) {
        let itemCount = parseInt(document.getElementById("itemCount").value);
        let incCount = itemCount + 1;
        if (incCount >= 99) {
            document.getElementById("incrBut").disabled = true;
        } else {
            document.getElementById("itemCount").value = parseInt(incCount);
        }
    } else {
        alert("Enter a number in this field");
    }
}


/*export function incrementBasketCount(count) {
    let setCount = sessionStorage.getItem("basketCount");
    count = parseInt(setCount) + count;
    updateBasketSessionStorageData(count);
}

export function decrementBasketCount(count) {
    let updateCount = count - 1;
    return updateCount;
}

export function updateBasketCount(count) {
    //update count in SessionStorage and send update count in header
}

export function saveBasketDataToSessionStorage() {
    //Parse data and save that to SessionStorage    
}

export function updateBasketSessionStorageData(count) {
    sessionStorage.setItem("basketCount", count.toString());
}

export function compareBasketSessionStorageData() {
    //compare SessionStorage data to update
}
export function getBasketSessionStorageData() {

}*/
$(document).ready(function() {
    var getPrdDetailUrl = "https://plrss-data.where-to-buy.co/feeds/plrss/v1/5045095506902?authorizationToken=Z58QH8nvuxDQlHRDCC7M4S7zBVLmfpS0gU3VpbBTPKMrIhG8OyNSnn6OZzq5QD1tbaOHHUOVXDTd2xJOFv826ryI3PUJSdFtP1kFeijU9Ug=&type=json";
    $.get(getPrdDetailUrl, function(data, status) {
            //console.log(data.products.length);
            $("#prdThumbnail").attr("src", data.products[0].retailers[0].product_images[0]);
            $("#prdTitle").html(data.products[0].description);
            $("#prdDescp").html(data.products[0].additional_information);
            $("#prdPrice").html(data.products[0].retailers[0].currency_symbol + " " + data.products[0].retailers[0].price);
            $(".addToBasketBut").data("modelname", data.products[0].model_name);
        }).done(function() {
            // success message
        })
        .fail(function() {
            //failed message
        })
        .always(function() {
            // success message
        });
    $(".addToBasketBut").click(function(e) {
        e.preventDefault();
        var modelName = $(this).data("modelname");
        var quantity = $("#itemCount").val();

        if (parseInt(quantity) === 0) {
            alert("Quantity should be atleast 1");
        } else {
            $(".itemCount").html(quantity);
            var newObj = {
                "ModelName": modelName,
                "Quantity": quantity
            };
            var basketItems = [];
            if (window.sessionStorage) {
                basketItems = JSON.parse(sessionStorage.getItem("basketItems"));
                /*if (basketItems.length === 0) {
                    basketItems[0] = newObj;
                } else {
                    basketItems.push(newObj);
                }*/
                basketItems[0] = newObj;
                //console.log(basketItems.length);
                sessionStorage.setItem("basketItems", JSON.stringify(basketItems));
                //console.log(sessionStorage.getItem("basketItems"));
            }
        }
    });

    var url = document.location.href;
    if (url.indexOf("basket") > -1) {
        $(".loader").show();
        $(".basket").hide();
        $(".clearedBasket").hide();
        //$(".checkoutButContainer").hide();
        var getCart = "";
        var cartReqUrl = "https://rgci-data.where-to-buy.co/rgci/v1/cart";
        var data = {
            "AuthorizationToken": "Z58QH8nvuxDQlHRDCC7M4S7zBVLmfpS0gU3VpbBTPKMrIhG8OyNSnn6OZzq5QD1tbaOHHUOVXDTd2xJOFv826ryI3PUJSdFtP1kFeijU9Ug=",
            "Method": "AddMultiple",
            "CartId": "e8d565f2-7281-4d71-a3ea-d70b6f6263a0",
            "RetailerName": "Boots.uk",
            "Items": JSON.parse(sessionStorage.getItem("basketItems"))
        };
        if (window.sessionStorage) {
            var basketItems = JSON.parse(sessionStorage.getItem("basketItems"));
            if (basketItems.length !== 0) {
                getCart = $.post(cartReqUrl, data, "json");
            } else {
                $(".loader").hide();
                $(".clearedBasket").show();
            }
        }
        //var getCart = $.post(cartReqUrl, data, "json");
        getCart.done(function(response) {
            var items = updateResponse(response);
            $(".loader").hide();
            $(".basket").show();
            //$(".checkoutButContainer").show();
            $('.result').append(items);
            $(".totalPrice").html(response.Cart.TotalPrice);
            $("#CheckoutBut").data("url", response.Cart.PurchaseUrl);
            $("#CheckoutBut1").data("url", response.Cart.PurchaseUrl);
            //$("#CheckoutBut").attr("href", response.Cart.PurchaseUrl);
            //$("#CheckoutBut1").attr("href", response.Cart.PurchaseUrl);


            $(".minus").click(function(e) {
                e.preventDefault();
                var inArr = $(this).data("inarr");
                var itemId = "#itemCount" + inArr;
                var getQtn = $(itemId).val();
                var setQtn = "";
                if (getQtn >= 2) {
                    setQtn = parseInt(getQtn) - 1;
                    $(itemId).val(setQtn);
                    $(this).disabled = false;
                } else {
                    $(this).disabled = true;
                }
            });

            $(".plus").click(function(e) {
                e.preventDefault();
                var inArr = $(this).data("inarr");
                var itemId = "#itemCount" + inArr;
                var getQtn = $(itemId).val();
                var setQtn = parseInt(getQtn) + 1;
                if (setQtn >= 0) {
                    $(itemId).val(setQtn);
                }
            });
            $(".quantity").change(function(e) {
                e.preventDefault();
                var id = "#" + $(this).attr("id");
                var val = $(id).val();
                checkNum(val);
                $(id).focus();
            });
            $(".addToBasketBut").click(function(e) {
                e.preventDefault();
                var inArr = $(this).data("inarr");
                var itemId = "#itemCount" + inArr;
                var itemCount = "#itemCount" + inArr;
                var itemPrice = "#itemPrice" + inArr;
                var itemTotalPrice = "#itemTotalPrice" + inArr;
                var getQtn = $(itemId).val();
                var getItemObj = $(this).data("item");
                $(this).disabled = true;
                $(".checkoutBut").disabled = true;
                if (checkNum(parseInt(getQtn))) {
                    updateQuantity(getItemObj, getQtn, itemCount, itemPrice, itemTotalPrice);
                }
            });
        }).fail(function() {
            $(".loader").hide();
            $(".clearedBasket").show();
        });
    }
    $("#clearBasket").click(function(e) {
        e.preventDefault();
        clearBasket();
    });
    $("#CheckoutBut").click(function(e) {
        clearBasket();
        sessionStorage.setItem("basketItems", JSON.stringify([]));
        window.open($(this).data("url"));
    });
    $("#CheckoutBut1").click(function(e) {
        clearBasket();
        sessionStorage.setItem("basketItems", JSON.stringify([]));
        window.location.href = $(this).data("url");
    });

    function clearBasket() {
        var cartReqUrl = "https://rgci-data.where-to-buy.co/rgci/v1/cart";
        var data = {
            "AuthorizationToken": "Z58QH8nvuxDQlHRDCC7M4S7zBVLmfpS0gU3VpbBTPKMrIhG8OyNSnn6OZzq5QD1tbaOHHUOVXDTd2xJOFv826ryI3PUJSdFtP1kFeijU9Ug=",
            "Method": "Clear",
            "CartId": "e8d565f2-7281-4d71-a3ea-d70b6f6263a0",
            "RetailerName": "Boots.uk",
            "Items": JSON.parse(sessionStorage.getItem("basketItems"))
        };
        var getCart = $.post(cartReqUrl, data, "json");
        getCart.done(function(response) {
            //console.log(response);
            if (response.Success) {
                $(".itemCount").html("0");
                $(".basket").hide();
                $(".clearedBasket").show();
            }
        });
    }

    function updateQuantity(model, quantity, itemCount, itemPrice, itemTotalPrice) {
        //console.log(item);
        var cartReqUrl = "https://rgci-data.where-to-buy.co/rgci/v1/cart";
        var data = {
            "AuthorizationToken": "Z58QH8nvuxDQlHRDCC7M4S7zBVLmfpS0gU3VpbBTPKMrIhG8OyNSnn6OZzq5QD1tbaOHHUOVXDTd2xJOFv826ryI3PUJSdFtP1kFeijU9Ug=",
            "Method": "Modify",
            "CartId": "e8d565f2-7281-4d71-a3ea-d70b6f6263a0",
            "RetailerName": "Boots.uk",
            "ModelName": model,
            "Quantity": quantity
        };
        var getCart = $.post(cartReqUrl, data, "json");
        //console.log(data);
        getCart.done(function(response) {
            //console.log(response);
            //return response;
            $(".totalPrice").html(response.Cart.TotalPrice);
            $(itemCount).val(response.Cart.Items[0].Quantity);
            $(itemPrice).html(response.Cart.Items[0].Price);
            $(itemTotalPrice).html(response.Cart.Items[0].TotalPrice);
            $(".itemCount").html(response.Cart.Items[0].Quantity);
            postUpdateData(model, quantity);
        });
    }

    function checkNum(val) {
        if (!isNumber(val)) {
            alert("Please input only number");
            return false;
        } else if (val <= 0 || val === "") {
            alert("Minimum Quantity should be 1");
            return false;
        } else {
            return true;
        }
    }

    function postUpdateData(modal, quantity) {
        //console.log("11111111111111");
        var items = [{ "ModelName": String(modal), "Quantity": String(quantity) }];
        var getCart = "";
        var cartReqUrl = "https://rgci-data.where-to-buy.co/rgci/v1/cart";
        var data = {
            "AuthorizationToken": "Z58QH8nvuxDQlHRDCC7M4S7zBVLmfpS0gU3VpbBTPKMrIhG8OyNSnn6OZzq5QD1tbaOHHUOVXDTd2xJOFv826ryI3PUJSdFtP1kFeijU9Ug=",
            "Method": "AddMultiple",
            "CartId": "e8d565f2-7281-4d71-a3ea-d70b6f6263a0",
            "RetailerName": "Boots.uk",
            "Items": items
        };
        getCart = $.post(cartReqUrl, data, "json");
        getCart.done(function(response) {
            if (response.Success) {
                $(".addToBasketBut").disabled = false;
                $(".checkoutBut").disabled = false;
                //console.log("22222222222222");
            }
        });
    }

    function updateResponse(response) {
        var items = "";
        var qtn = 0;
        $.each(response.Cart.Items, function(i, item) {
            items += '<div class="row item">' +
                '<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">' + item.Description + '</div>' +
                '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">' +
                '<div class="qtnCtrls"><button class="minus" data-inarr="' + i + '">-</button>' +
                '<input type="text" placeholder="0" min="0" size="3" maxlength="2" value="' + item.Quantity + '" id="itemCount' + i + '" class="quantity" onkeypress="basketFn.valItemCount(this)">' +
                '<button class="plus" data-inarr="' + i + '">+</button></div>' +
                '<button class="addToBasketBut" data-inarr="' + i + '" data-item="' + item.ModelName + '">Update</button>' +
                '</div>' +
                '<div class="col-xs-12 col-sm-12 col-md-2 col-lg-2" id="itemPrice' + i + '">' + item.Price + '</div>' +
                '<div class="col-xs-12 col-sm-12 col-md-2 col-lg-2" id="itemTotalPrice' + i + '">' + item.TotalPrice + '</div>' +
                '</div>';
            qtn += parseInt(item.Quantity);
        });
        if (qtn > 99) {
            $(".itemCount").html("99+");
        } else {
            $(".itemCount").html(qtn);
        }
        return items;
    }
});