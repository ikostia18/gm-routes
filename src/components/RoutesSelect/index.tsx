// *****
// THIS COMPONENT NOT IN USE - IT WAS AN INITIAL EFFORT TO WORK WITH HARD CODED POIs
// *****

import { SetStateAction, useState } from 'react';

// interface ISelect {
//   options: {
//     label: string;
//     value: string;
//   }[];
//   onChange: React.ChangeEventHandler<HTMLSelectElement>;
// }

const RoutesSelect = () => {
  const [value, setValue] = useState('fruit');

  const routes = [
    { label: 'Central Park To One World Trade Center', value: 'NY' },
    { label: 'Azrieli Mall To Levinski Market', value: 'TLV' },
  ];

  const pointsOfIntersets = [
    {
      key: 'NY',
      places: [
        {
          name: 'Rockefeller Center',
          description:
            'Located in the heart of Midtown, Rockefeller Center is an Art Deco complex composed of 19 grand buildings. Its home to a network of businesses, television studios, shopping and dining choices as well as stunning artwork and architecture',
          location: '45 Rockefeller Plaza, New York, NY 10111',
          gps: {
            lat: 40.75846031729568,
            lang: -73.97859114127773,
          },
        },
        {
          name: 'Empire State Building',
          description:
            'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. The building was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York',
          location: '20 W 34th St., New York, NY 10001',
          gps: {
            lat: 40.74882233890317,
            lang: -73.98701894876713,
          },
        },
      ],
    },
    {
      key: 'TLV',
      places: [
        {
          name: 'Sarona Market',
          description:
            'Sarona Market is Tel Aviv’s latest culinary center, rivalling the new wave of food markets which have popped up around the world, such as La Boqueria in Barcelona, Chelsea Market in New York City, and Borough Market in London',
          location: 'Aluf Kalman Magen Street 23, Tel Aviv-Yafo',
          gps: {
            lat: 32.071458539920584,
            lang: 34.784602814168885,
          },
        },
        {
          name: 'TLV Mall',
          description:
            'We’re talking about the BIG BANG of the Israeli fashion world. A new creation that combines a perfect location, an astonishing passion for fashion, and an endless expanse of stores and possibilities. Here you’ll be able to get a first taste of the newest fashion brands in Israel and visit amazing flagship stores',
          location:
            'Hashmonaim 96 - Karlibach 4 - Menachem Begin 97 , Tel Aviv-Yafo',
          gps: {
            lat: 32.06954145654275,
            lang: 34.786322388034,
          },
        },
      ],
    },
  ];

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        Select your route:
        <select value={value} onChange={handleChange}>
          {routes.map((route) => (
            <option value={route.value}>{route.label}</option>
          ))}
        </select>
      </label>

      <p>We choose {value}.</p>
    </div>
  );
};

export default RoutesSelect;
