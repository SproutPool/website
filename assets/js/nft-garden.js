(function($) {

    // addr1q86ldstpjjnl3x9g4h9wndlx643xkrhlc4umyylfcg3jqvukwmwpd6uz42503ndhwc6gw3augvq9kw6axh8m46dshh7sjlcv6t
    var pastAddress;

    const urlParams = new URLSearchParams(window.location.search);
    const network = urlParams.get('network');
    const networks = ['mainnet','testnet'];

    if ( !networks.includes(network) ) {
        alert('unknown network'); return;
    }

    const BLOCKFROST_API_KEY = config['BLOCKFROST_API_KEY_'+network.toUpperCase()]

    $('#input-address').keypress(function (e) {
        if (e.which == 13) {
            var inputAddress = $("#input-address").val();
            if (typeof pastAddress !== 'undefined' && inputAddress == pastAddress) {
                return;
            }
            pastAddress = inputAddress;

            // get stake address from address
            let stakeAddress = getAssets(inputAddress);
            // get all assets that are linked to this stake address
        }
    });

    function getAssets(paymentAddress) {
        $.ajax({
            url: "https://cardano-"+network+".blockfrost.io/api/v0/addresses/"+paymentAddress,
            type: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
            },
            statusCode: {
                404: function (response) {
                    alert(response.responseJSON.message);
                }
            },
            success: function(addressData) {
                $.ajax({
                    url: "https://cardano-"+network+".blockfrost.io/api/v0/accounts/"+addressData.stake_address+"/addresses",
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
                    },
                    statusCode: {
                        404: function (response) {
                            alert(response.responseJSON.message);
                        }
                    },
                    success: function(StakeAddressData) {
                        var nftResults = '';
                        StakeAddressData.forEach((addressInfo, index) => {
                            $.ajax({
                                url: "https://cardano-"+network+".blockfrost.io/api/v0/addresses/"+addressInfo.address,
                                type: "GET",
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
                                },
                                statusCode: {
                                    404: function (response) {
                                        alert(response.responseJSON.message);
                                    }
                                },
                                success: function(searchedAddressesData) {
                                    console.log(searchedAddressesData);
                                    searchedAddressesData.amount.forEach((addressItem) => {
                                        if (addressItem.unit != 'lovelace') {
                                            $.ajax({
                                                url: "https://cardano-"+network+".blockfrost.io/api/v0/assets/"+addressItem.unit,
                                                type: "GET",
                                                beforeSend: function(xhr) {
                                                    xhr.setRequestHeader('project_id', BLOCKFROST_API_KEY);
                                                },
                                                statusCode: {
                                                    404: function (response) {
                                                        alert(response.responseJSON.message);
                                                    }
                                                },
                                                success: function(tokenData) {
                                                    console.log(tokenData);
                                                    nftResults += "<p><span>Name: <a href="+tokenData.onchain_metadata.website+">"+tokenData.onchain_metadata.name+"</a></span><br><span>Quantity: "+addressItem.quantity+"</span><br><img style='width:40%;' src=https://ipfs.blockfrost.dev/ipfs/"+tokenData.onchain_metadata.image.split('//')[1]+" /></p>";
                                                    $('#nft-results').html(nftResults);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    }

})(jQuery);