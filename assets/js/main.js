/*
	Industrious by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
(function($) {
    
    // global vars
    var epochOneStartUTC = 1506635091000; // 2017-10-28 21:44:51 UTC
    var msPerEpoch = 432000000; // 5 days

	var	$window = $(window),
		$banner = $('#banner'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
            var timeoffset = -(new Date().getTimezoneOffset() / 60);
            $('#timeoffset').html(timeoffset);
		});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				target: $body,
				visibleClass: 'is-menu-visible',
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

    // Rewards Helper
        $('#rewards-helper-btn').click(function() {
            let inputDate = $("#delegation-date").val();
            let inputAmount = $("#delegation-amount").val();

            if (inputDate == '') {
                alert('Please enter a date');
                return;
            }
            if (inputAmount != '') {
                var rewardsEstimate = (inputAmount*0.055/73).toFixed(6);

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

            let inputTimestampUTC = Date.parse(inputDate);

            // find which epoch this date is in => epoch x
            let inputsEpoch = getEpochFromTimestamp(inputTimestampUTC);

            let epochPaid = inputsEpoch + 4;
            let datePaid = timestampToDate(epochOneStartUTC + (inputsEpoch+3) * msPerEpoch);
            
            $('#delegation-rewards-timing').html(
                "<p>At the Beginning of Epoch<br><span style='font-size:150%;'>" + epochPaid + "</span></p><p>On<br><span style='font-size:150%;'>" + datePaid + "</span></p><p>In the Amount* of<br><span id='rewards-estimate' style='font-size:150%;'></span></p><p style='font-size: 85%;'>*estimated rewards amount based on network's average ROS of <b>5.5%</b></p>"
            );
        });

        function getEpochFromTimestamp(timestamp) {
            let timeAfterEpochOne = timestamp - epochOneStartUTC;

            // how many epochs have gone by
            let passedEpochs = timeAfterEpochOne / msPerEpoch;

            return Math.ceil(passedEpochs);
        }

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

})(jQuery);