var totalSeconds = null;
var currentSeconds = 0;

function configure(seconds) {
    totalSeconds = seconds;
    $('#Video_Timeline_Draggeable_Point').css('left', '0%');
    $('#Video_Timeline_Bar').css('width', '0%');
    startProgress();
}

function forceTo(seconds) {
    if (totalSeconds) {
        var xPos = (seconds / totalSeconds) * parseFloat($('#Video_Timeline_Progress').css("width"));
        $('#Video_Timeline_Draggeable_Point').css('left', xPos + 'px');
        $('#Video_Timeline_Bar').css('width', xPos + 'px');
        currentSeconds = seconds;
    }
}

var interval = null;

function startProgress() {
    if (interval) clearInterval(interval);
    interval = setInterval(function() {
        if (totalSeconds && currentSeconds < totalSeconds && !Video_TimeLine.paused) {
            var xPos = parseFloat($('#Video_Timeline_Draggeable_Point').css("left")) + (parseFloat($('#Video_Timeline_Progress').css("width")) / totalSeconds);
            $('#Video_Timeline_Draggeable_Point').css('left', xPos + 'px');
            $('#Video_Timeline_Bar').css('width', xPos + 'px');
            currentSeconds += 1;
        }
        else if(currentSeconds >= totalSeconds)
        {
            clearInterval(interval);
            Video_TimeLine.item.classList.add('hidden');
        }
    },1000);
}

function stopProgress() {
    if (interval) clearInterval(interval);
}


$('#Video_Timeline_Draggeable_Point').draggable({
        axis: 'x',
        containment: "#Video_Timeline_Progress",
        start: function() {
            stopProgress();
        },
        stop: function() {
            if (totalSeconds) {
                var offset = $(this).offset();
                var xPos = (100 * parseFloat($(this).css("left"))) / (parseFloat($(this).parent().css("width")));
                var seconds = Math.round((xPos /100) * totalSeconds);
                console.log(seconds + " seconds");
                Video_TimeLine.timeChangeCallback !== undefined ? Video_TimeLine.timeChangeCallback(seconds) : null;
                currentSeconds = seconds;
                startProgress();
                Video_TimeLine.scrollTime.classList.add('hidden');
            }
        }
    });

$('#Video_Timeline_Draggeable_Point').draggable({
    drag: function() {
        var offset = $(this).offset();
        var xPos = (100 * parseFloat($(this).css("left"))) / (parseFloat($(this).parent().css("width"))) + "%";
        var xPos2 = (100 * parseFloat($(this).css("left"))) / (parseFloat($(this).parent().css("width")));
        var seconds = Math.round((xPos2 /100) * totalSeconds);
        var minutes = Math.trunc(seconds / 60);
        var remainingSeconds = seconds % 60;
        var value = minutes.toString() + ':' + remainingSeconds.toString().padStart(2, '0');

        Video_TimeLine.scrollTime.classList.remove('hidden');
        Video_TimeLine.scrollTime.innerHTML = value

        $('#Video_Timeline_Bar').css({
            'width': xPos
        });
    }
});


const Video_TimeLine = 
{
    configure,
    forceTo,
    startProgress,
    stopProgress,
    paused: false,
    timeChangeCallback: undefined,
    item: document.getElementById('player__Video_Timeline'),
    scrollTime: document.getElementById('scroll__time'),
}