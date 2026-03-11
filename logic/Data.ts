import { Groups } from './AppTypes';

export const GroupsList: Groups[] = [
    {
        id: 'active',
        name: 'Active Satellites',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle'
    },
    {
        id: 'stations',
        name: 'Space Stations',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle'
    },
    {
        id: 'gps',
        name: 'GPS Operational',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle'
    },
    {
        id: 'weather',
        name: 'Weather',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle'
    },
    {
        id: 'science',
        name: 'Scientific',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle'
    },
    {
        id: 'iridium',
        name: 'Iridium',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium&FORMAT=tle'
    },
    {
        id: 'starlink',
        name: 'Starlink',
        url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle'
    }
];
