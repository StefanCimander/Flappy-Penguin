function loadAndPlayBGAudio() {
    var queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.loadManifest([
        {id:"bg", src: MUSIC_FILE}
    ]);
    queue.addEventListener("fileload", function (e) {
        createjs.Sound.play("bg");
    });
}
