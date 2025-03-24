// Api endpoint fra NASA's hjemmeside
const ApodEndpoint = "https://api.nasa.gov/planetary/apod";

// Min nøgle, som blev sendt på mail
const ApiKey = "6k1nDay1BsbUKy3EN3IjuNoURKxBudrMaWsgbHzi";

// Funktion som henter dagens billede fra NASA
async function fetchAPOD() {
  try {
    // Henter data fra NASA's API for Astronomy Picture of the Day (APOD) for d. 23. marts 2024. Jeg valgte at gå med en fast dato (metoden fundet på NASA's egen hjemmeside), da jeg ellers fik en media type der hed "other" i konsollen. På linje XXXXX har jeg prøvet at skrive noget kode, som gerne skulle kunne håndtere forskellige media typer (image og video), men jeg ved ikke hvordan jeg skal griber "other" an.

    //Jeg forstår det således: Jeg sender min Api nøgle med, for at få adgang til data. Fetch sender en anmodning, await venter på et svar fra server og response indeholder så svaret der kommer tilbage til mig. Dog skal dataen konverteres
    const response = await fetch(
      `${ApodEndpoint}?api_key=${ApiKey}&date=2024-03-23`
    );

    // Tjekker om der er fejl i svaret der bliver sendt retur. Udråbstegnet "vender" værdien om. Så hvis svaret IKKE er ok, gør så følgende.
    if (!response.ok) {
      throw new Error("Kunne ikke hente data fra NASA API");
    }

    // Konverter svaret til JSON-format
    const data = await response.json();

    // Log dataen i konsollen for fejlfinding
    console.log("Data modtaget fra API:", data);

    // Vis dataen på websiden
    displayAPOD(data);
  } catch (error) {
    // Hvis der opstår en fejl, log den i konsollen
    console.error("Fejl ved hentning af APOD:", error);
  }
}

// Funktion til at vise billedet eller videoen på websiden
function displayAPOD(data) {
  // Hvis data ikke er defineret, log en fejl og stop
  if (!data) {
    console.error("FEJL: Ingen data modtaget i displayAPOD()");
    return;
  }

  // Hent HTML-elementerne, hvor vi vil vise data
  const titleElement = document.getElementById("apod-title");
  const mediaContainer = document.getElementById("apod-media");
  const descriptionElement = document.getElementById("apod-description");

  // Opdater titel og beskrivelse
  titleElement.textContent = data.title;
  descriptionElement.textContent = data.explanation;

  // Ryd tidligere indhold, så vi ikke får dobbeltvisning
  mediaContainer.innerHTML = "";

  // Tjek om medietypen er et billede
  if (data.media_type === "image") {
    // Opret et billedelement for at vise billedet
    const imageEl = document.createElement("img");
    // Sætter billedelementets source til URL'en
    imageEl.src = data.url;
    //henviser til billedets title
    imageEl.alt = data.title;
    //Tilføjer billedet så det vises på siden
    mediaContainer.append(imageEl);

    // Hvis dagens mediatype er video, fandt jeg frem til : https://stackoverflow.com/questions/5157377/show-youtube-video-source-into-html5-video-tag og udarbejdede den her løsning. Jeg ved ikke om det virker eller om det er den rigtige måde at gribe det an på.
  } else if (data.media_type === "video") {
    const videoElement = document.createElement("iframe");

    videoElement.src = data.url.includes("youtube.com")
      ? data.url.replace("watch?v=", "embed/")
      : data.url;

    videoElement.width = "500";
    videoElement.height = "300";
    videoElement.allowFullscreen = true;
    mediaContainer.appendChild(videoElement);

    // Hvis medietypen ikke er er et billede eller en video, så vis en fejlmeddelelse i stedet
  } else {
    mediaContainer.textContent = "Dagens medietype understøttes ikke.";
  }
}

// Kald funktionen for at hente og vise dagens APOD, når siden loader
fetchAPOD();
