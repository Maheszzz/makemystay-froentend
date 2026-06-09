export const RELATED_LOCALITIES: Record<string, string[]> = {
  whitefield: [
    'brookefield',
    'hoodi',
    'mahadevapura',
    'kr-puram',
    'marathahalli'
  ],
  marathahalli: [
    'whitefield',
    'brookefield',
    'mahadevapura',
    'bellandur',
    'sarjapur-road'
  ],
  bellandur: [
    'hsr-layout',
    'sarjapur-road',
    'marathahalli',
    'koramangala',
    'kadubeesanahalli'
  ],
  'hsr-layout': [
    'koramangala',
    'btm',
    'bellandur',
    'sarjapur-road',
    'electronic-city'
  ],
  koramangala: [
    'hsr-layout',
    'btm',
    'bellandur',
    'indiranagar',
    'jayanagar'
  ],
  'electronic-city': [
    'hsr-layout',
    'sarjapur-road',
    'btm'
  ],
  'sarjapur-road': [
    'bellandur',
    'hsr-layout',
    'electronic-city',
    'marathahalli'
  ],
  brookefield: [
    'whitefield',
    'marathahalli',
    'hoodi',
    'mahadevapura'
  ],
  mahadevapura: [
    'whitefield',
    'brookefield',
    'hoodi',
    'kr-puram',
    'marathahalli'
  ],
  btm: [
    'hsr-layout',
    'koramangala',
    'jayanagar',
    'jp-nagar'
  ],
  indiranagar: [
    'koramangala',
    'domlur',
    'cv-raman-nagar'
  ],
  'jp-nagar': [
    'jayanagar',
    'btm',
    'hsr-layout'
  ],
  jayanagar: [
    'jp-nagar',
    'btm',
    'koramangala'
  ],
  'manyata-tech-park': [
    'hebbal',
    'nagawara',
    'thanisandra'
  ]
};

export default RELATED_LOCALITIES;
