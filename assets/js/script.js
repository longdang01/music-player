const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".player__list");

const player = $(".player")
const title = $(".player__title")
const singer = $(".player__singer")
const thumb = $(".player__cd")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
    {
        name: "Tinh ban dieu ky",
        singer: "Amee x Ricky Star x Lang LD",
        path: "./assets/music/tinhbandieuky.mp3",
        image: "./assets/img/tinhbandieuky.png"
    },
    {
        name: "Tet dong day",
        singer: "Kay Tran x Nguyen Khoa x Duck V",
        path: "./assets/music/tetdongday.mp3",
        image: "./assets/img/tetdongday.png"
    },
    {
        name: "Mot minh co buon khong",
        singer: "Thieu Bao Tram",
        path: "./assets/music/motminhcobuonkhong.mp3",
        image: "./assets/img/thieubaotram.png"
    },
    {
        name: "Phai chang em da yeu",
        singer: "Juky San ft. Redt",
        path: "./assets/music/phaichangemdayeu.mp3",
        image: "./assets/img/phaichangemdayeu.png"
    },
    {
        name: "Nang tho",
        singer: "Hoang dung",
        path: "./assets/music/nangtho.mp3",
        image: "./assets/img/nangtho.png"
    }],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song__thumb" 
                style="background-image: url('${song.image}');"></div>
                <div class="song__body">
                    <div class="song__title">${song.name}</div>
                    <div class="song__singer">${song.singer}</div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })

        playlist.innerHTML = htmls.join("");
    },
    definedProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this;

        const cdThumbAnimate = thumb.animate([
            {
                transform: 'rotate(1turn)'
            }
        ],{
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        playBtn.onclick = () => {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom);
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");
            if(songNode || e.target.closest(".option"))
            {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Chua lam
                // if(e.target.closest(".option")) {
                    
                // }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'nearest'
                }
            );
        }, 300)
    },
    loadCurrentSong: function() {
        title.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        thumb.style.backgroundImage = `url('${this.currentSong.image}')` 
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++; 
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--; 
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        console.log(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //Defined
        this.definedProperties();
        this.handleEvents();

        //Load currentSong
        this.loadCurrentSong();

        //Render Playlist
        this.render();
    }
}
app.start()