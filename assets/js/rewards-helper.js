(function($) {

    const epochOneStartUTC = 1506635091000; // 2017-10-28 21:44:51 UTC
    const msPerEpoch = 432000000; // 5 days

    // check for query string parameters
    if ( urlParamsExist() ) {
        let urlParams = new URLSearchParams(window.location.search);
        let urlDatetime = urlParams.get('datetime');
        let urlAmount = urlParams.get('amount');

        $("#delegation-date").val(urlDatetime);
        $("#delegation-amount").val(urlAmount);

        calculateResults(urlDatetime, urlAmount);
    } else {
        let setDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
        let setAmount = '0';

        // reload page and add URL parameters
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?datetime=" + setDatetime + "&amount=" + setAmount;
        window.location.replace(newurl);
    }

    // "Calculate" button trigger
    $('#rewards-helper-btn').click(function() {
        let inputDate = $("#delegation-date").val(); // 2021-04-24T18:06
        let inputAmount = $("#delegation-amount").val(); // 1000

        if (history.pushState) {
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?datetime=" + inputDate + "&amount=" + inputAmount;
            window.history.pushState({path:newurl},'',newurl);
        }

        calculateResults(inputDate, inputAmount);
    });

    // calculate results based on query string parameters
    function calculateResults(datetime, amount) {
        if (datetime == '') {
            // remove old results
            $('#delegation-rewards-timing').html("<i>results will be shown here</i>");

            alert('Please enter a date');
            return;
        }
        if (amount != '') {
            var rewardsEstimate = (amount*0.055/73).toFixed(6);

            $.get( "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=cardano", function( data ) {
                let adaPrice = data[0].current_price;

                $('#rewards-estimate').html(
                    rewardsEstimate + " ADA <span style='font-size:80%;'><i>($" + (rewardsEstimate*adaPrice).toFixed(2) + " USD)</i></span>"
                );
            });
        } else {
            // calculate rewards and USD value
            $('#rewards-estimate').html("N/A")
        }

        let inputTimestampUTC = Date.parse(datetime);

        // find which epoch this date is in => epoch x
        let inputsEpoch = getEpochFromTimestamp(inputTimestampUTC);

        let epochPaid = inputsEpoch + 4;
        let datePaid = timestampToDate(epochOneStartUTC + (inputsEpoch+3) * msPerEpoch);
        
        $('#delegation-rewards-timing').html(
            "<p>At the Beginning of Epoch<br><span style='font-size:150%;'>" + epochPaid + "</span></p><p>On<br><span style='font-size:150%;'>" + datePaid + "</span></p><p>In the Amount* of<br><span id='rewards-estimate' style='font-size:150%;'></span></p><p style='font-size: 85%;'>*estimated rewards amount based on network's average ROS of <b>5.5%</b></p>"
        );
    }

    // gets epoch number from timestamp
    function getEpochFromTimestamp(timestamp) {
        let timeAfterEpochOne = timestamp - epochOneStartUTC;

        // how many epochs have gone by
        let passedEpochs = timeAfterEpochOne / msPerEpoch;

        return Math.ceil(passedEpochs);
    }

    // converts timestamp to readable date format
    function timestampToDate(timestamp) {
        var inputDate = new Date(timestamp);
        let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        let day = days[inputDate.getDay()];
        let date = inputDate.getDate();
        let month = months[inputDate.getMonth()];
        let year = inputDate.getFullYear();
        let hours = inputDate.getHours();
        let minutes = inputDate.getMinutes();
        let seconds = inputDate.getSeconds();


        return day + ", " + month + " " + date + ", " + year + " @ " + hours + ":" + minutes + ":" + seconds;
    }

    // checks if paramters are present in URL
    function urlParamsExist() {
        let urlParams = new URLSearchParams(window.location.search);
        let datetime = urlParams.get('datetime');

        return datetime == '' || datetime == null ? false : true;
    }

})(jQuery);