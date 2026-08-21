var SHOWS = [
    { date: "2026/09/25", city: "Tacoma, WA", venue: "Airport Tavern" },
    { date: "2026/08/21", city: "Shoreline, WA", venue: "Aurora Borealis",
        tickets: "https://www.eventbrite.com/e/sludge-factory-with-guests-catalyst-22-pines-tickets-1995920810874" },
    { date: "2026/08/15", city: "Darrington, WA", venue: "Rock The Mountain Festival 2026",
        tickets: "https://tickets.eventhub.net/e/rock-the-mountain-2026/tickets" },
    { date: "2026/07/10", city: "Tacoma, WA", venue: "Jazzbones",
        tickets: "https://tickets.venuepilot.com/e/nw-tool-tribute-a-tribute-to-tool-with-sludge-factor-a-tribute-to-alice-in-chains-2026-07-10-jazzbone-05d56d" },
    { date: "2026/06/18", city: "Seattle, WA", venue: "Blue Moon Tavern",
        tickets: "https://www.instagram.com/p/DXR3638jRay" },
    { date: "2026/05/11", city: "Arlington, WA", venue: "Mirkwood Public House" },
    { date: "2026/02/28", city: "Arlington, WA", venue: "Mirkwood Public House" },
    { date: "2025/08/15", city: "Seattle, WA", venue: "El Corazon",
        tickets: "https://wl.eventim.us/event/herway-to-hell/659634?afflky=ElCorazon", extra: "supporting Herway to Hell" },
    { date: "2025/04/02", city: "Seattle, WA", venue: "High Dive" }, 
    { date: "2024/09/20", city: "Seattle, WA", venue: "Rendezvous, The Jewelbox Theater" }, 
    { date: "2024/06/22", city: "Longview, WA", venue: "R. A. Long Park" }, 
    { date: "2024/05/04", city: "Everett, WA", venue: "Middleton Brewery" }, 
    { date: "2024/03/09", city: "Portland, OR", venue: "Stage 722, Morrison Market" }, 
    { date: "2024/03/06", city: "Seattle, WA", venue: "High Dive" }, 
    { date: "2023/08/12", city: "Seattle, WA", venue: "El Corazon", ref_videos: "#article-corazon-1-23"  }, 
    { date: "2023/07/15", city: "Oakland, CA", venue: "Retro Junkie" }, 
    { date: "2023/07/14", city: "San Francisco, CA", venue: "The Chapel" }, 
    { date: "2023/03/18", city: "Lynwood, WA", venue: "Vessel Taphouse", ref_videos: "#article-vessel-23" }, 
    { date: "2023/01/14", city: "Seattle, WA", venue: "El Corazon", ref_videos: "#article-corazon-2-23" }, 
    { date: "2022/08/19", city: "Lynwood, WA", venue: "Vessel Taphouse", ref_videos: "#article-vessel-22" },
]

function splitShows(shows){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    function isPast(date) {
        const dateB = new Date(date);
        dateB.setHours(0, 0, 0, 0);
        return dateB - today < 0;
    }
    var past = shows.filter((show) => isPast(show.date));
    var upcoming = shows.filter((show) => !isPast(show.date)).toReversed()
    if (upcoming.length == 0) {
        upcoming = [{date: null, city: "More information soon", venue: ''}]
    }
    return {
        past: past,
        upcoming: upcoming,
    }
}

var {past, upcoming} = splitShows(SHOWS);

loadPreItems(upcoming, $('.events > .events__grid--intro'));
loadItems(upcoming, $('#shows > .uk-container > .events__table'), 'upcoming');

loadItems(past, $('#past_tour > .uk-container > .events__table'), 'past');


function loadPreItems(items, location) {
    var formattedItems = items.map((x) => formatShow(x));
    var contents = formattedItems.map((formattedItem) => `
        <div>
        <a href="#shows" data-uk-scroll="offset: 80">
            <div class="events__block bg-dark--1 uk-grid-collapse" data-uk-grid>
                ${formattedItem}
            </div>
        </a>
        </div>
    `)
    $(location).append(contents);
}

function loadItems(items, location, props) {
    var formattedItems = items.map((x) => formatShow(x, props));
    $(location).append(formattedItems)
}


function formatShow(show, props) {
    var dd;
    if (show.date === null){
        dd = {day: '', month: 'TBD', year: ''}
    } else {
        var parsed = new Date(show.date);
        dd = {
            day: parsed.getDate(),
            month: new Intl.DateTimeFormat('en', {month: 'short'}).format(parsed).toUpperCase(),
            year: parsed.getFullYear(),
        }
    }
    var item = `
        <div class="events__date uk-width-auto">
            <span class="events__day">${dd.day}</span>
            <span class="events__month">${dd.month}</span>
            <span class="events__year">${dd.year}</span>
        </div>
        <div class="events__location uk-width-expand">
            <span class="events__place">${show.city}</span>
            <span class="events__club">${show.venue} ${props && show.extra ? `(${show.extra})` : ''}</span>
        </div>
    `
    if (props) {
        const ticketSection = props == 'upcoming' && show.tickets ? `
            <div class="events__booking uk-width-1-1 uk-width-1-3@s">
                <a target="_blank" href="${show.tickets}" class="btn">Info ${ show.tickets.includes('instagram')? '' : '& Tickets'}</a>
            </div>
        ` : '';
        const videosSection = props == 'past' && show.ref_videos ? `
            <div class="events__booking uk-width-1-1 uk-width-1-3@s">
                <a href="#" data-uk-toggle="target: ${show.ref_videos}" class="btn">Videos</a>
            </div>
        ` : '';

        item = `
        <div class="list__item">
            ${item}
            ${ticketSection}
            ${videosSection}
        </div>`;
    }
    return item;
}