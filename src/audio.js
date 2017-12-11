export const addSong = (source, loop) => {
  let song = new Audio(source);
  if (loop) {
    if (typeof song.loop == 'boolean') {
        song.loop = true;
    } else {
        song.addEventListener('ended', () => {
            song.currentTime = 0;
            song.play();
        }, false);
    }
  }

  return song;
};
