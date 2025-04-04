console.log("Hello script");

async function getSongs()
{
let a = await fetch("http://127.0.0.1:5500/songss/")
let response = await a.text();
let div =document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
let songss = []
for (let index = 0; index < as.length;index++)
{
    const element =as[index];
    if(element.href.endsWith(".mp3"))
    {
        songss.push(element.href.split("/songss/")[1])
    }
}
  return songss
}

 async function main()
{
let songss = await getSongs()
console.log(songss)

let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
for(const song of songss){
  songUL.innerHTML = songUL.innerHTML + `<li>
  <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20"," ")}</div>
                    <div>Jaya</div>
                </div>
                <div class="playnow">
                    <span>Play now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
                </li>`;
}
var audio = new Audio(songss[0]);
audio.play();

audio.addEventListener("loadeddata", () =>{ console.log(audio.duration, audio.currentSrc, audio.currentTime)});
}

main()