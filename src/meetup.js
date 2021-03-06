'use strict';

// Use `got` instead of using `https` (intransparent syntax) or `request-promise` (bloated)
const got = require('got');
const util = require('./util');

// Meetup API test console: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events
const GET_UPCOMING_EVENTS_URL =
  'https://api.meetup.com/Code-Star-Night/events?&sign=true&photo-host=public&page=3&fields=featured_photo&desc=false';
const GET_PAST_EVENTS_URL =
  'https://api.meetup.com/Code-Star-Night/events?&sign=true&photo-host=public&page=20&desc=true&status=past&fields=featured_photo';
const FALLBACK_IMAGE =
  'https://res.cloudinary.com/codestar/image/upload/v1532409289/codestar.nl/meetup/codestar-night-logo.jpg';

module.exports.getUpcomingEvents = async (event, context, callback) => {
  try {
    const headers = util.safeGetHeaders(event.headers.origin);
    const response = await got(GET_UPCOMING_EVENTS_URL, { json: true });
    const mEvents = response.body.map(
      // eslint-disable-next-line
      ({ name, time, link, description, featured_photo }) => ({
        name,
        time,
        link,
        description,
        featured_photo,
      })
    );
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(mEvents),
    });
  } catch (err) {
    console.log(err, err.stack);
    callback('Failed GET_UPCOMING_EVENTS ' + err);
  }
};

// eslint-disable-next-line
function pluckEventProperties({ name, time, link, featured_photo }) {
  return {
    name,
    time,
    link,
    featured_photo,
  };
}

async function addEventPhoto({
  featured_photo: featuredPhoto,
  ...mEventWithoutPhoto
}) {
  const resolvedPhoto =
    featuredPhoto || (await getEventPhoto(mEventWithoutPhoto));
  return {
    featured_photo: resolvedPhoto,
    ...mEventWithoutPhoto,
  };
}

async function getEventPhoto(mEventWithoutPhoto) {
  // Generate a valid file name
  const cleanName = mEventWithoutPhoto.name.replace(/[^\w]/g, '');
  const photoUrl = `https://res.cloudinary.com/codestar/image/upload/e_art:fes,c_fill,h_170,w_300/v1533472199/codestar.nl/meetup/${cleanName}`;
  // Check if Cloudinary image exists
  try {
    const imgHead = await got.head(photoUrl, { json: true });
    const hasValidLength = parseInt(imgHead.headers['content-length'], 10) > 0;
    if (hasValidLength) {
      return {
        photo_link: photoUrl,
      };
    }
    throw new Error('No image found or parsing failed');
  } catch (err) {
    // E.g. 404 because not found
    return Promise.resolve({
      photo_link: FALLBACK_IMAGE,
    });
  }
}

module.exports.getPastEvents = async (event, context, callback) => {
  try {
    const headers = util.safeGetHeaders(event.headers.origin);
    const response = await got(GET_PAST_EVENTS_URL, { json: true });
    const mEvents = await response.body;
    // If Meetup.com does not have a featured_photo, try to fallback to a Cloudinary image
    const mEventsWithGuaranteedPhoto = await Promise.all(
      mEvents.map(pluckEventProperties).map(addEventPhoto)
    );
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(mEventsWithGuaranteedPhoto),
    });
  } catch (err) {
    console.log(err, err.stack);
    callback(`Failed GET_PAST_EVENTS ${err}`);
  }
};
