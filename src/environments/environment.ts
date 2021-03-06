// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  site: 'https://estrenarvivienda.demodayscript.com/',
  autor: '',
  title: '',
  description : '',
  key_words: '',
  image: '',
  path : 'https://estrenarvivienda.demodayscript.com/',
  type: 'website',
  production: false,
  endpoint: 'https://api-estrenarvivienda.demodayscript.com/',
  endpointApi: 'https://api-estrenarvivienda.demodayscript.com/api/',
  endpointApiBasicPage: 'https://lab.estrenarvivienda.com/router/translate-path?path=',
  endpointSearchApi: 'https://api-estrenarvivienda.demodayscript.com/api/search?',
  endpointTesting: 'https://api-estrenarvivienda.demodayscript.com/api/',
  endpointTestingApi: 'https://lab.estrenarvivienda.com/api/',
  endpointTestingApiAdServer: 'https://ads.estrenarvivienda.com/www/delivery/asyncspc.php?zones=',
  endpointTestingApiPost: 'https://lab.estrenarvivienda.com/',
  endpointTestingApiUrl: 'https://lab.estrenarvivienda.com',
  endpointTestingApiElastic: 'http://test-blaa.demodayscript.com/api/elasticsearch?',
  not_metas:
    [{
      "tag": "link",
      "attributes": {
        "rel": "canonical",
        "href": ""
      }
    },
    {
      "tag": "meta",
      "attributes": {
        "name": "title",
        "content": "404"
      }
    },
    {
      "tag": "meta",
      "attributes": {
        "name": "description",
        "content": ""
      }
    },
    {
    "tag": "meta",
      "attributes": {
      "name": "abstract",
      "content": ""
      }
    }],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
