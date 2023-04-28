//Elementlere ulaşıp obje olarak kullanma,yakalama

const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')
const currentProgress = document.getElementById('current-progress')

//indis şarkı için
let index

//döngü durumu
let loop = true

const songsList = [
    {
        name:'Barbar',
        link:'music/Kaan Boşnak - Barbar Lyric Video.mp3',
        artist:'Kaan Boşnak',
        image:'images/kaanboşnak.jpg'
    },
    {
        name:'Ağla Gözüm',
        link:'music/Metin Işık - Ağla Gözüm Official Video Klip.mp3',
        artist:'Metin Işık',
        image:'images/metinışık.jpg'
    },
    {
        name:'Gökyüzünü Tutamam',
        link:'music/Can Koç - Gökyüzünü Tutamam Official Lyric Video.mp3',
        artist:'Can Koç',
        image:'images/cankoç.jpg'
    },
    {
        name:'İmparator',
        link:'music/Heijan, Muti İmparator.mp3',
        artist:'Heijan ve Muti',
        image:'images/heijanvemuti.jpg'
    },
    {
        name:'Ay Tenli Kadın',
        link:'music/ay tenli kadın ufuk beydemir.mp3',
        artist:'Ufuk Beydemir',
        image:'images/ufukbeydemir.jpg'
    },
    {
        name:'Sen Leyla Ben Mecnun',
        link:'music/Kul mustafa.mp3',
        artist:'Kul Mustafa',
        image:'images/kulmustafa.jpg'
    }
]

//Event (olaylar) objesi
let events = {
    mouse:{
        click:'click'
    },
    touch:{
        click:'touchstart'
    }
}

let deviceType = ''


const isTouchDevice = () => {
    try{
        document.createEvent('TouchEvent')
        deviceType = 'touch'
        return true
    }catch(e){
        deviceType = 'mouse'
        return false
    }
}

// Zaman formatlama

const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? '0' + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? '0' + second : second
    return `${minute}:${second}`
}

// Şarkı atama
const setSong = (arrayIndex) => {
    //tüm özellikleri çıkar
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    //Süreyi göster metadata yüklendiğinde
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add('hide')
    playAudio()
}

//Şarkıyı oynat
const playAudio = () => {
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}


//Repeat (Tekrar) et
repeatButton.addEventListener('click', ()=> {
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('Tekrar kapatıldı')
    }else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('Tekrar açık')
    }
})


// Sıradaki şarkıya geç
const nextSong = () => {
    //Eğer normal çalıyorsa sonrtakine geç
    if(loop){
        if(index == (songsList.lenght -1)){
            //Sondaysa başa git
            index = 0
        }else {
            index += 1
        }

        setSong(index)
        playAudio()
    }else {
        //Rastgele bir sıra bul ve oynat
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
        playAudio()
    }
}

// Şarkıyı durdur
const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

// Önceki şarkıya geç
const previousSong = () => {
    if(index > 0){
        pauseAudio()
        index -= 1
    }else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}


// Şarkı kendisi biterse sonraki şarkıya geç
audio.onended = () =>{
    nextSong()
}


// Shuffle (karıştır) songs
shuffleButton.addEventListener('click', () => {
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop = true
        console.log('Karıştırma kapalı')
    }else {
        shuffleButton.classList.add('active')
        loop = false
        console.log('Karıştırma açık')
    }
})

// Play Button
playButton.addEventListener('click',playAudio)

//Next Button
nextButton.addEventListener('click',nextSong)

//Pause Button
pauseButton.addEventListener('click',pauseAudio)

//Prev Button
prevButton.addEventListener('click',previousSong)

//Cihaz tipini seç
isTouchDevice()
progressBar.addEventListener(events[deviceType].click,(event) =>{
    // Progress barı başlat
    let coordStart = progressBar.getBoundingClientRect().left

    //mouse click yapma noktası
    //False
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    //Genişliği progress e ata
    currentProgress.style.width = progress * 100 + '%'

    //Zamanı ata
    audio.currentTime = progress * audio.duration

    //Oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})


// Progresi güncelle zamana göre
setInterval(() => {
    console.log('set intervall run')
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime/audio.duration.toFixed(3)) * 100 + '%'
},1000)

// Zamanı güncelle
audio.addEventListener('timeupdate',() => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//Playlist oluştur
const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
         <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
         <span id="playlist-song-name">
         ${songsList[i].name}
         </span>
         <span id="playlist-song-artist-album">
         ${songsList[i].artist}
         </span>
        </div>
        </li>`
    }
}

// Şarkı listesini göster
playListButton.addEventListener('click', () =>{
    playListContainer.classList.remove('hide')
    pauseAudio()
})

// Şarkı listesini kapat
closeButton.addEventListener('click', () =>{
    playListContainer.classList.add('hide')
})

// Ekran yüklenirken
window.onload = () =>{
    //başlangıç şarkı sırası
    index = 0
    setSong(index)
    pauseAudio()
    //playlist oluştur
    initializePlaylist()
}