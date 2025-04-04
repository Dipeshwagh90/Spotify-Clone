console.log("lets write Javascript");

async function getSongs() 
{
    let a= await fetch("http://127.0.0.1:5500/song/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("td")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href)
        } 
    }
    return songs
        
}
async function main()
{

    //Get the list of all songs
    let songs = await getSongs()
    console.log(songs)

    //play the first song
    var audio = new Audio(songs[0]);
    audio.play(); 

}

main()