(function($) {

    // pool155x3l57d4xu52t93f9r55cqaysej4pc2dl3jkc9d6w5ckyu6u7n
    var pastPoolId;
    const BLOCKFROST_API_KEY = config.BLOCKFROST_API_KEY_MAINNET;

    $('#input-poolid').keypress(function (e) {
        if (e.which == 13) {
            var poolId = $("#input-poolid").val();
            if (typeof pastPoolId !== 'undefined' && poolId == pastPoolId) {
                return;
            }
            pastPoolId = poolId;
            $.ajax({
                url: "https://cardano-mainnet.blockfrost.io/api/v0/pools/"+poolId+"/metadata",
                type: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
                },
                statusCode: {
                    404: function (response) {
                        alert(response.responseJSON.message);
                    }
                },
                success: function(data) {
                    $('#pool-name').html(data.name);
                    $('#pool-ticker').html("[" + data.ticker + "]");
                    $('#pool-description').html(data.description);
                    $('#pool-homepage').attr("href", data.homepage);
                }
            });

            $.ajax({
                url: "https://cardano-mainnet.blockfrost.io/api/v0/pools/"+poolId+"/delegators",
                type: "GET",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
                },
                statusCode: {
                    404: function (response) {
                        alert(response.responseJSON.message);
                    }
                },
                success: function(data) {
                    let delegatorsHtml = "";
                    data.forEach((element, index) => {
                        delegatorsHtml += "<p><span><b>Stake Address:</b> "+element.address+"<br><span><b>Payment Address:</b> <span id=payment-address-"+index+"></span></span><br><span><b>Amount:</b> </span>"+Math.round(element.live_stake/1000000*100)/100+"<br><span><b>Active Epoch:</b> <span id=active-epoch-"+index+"></span></span></p>"

                        getPaymentAddress(element.address, index);
                        getActiveEpoch(element.address, index);
                    });
                    $('#pool-delegators').html(delegatorsHtml);
                }
            });
        }
    });

    function getPaymentAddress(stakeAddress, index) {
        $.ajax({
            url: "https://cardano-mainnet.blockfrost.io/api/v0/accounts/"+stakeAddress+"/addresses",
            type: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
            },
            statusCode: {
                404: function (response) {
                    alert(response.responseJSON.message);
                }
            },
            success: function(data) {
                $('#payment-address-'+index).html(data[0].address);
            }
        });
    }

    function getActiveEpoch(stakeAddress, index) {
        $.ajax({
            url: "https://cardano-mainnet.blockfrost.io/api/v0/accounts/"+stakeAddress,
            type: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
            },
            statusCode: {
                404: function (response) {
                    alert(response.responseJSON.message);
                }
            },
            success: function(data) {
                $('#active-epoch-'+index).html(data.active_epoch);
            }
        });
    }

})(jQuery);