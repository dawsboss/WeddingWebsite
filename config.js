/* =====================================================================
   WEDDING SITE CONFIG
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to change the website.
   Open it on GitHub, click the pencil icon, change the text between the
   quotes, then click "Commit changes". The site updates in ~1 minute.

   RULES OF THUMB
   - Keep the quotes. Text goes between them:  name: "Grant",
   - Leave something blank with empty quotes:  phone: "",
     Blank fields are hidden automatically, or show "Coming soon".
   - Lists are inside [ ] with { } items separated by commas.
     Copy an existing { ... } block to add another hotel, photo, etc.
   - Set any section's  show: false  to hide the whole section.
   - Don't delete the commas at the ends of lines.
   ===================================================================== */

window.WEDDING = {

  /* ---------------- THE BASICS ---------------- */
  couple: {
    first1: "Grant",        // first names drive the monogram (G & J)
    last1: "",
    first2: "Jazmin",
    last2: "",
    hashtag: "",            // e.g. "#TheDawsonsDoIt" (optional)
  },

  // Wedding date & time. Date is YYYY-MM-DD. Time is 24h "HH:MM".
  // Leave date blank ("") and the site will say "Date coming soon".
  date: "2027-04-17",
  time: "",
  timezone: "America/New_York",

  // City shown under your names in the hero, e.g. "Charleston, South Carolina"
  location: "",

  // Site tab title & short description (for link previews)
  siteTitle: "",            // blank = "Grant & [Name]"
  siteDescription: "Join us as we celebrate our wedding.",

  /* ---------------- HERO ---------------- */
  hero: {
    image: "images/hero.jpg",   // put a photo at images/hero.jpg, or set "" for a plain black hero
    welcome: "With grateful hearts, we invite you to join us as we begin our forever together. Your love and support mean the world to us, and we can't wait to celebrate with you.",
  },

  /* ---------------- OUR STORY ---------------- */
  story: {
    show: true,
    intro: "",   // one short line under the heading (optional)
    // Each milestone = one chapter. Add as many as you like.
    milestones: [
      { date: "", title: "How we met", text: "" },
      { date: "", title: "First date", text: "" },
      { date: "", title: "The proposal", text: "" },
    ],
  },

  /* ---------------- PHOTOS ---------------- */
  // Put images in the  images/  folder and list them here.
  // Leave the list empty [] and the gallery shows elegant placeholders.
  photos: {
    show: true,
    items: [
      // { src: "images/01.jpg", caption: "Engagement, Fall 2026" },
      // { src: "images/02.jpg", caption: "" },
    ],
  },

  /* ---------------- THE BIG DAY (timeline) ---------------- */
  schedule: {
    show: true,
    items: [
      {
        time: "",                    // e.g. "4:30 PM"
        title: "Ceremony",
        venue: "",                   // e.g. "The Bond"
        address: "",                 // e.g. "134 East King St, York, PA 17401"
        attire: "",                  // e.g. "Black Tie Optional"
        note: "",                    // e.g. "Please arrive 30 minutes early to be seated."
      },
      { time: "", title: "Cocktail Hour", venue: "", address: "", attire: "", note: "" },
      { time: "", title: "Reception",     venue: "", address: "", attire: "", note: "" },
    ],
    // Set to true to show an embedded Google Map under the first venue with an address
    showMap: true,
  },

  /* ---------------- ATTIRE / DRESS CODE ---------------- */
  attire: {
    show: true,
    code: "",            // e.g. "Black Tie Optional"
    description: "",     // a paragraph describing what to wear
    // Short bullet points (optional). Leave [] for none.
    tips: [
      // "The ceremony is outdoors on grass. Consider block heels.",
      // "Evenings get cool. Bring a wrap or jacket.",
    ],
    // Optional: a short color-palette note, e.g. "Please avoid white, ivory, and champagne."
    colors: "",
  },

  /* ---------------- TRAVEL & HOTELS ---------------- */
  travel: {
    show: true,
    intro: "",                 // e.g. "We've reserved room blocks at the hotels below."
    airport: "",               // e.g. "Charleston International (CHS), 25 minutes from the venue"
    parking: "",               // e.g. "Free parking on site."
    transportation: "",        // e.g. "Shuttles run from the Marriott at 3:45 PM."
    hotels: [
      {
        name: "",              // e.g. "The Yorktowne Hotel"
        address: "",
        distance: "",          // e.g. "5 min to venue"
        phone: "",
        url: "",               // booking link
        blockCode: "",         // e.g. "DAWSON WEDDING" or "" if no block
        rate: "",              // e.g. "$189/night"
        deadline: "",          // e.g. "Book by May 1, 2027"
        note: "",
      },
    ],
  },

  /* ---------------- REGISTRY ---------------- */
  registry: {
    show: true,
    intro: "Your presence is the greatest gift. If you'd like to celebrate with something more, we've registered at the places below.",
    items: [
      { name: "Amazon",    url: "", note: "" },
      { name: "Target",    url: "", note: "" },
      { name: "Honeymoon Fund", url: "", note: "" },
    ],
  },

  /* ---------------- RSVP ---------------- */
  rsvp: {
    show: true,
    deadline: "",       // e.g. "May 15, 2027"
    intro: "We can't wait to celebrate with you. Please let us know if you can make it.",

    // HOW RSVPs ARE COLLECTED  (pick ONE mode)
    //   "soon"       -> shows "RSVP opening soon" (use until you set one up)
    //   "guestlist"  -> INVITE-ONLY. Guests search their name, see their whole party
    //                   (kids included) and answer for each person. Only names in your
    //                   Google Sheet guest list work. Setup: apps-script/SETUP.md
    //   "googleform" -> embeds a Google Form (anyone with the link can answer)
    //   "link"       -> a button that opens any RSVP link (Zola, The Knot, etc.)
    mode: "soon",
    scriptUrl: "",      // guestlist mode: paste your Google Apps Script web app URL here
    googleFormEmbedUrl: "",
    link: "",

    // Extra questions in the guestlist form (the meal is a BBQ buffet, so no meal pick)
    askDietary: true,
    askSong: true,
  },

  /* ---------------- SHARE YOUR PHOTOS ---------------- */
  photoShare: {
    show: true,
    intro: "Help us capture every moment. Upload your photos from the weekend and tag us so we can relive it all.",
    // Easiest free options: a Google Photos shared album link, a Dropbox "File Request",
    // or a Google Drive folder set to "Anyone with link can edit".
    url: "",
    buttonText: "Upload your photos",
    hashtag: "",   // leave blank to reuse couple.hashtag
  },

  /* ---------------- Q & A ---------------- */
  faq: {
    show: true,
    items: [
      { q: "Can I bring a plus one?", a: "We're keeping our celebration to the guests named on your invitation. When you RSVP, you'll see everyone in your party." },
      { q: "Are children welcome?", a: "Children named on your invitation are welcome, and you'll answer for them when you RSVP." },
      { q: "What will be served?", a: "Dinner is a BBQ buffet. Please tell us about any dietary restrictions when you RSVP." },
      { q: "What time should I arrive?", a: "" },
      { q: "Will the ceremony be indoors or outdoors?", a: "" },
      { q: "Is there parking at the venue?", a: "" },
    ],
  },

  /* ---------------- FOOTER ---------------- */
  footer: {
    note: "",   // e.g. "Made with love in Charleston"
  },
};
