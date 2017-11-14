$(document).ready(function () {
    var images = [];
    var slider;
    var map = $('#map');
    var animation;
    $.ajax({
        url: 'http://cors-proxy.htmldriven.com/?url=http://meteo.gov.ua/ua/33345/radar/',
        type: 'GET',

        contentType: 'text/plain',

        success: function(res) {
            var list = $(res.body).find('#time_radar option');
            var imgURL = 'http://meteo.gov.ua/radars/Ukr_J%20';

            for (var i = 0; i < 6; i++) {
                var src = imgURL + list[i].value.replace(' ', '%20') + '.jpg';
                var image = new Image();
                image.src = src;
                images[i] = {time : list[i].innerHTML, src : src, image: image}
            }
            images = images.reverse();

            var date = list[0].value.replace(' ', '%20');
            map.attr('src', imgURL + date + '.jpg');
            $('#spinnerContainer').remove();

            slider = $("#slider").slider({
                min: 0,
                max: 5,
                value: 5,
                ticks: [0, 1, 2, 3, 4, 5],
                ticks_labels:
                    [images[0].time, images[1].time, images[2].time, images[3].time, images[4].time, images[5].time],
                ticks_snap_bounds: 30
            });

            slider.on('change', function(event) {
                map.attr('src', images[event.value.newValue].src);
            });
        }
    });
    
    $('#button_play').click(function(){
        animation = setInterval(function(){animate()}, 500);
    });

    $('#button_stop').click(function(){
        clearInterval(animation);
    });

    $('#button_fw').click(function(){
        if (slider.slider('getValue') < slider.slider('getAttribute', 'max')) {
            slider.slider('setValue', slider.slider('getValue') + 1);
            map.attr('src', images[slider.slider('getValue')].src);
        }
    });

    $('#button_bw').click(function(){
        if (slider.slider('getValue') > slider.slider('getAttribute', 'min')) {
            slider.slider('setValue', slider.slider('getValue') - 1);
            map.attr('src', images[slider.slider('getValue')].src);
        }
    });

    function animate() {

        if (slider.slider('getValue') === slider.slider('getAttribute', 'max')) {
            slider.slider('setValue', 0);
            map.attr('src', images[0].src);
        } else {
            slider.slider('setValue', slider.slider('getValue') + 1);
            map.attr('src', images[slider.slider('getValue')].src);
        }
    }

    if($(window).width() < 922) {
        $('#legend').insertAfter($('.bottom'));
    };
});


