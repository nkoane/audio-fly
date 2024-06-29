import data from './data.json';

window.addEventListener('DOMContentLoaded', (ev) => {
    const audio = document.querySelector('main audio');
    const status = document.querySelector('main p');
    const story = document.querySelector('main div');
    const storyList = document.querySelector('main div ol');

    const offSetTime = data.words[0].start / 1000;

    let gap = {
        start: 0,
        end: null,
    };

    for (const [index, utterance] of data.utterances.entries()) {
        const li = document.createElement('li');
        const dl = document.createElement('dl');
        const dt = document.createElement('dt');
        dt.innerText = utterance.speaker;
        const dd = document.createElement('dd');
        for (const [index, word] of utterance.words.entries()) {
            const span = document.createElement('span');
            span.textContent = word.text;
            span.setAttribute('data-start', word.start);
            span.setAttribute('data-end', word.end);
            span.setAttribute('data-index', index);
            dd.appendChild(span);
        }
        dl.appendChild(dt).appendChild(dd);
        li.appendChild(dl);
        storyList.appendChild(li);
    }

    const spans = story.querySelectorAll('span');

    spans.forEach((span, index) => {
        span.addEventListener('click', () => {
            gap = {
                start: Number.parseInt(span.getAttribute('data-start')) / 1000,
                end: Number.parseInt(span.getAttribute('data-end')) / 1000,
            };
            audio.currentTime = gap.start;
            audio.play();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyK') {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        if (event.code === 'KeyJ') {
            audio.currentTime -= 5;
        }

        if (event.code === 'KeyL') {
            audio.currentTime += 5;
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (gap.end != null && audio.currentTime >= gap.end) {
            audio.pause();
            gap.end = null;
        }

        const word = findWordByTime(data.words, audio.currentTime * 1000);
        const index = data.words.findIndex((word) => {
            return word.start <= audio.currentTime * 1000 && word.end >= audio.currentTime * 1000;
        });

        if (word != null && word !== undefined) {
            status.textContent = `${word.text}`;
            const parent = spans[index].parentElement.parentElement.parentElement;
            spans.forEach((span, spanIndex) => {
                span.classList.remove('selected');
                span.parentElement.parentElement.parentElement.classList.add('hide');
            });

            spans[index].classList.add('selected');
            parent.classList.remove('hide');
            console.log(parent);
        }
    });

    function findWordByTime(words, time) {
        return words.find((word) => {
            return word.start <= time && word.end >= time;
        });
    }

    audio.addEventListener('loadedmetadata', () => {});
});
