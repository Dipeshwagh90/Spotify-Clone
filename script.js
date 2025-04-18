console.log("Hello script");

let currentSong = new Audio();
let songss;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songss = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songss.push(element.href.split(`/${folder}/`)[1])
        }
    }


    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songss) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Jaya</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })


    })
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00 / 00.00"
    
}

async function displayAlbums(params) {
    let a = await fetch(`http://127.0.0.1:5500/songss/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors= div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    Array.from(anchors).forEach (async e=>{
        if(e.href.includes("/songss"))
        {
            let folder=e.href.split("/").slice(-2)[0]
            //get metadata
            let a = await fetch(`http://127.0.0.1:5500/songss/${folder}/info.json`)

            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML + `<div data-folder="cs" class="card ">
                        <div data class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"
                                style="fill: white;">
                            
                             <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                            </svg>
                        </div>
                        
                        <img src="/songss/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    })

}

async function main() {


    //Get the list of all the songs
    await getSongs("songss/ncs")
    playMusic(songss[0], true)

    //Display all the albums on the page 
    displayAlbums()

    //Attach an event listener to play and pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
       
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0"
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%"
    })

    //Add  an event listener to previous and next
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous clicked")
        let index = songss.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0 ){
        playMusic(songss[index - 1])
        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")

        let index = songss.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songss.length ){
        playMusic(songss[index + 1])
        }
    })

    //Add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        
    }) 

    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click", async item =>{
            songss = await getSongs(`songss/${item.currentTarget.dataset.folder}`)
            playMusic(songss[0])
            
        })
    })

     // Handle login submission
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '12345') {
      alert('Login successful!');
      loginModal.style.display = 'none';
    } else {
      alert('Incorrect username or password.');
    }
  }


}

main()