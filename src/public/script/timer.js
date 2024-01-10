function convert(minutos) //Convert minutes in array of all values, example 5 = [5:00, 4:59, 4:58, ...]
{ 
    minutos *= 60;
    let arr = [];
    for (let i = minutos; i >= 0; i--) 
    {
      let horas = Math.floor(i / 60);
      let mins = i % 60;
      arr.push(`${horas}:${mins.toString().padStart(2, '0')}`);
    }
    return arr;
}

Array.prototype.random = function () 
{
    return this[Math.floor((Math.random()*this.length))];
}

const TIMER_SQUELETON = 
    {
        source: document.querySelector('#cronometer_source'),
        base: document.querySelector('#cronometer_source .cronometer_base'),
        text: document.querySelector('#cronometer_source .cronometer_base h1'),
        fill: document.querySelector('#cronometer_source .cronometer_base .fill'),
    }

let timerInterval;

function stopTimer()
{
    clearInterval(timerInterval);
    timerInterval = null;
    TIMER_SQUELETON.source.classList.add('hidden');
}

function startTimer(time) 
{
    TIMER_SQUELETON.source.classList.remove('hidden');
    TIMER_SQUELETON.base.classList.remove('timer_end');

    const colors_array = 
    [
        '2a9d8f',
        '264653',
        'f4a261',
        'e76f51'
    ]

    let array = convert(time / 60);
    TIMER_SQUELETON.text.innerHTML = array[0];
    TIMER_SQUELETON.fill.style.height = '100%';
    let second = 0;
    let prevColor;

    timerInterval = setInterval(() => 
    {
        second++;
        let color = colors_array.random();

        i = 0;

        while (i < 5 && prevColor == color) 
        {
            color = colors_array.random();
            i++;    
        }

        prevColor = color;
        TIMER_SQUELETON.text.innerHTML = array[second];
        TIMER_SQUELETON.text.classList.remove('jumpText');
        TIMER_SQUELETON.text.offsetWidth;
        TIMER_SQUELETON.text.classList.add('jumpText');

        TIMER_SQUELETON.fill.style.height = (100 - (second / time) * 100)+'%';
        
        if(second >= time)
        {
            clearInterval(timerInterval);
            TIMER_SQUELETON.source.style.background = '#000000';
            TIMER_SQUELETON.base.classList.add('timer_end');
            return;
        }

        TIMER_SQUELETON.source.style.background = `#${color}`;

    }, 1000);

    
}