const $app = document.getElementById('app');

function displayHead(name) {
  $app.innerHTML = '';

  const $div = document.createElement('div');
  //$div.id = 'head';

  let str = 'All-Fourths Tuning'
  if (name) {
    str += ` / ${name}`;
  }
  //$div.textContent = str;

  const $a = document.createElement('a');
  $a.id = 'head';
  $a.href = 'javascript:showTitle()';
  $a.textContent = str;
  $div.appendChild($a);

  $app.appendChild($div);
}

function showTitle() {
  displayHead();

  DATA.forEach((group) => {
    const $div = document.createElement('div');
    $div.className = 'item';
    $div.textContent = group.title;

    $div.onclick = () => showNames(group);

    $app.appendChild($div);
  });
}

function showNames(group) {
  displayHead(group.title);

  group.list.forEach((item) => {
    const $div = document.createElement('div');
    $div.className = 'item';
    $div.textContent = item.name;

    switch (item.level) {
      case 1:
        //TODO
        $div.style.color = '#999';
        break;
      case 2:
        //TODO
        $div.style.color = '#999';
        break;
      case 3:
        //TODO
        $div.style.color = '#aaa';
        $div.style.fontWeight = 'bold';
        break;
      case 4:
        $div.style.color = '#ccc';
        $div.style.fontWeight = 'bold';
        break;
      case 5:
        $div.style.color = '#fff';
        $div.style.fontWeight = 'bold';
        break;
      default:
        break;
    }

    $div.onclick = () => showId($div, item, group);

    $app.appendChild($div);
  });

  //$app.appendChild(document.createElement('hr'));

  //const $back = document.createElement('div');
  //$back.className = 'back';
  //$back.textContent = 'back!';
  //$back.onclick = () => showTitle();
  //$app.appendChild($back);
}

function showId($own, item, group) {
  const id = item.id;
  const txtPath = `./data/${group.dir}/${id}/${id}.txt`;
  const mp3Path = `./data/${group.dir}/${id}/${id}.mp3`;

  // Remove it detail
  const $next = $own.nextElementSibling;
  if ($next && $next.classList.contains("detail")) {
    $next.remove();
    $own.style.fontSize = '1.0em';
    $own.style.backgroundColor = '#000';
    return;
  }

  //// Remove other detail
  //document.querySelectorAll(".detail").forEach(el => el.remove());

  $own.style.fontSize = '1.3em';
  //$own.style.backgroundColor = '#7c7cc9';

  // Create detail
  const $detail = document.createElement("div");
  $detail.className = "detail";

  // Midi
  let audio = null;
  fetch(mp3Path, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        audio = new Audio();
        audio.className = "midi";
        audio.controls = true;
        audio.preload = "none";
        audio.src = mp3Path;

        $detail.append(audio);
      }
    })
    .catch(error => {
      console.error('ERROR:', error);
    });

  // Text
  $text = document.createElement("pre");
  $text.className = "p4chords";
  fetch(txtPath)
    .then(response => response.text())
    .then(text => {
      $text.textContent = text;

      $detail.append($text);
    })
    .catch(error => {
      console.error('ERROR:', error);
    });

  $own.insertAdjacentElement("afterend", $detail);

  // Pause other audio 'play'
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => {
    audio.addEventListener('play', () => {
      audios.forEach(otherAudio => {
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
        }
      });
    });
  });
}

showTitle();
