import cheerio from "cheerio";
import moment from "moment";
import { htmlToText } from "html-to-text";

const BILLBOARD_BASE_URL = "https://www.billboard.com";
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;
const BILLBOARD_CHART_CATEGORY_URL_PREFIX = `${BILLBOARD_BASE_URL}/pmc-ajax/charts-fetch-all-chart/selected_category-`;
const BILLBOARD_CHART_CATEGORY_URL_SUFFIX = "/chart_type-weekly/";

export interface Song {
  artist: string;
  title: string;
  cover?: string;
  rank?: number;
}

export const getChart = async (date: Date) => {
  let chartName = "hot-100";
  let chartDate = date;

  if (typeof date === "function") {
    // if date not specified, default to specified chart for current week,
    // and set callback method accordingly
    chartDate = new Date();
  }

  const songs: Song[] = [];

  const requestURL = `${BILLBOARD_CHARTS_URL}${chartName}`;
  const res = await fetch(requestURL);
  const html = await res.text();

  const $ = cheerio.load(html);

  let d = null;
  for (let i = 0; i < $(".c-heading").length; i += 1) {
    if ($(".c-heading")[i].children[0].data.includes("Week of ")) {
      d = moment(
        new Date(
          $(".c-heading")[i].children[0].data.trim().slice("Week of ".length)
        )
      );
      break;
    }
  }

  if (!d) return songs;

  const chartItems = $(".o-chart-results-list-row-container");
  for (let i = 0; i < chartItems.length; i += 1) {
    const infoContainer = chartItems[i].children[1];
    const titleAndArtistContainer =
      infoContainer.children[7].children[1].children[1];
    const posInfo = infoContainer.children[7].children[1];

    const rank = parseInt(
      infoContainer.children[1].children[1].children[0].data.trim(),
      10
    );
    const title = titleAndArtistContainer.children[1].children[0].data.trim();
    const artist = titleAndArtistContainer.children[3]
      ? titleAndArtistContainer.children[3].children[0].data.trim()
      : undefined;
    const cover =
      infoContainer.children[3].children[1].children[1].children[1].attribs[
        "data-lazy-src"
      ];
    const position = {
      positionLastWeek: parseInt(
        posInfo.children[7].children[1].children[0].data.trim(),
        10
      ),
      peakPosition: parseInt(
        posInfo.children[9].children[1].children[0].data.trim(),
        10
      ),
      weeksOnChart: parseInt(
        posInfo.children[11].children[1].children[0].data.trim(),
        10
      ),
    };

    if (artist) {
      songs.push({
        rank,
        title,
        artist,
        cover,
      });
    } else {
      songs.push({
        rank,
        artist: title,
        cover,
        title,
      });
    }
  }

  return songs.slice(0, 10);
};

// export const getChartsFromCategories = async (categoryURLs, cb) => {
//   const charts = [];

//   const promises = categoryURLs.map((categoryURL) => new Promise(((res) => {
//     request(categoryURL, (error, response, html) => {
//       if (error) {
//         res();
//       }
//       const $ = cheerio.load(JSON.parse(html).html);

//       const chartLinks = $('a.lrv-u-flex.lrv-u-flex-direction-column');
//       for (let i = 0; i < chartLinks.length; i += 1) {
//         if (chartLinks[i].attribs.href.startsWith('/charts/')) {
//           charts.push({ name: chartLinks[i].children[1].children[1].children[0].data.trim(), url: `${BILLBOARD_BASE_URL}${chartLinks[i].attribs.href}` });
//         }
//       }
//       res();
//     });
//   })));

//   Promise.all(promises).then(() => {
//     cb(charts);
//   });
// };

// export function listCharts(cb) {
//   if (typeof cb !== 'function') {
//     cb('Specified callback is not a function.', null);
//     return;
//   }

//   request(BILLBOARD_CHARTS_URL, (error, response, html) => {
//     if (error) {
//       cb(error, null);
//       return;
//     }

//     const $ = cheerio.load(html);

//     const categoryElements = $('.o-nav__list-item.lrv-u-color-grey-medium-dark');
//     const categoryURLs = [];
//     for (let i = 0; i < categoryElements.length; i += 1) {
//       if (categoryElements[i].children && categoryElements[i].children[1].attribs.href === '#') {
//         const categoryName = encodeURIComponent(categoryElements[i].children[1].attribs.rel);
//         categoryURLs.push(`${BILLBOARD_CHART_CATEGORY_URL_PREFIX}${categoryName}${BILLBOARD_CHART_CATEGORY_URL_SUFFIX}`);
//       }
//     }

//     getChartsFromCategories(categoryURLs, (charts) => {
//       if (charts.length > 0) {
//         cb(null, charts);
//       } else {
//         cb('No charts found.', null);
//       }
//     });
//   });
// }
