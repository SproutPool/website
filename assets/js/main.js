/*
	Industrious by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/
(function($) {

    // pool155x3l57d4xu52t93f9r55cqaysej4pc2dl3jkc9d6w5ckyu6u7n
    const poolId = "pool155x3l57d4xu52t93f9r55cqaysej4pc2dl3jkc9d6w5ckyu6u7n";
    const BLOCKFROST_API_KEY = config.BLOCKFROST_API_KEY_MAINNET;

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

    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

    // pool info
    $.ajax({
        url: "https://cardano-mainnet.blockfrost.io/api/v0/pools/"+poolId,
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
            console.log(data);
            $('#pledge').html(numberWithCommas(data.declared_pledge/1000000));
            $('#live-stake').html(numberWithCommas(Math.floor(data.live_stake/1000000)));
            $('#active-stake').html(numberWithCommas(Math.floor(data.active_stake/1000000)));
            $('#fixed-fee').html(numberWithCommas(data.fixed_cost/1000000));
            $('#margin-fee').html(data.margin_cost*100);
            $('#delegators').html(data.live_delegators);
        }
    });
    
    $.ajax({
        url: "https://cardano-mainnet.blockfrost.io/api/v0/pools/"+poolId+"/history",
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
            console.log(data);
        }
    });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

})(jQuery);