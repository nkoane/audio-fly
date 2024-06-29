import data from './data.json';

window.addEventListener('DOMContentLoaded', (ev) => {
    const audio = document.querySelector('main audio');
    const status = document.querySelector('main p');
    const story = document.querySelector('main div');
    const storyList = document.querySelector('main div ol');

    let parent;

    let gap = {
        start: 0,
        end: null,
    };

    for (const [utteranceIndex, utterance] of data.utterances.entries()) {
        const li = document.createElement('li');
        const dl = document.createElement('dl');
        const dt = document.createElement('dt');
        dt.innerText = utterance.speaker;
        const dd = document.createElement('dd');
        for (const [wordIndex, word] of utterance.words.entries()) {
            const span = document.createElement('span');
            span.textContent = word.text;
            span.setAttribute('data-start', word.start);
            span.setAttribute('data-end', word.end);
            span.setAttribute('data-index', wordIndex);
            dd.appendChild(span);
        }
        storyList.appendChild(li).appendChild(dl).append(dt, dd);
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
        if (event.code === 'Space') {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        if (event.code === 'KeyH') {
            audio.currentTime -= 0.5;
        }

        if (event.code === 'KeyL') {
            audio.currentTime += 0.5;
        }

        if (event.code === 'KeyK' || event.code === 'KeyJ') {
            const speakerBlocks = storyList.querySelectorAll('dl');
            const parentIndex = Array.from(speakerBlocks).findIndex((speakerBlock) => {
                return speakerBlock.contains(parent);
            });
            if (parentIndex !== -1) {
                let speakerBlockIndex = null;

                if (event.code === 'KeyK') {
                    speakerBlockIndex = parentIndex - 1;
                } else {
                    speakerBlockIndex = parentIndex + 1;
                }

                if (speakerBlockIndex < speakerBlocks.length && speakerBlockIndex >= 0) {
                    audio.currentTime = Number.parseInt(speakerBlocks[speakerBlockIndex].querySelector('span').getAttribute('data-start')) / 1000;
                }
            }
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (gap.end != null && audio.currentTime >= gap.end) {
            audio.pause();
            gap.end = null;
        }

        const word = data.words.find((word) => {
            return word.start <= audio.currentTime * 1000 && word.end >= audio.currentTime * 1000;
        });

        const index = data.words.findIndex((word) => {
            return word.start <= audio.currentTime * 1000 && word.end >= audio.currentTime * 1000;
        });

        if (word != null && word !== undefined) {
            status.textContent = `${word.text}`;
            parent = spans[index].parentElement.parentElement.parentElement;
            for (const span of spans) {
                span.classList.remove('selected');
                span.parentElement.parentElement.parentElement.classList.add('hide');
            }

            spans[index].classList.add('selected');
            parent.classList.remove('hide');
        }
    });

    audio.addEventListener('loadedmetadata', () => {});
});
