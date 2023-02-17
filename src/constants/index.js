export const stateAbbreviations = {
  ALABAMA: "AL",
  ALASKA: "AK",
  "AMERICAN SAMOA": "AS",
  ARIZONA: "AZ",
  ARKANSAS: "AR",
  CALIFORNIA: "CA",
  COLORADO: "CO",
  CONNECTICUT: "CT",
  DELAWARE: "DE",
  "DISTRICT OF COLUMBIA": "DC",
  "FEDERATED STATES OF MICRONESIA": "FM",
  FLORIDA: "FL",
  GEORGIA: "GA",
  GUAM: "GU",
  HAWAII: "HI",
  IDAHO: "ID",
  ILLINOIS: "IL",
  INDIANA: "IN",
  IOWA: "IA",
  KANSAS: "KS",
  KENTUCKY: "KY",
  LOUISIANA: "LA",
  MAINE: "ME",
  "MARSHALL ISLANDS": "MH",
  MARYLAND: "MD",
  MASSACHUSETTS: "MA",
  MICHIGAN: "MI",
  MINNESOTA: "MN",
  MISSISSIPPI: "MS",
  MISSOURI: "MO",
  MONTANA: "MT",
  NEBRASKA: "NE",
  NEVADA: "NV",
  "NEW HAMPSHIRE": "NH",
  "NEW JERSEY": "NJ",
  "NEW MEXICO": "NM",
  "NEW YORK": "NY",
  "NORTH CAROLINA": "NC",
  "NORTH DAKOTA": "ND",
  "NORTHERN MARIANA ISLANDS": "MP",
  OHIO: "OH",
  OKLAHOMA: "OK",
  OREGON: "OR",
  PALAU: "PW",
  PENNSYLVANIA: "PA",
  "PUERTO RICO": "PR",
  "RHODE ISLAND": "RI",
  "SOUTH CAROLINA": "SC",
  "SOUTH DAKOTA": "SD",
  TENNESSEE: "TN",
  TEXAS: "TX",
  UTAH: "UT",
  VERMONT: "VT",
  "VIRGIN ISLANDS": "VI",
  VIRGINIA: "VA",
  WASHINGTON: "WA",
  "WEST VIRGINIA": "WV",
  WISCONSIN: "WI",
  WYOMING: "WY",
};

const primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79,
  83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167,
  173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263,
  269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367,
  373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
  467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587,
  593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683,
  691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
  821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929,
  937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033,
  1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123,
  1129, 1151, 1153, 1163,
]; // 1171, 1181, 1187,

export const countryCodeToPrime = {
  // Used
  US: 2, // United States
  // Unused
  AL: 3, // Albania
  DZ: 5, // Algeria
  AD: 7, // Andorra
  AO: 11, // Angola
  AG: 13, // Antigua and Barbuda
  AR: 17, // Argentina
  AM: 19, // Armenia
  AU: 23, // Australia
  AT: 29, // Austria
  AZ: 31, // Azerbaijan
  BS: 37, // Bahamas
  BH: 41, // Bahrain
  BD: 43, // Bangladesh
  BB: 47, // Barbados
  BY: 53, // Belarus
  BE: 59, // Belgium
  BZ: 61, // Belize
  BJ: 67, // Benin
  BT: 71, // Bhutan
  BO: 73, // "Bolivia, Plurinational State of"
  BA: 79, // Bosnia and Herzegovina
  BW: 83, // Botswana
  BR: 89, // Brazil
  BN: 97, // Brunei Darussalam
  BG: 101, // Bulgaria
  BF: 103, // Burkina Faso
  BI: 107, // Burundi
  KH: 109, // Cambodia
  CM: 113, // Cameroon
  CA: 127, // Canada
  CV: 131, // Cape Verde
  CF: 137, // Central African Republic
  TD: 139, // Chad
  CL: 149, // Chile
  CN: 151, // China
  CO: 157, // Colombia
  KM: 163, // Comoros
  CG: 167, // Congo
  CD: 173, // "Congo, the Democratic Republic of the",
  CR: 179, // Costa Rica
  CI: 181, // Côte d'Ivoire
  HR: 191, // Croatia
  CU: 193, // Cuba
  CY: 197, // Cyprus
  CZ: 199, // Czech Republic
  DK: 211, // Denmark
  DJ: 223, // Djibouti
  DM: 227, // Dominica
  DO: 229, // Dominican Republic
  EC: 233, // Ecuador
  EG: 239, // Egypt
  SV: 241, // El Salvador
  GQ: 251, // Equatorial Guinea
  ER: 257, // Eritrea
  EE: 263, // Estonia
  SZ: 269, // Eswatini, Kingdom of // (formerly Swaziland)
  ET: 271, // Ethiopia
  FJ: 277, // Fiji
  FI: 281, // Finland
  FR: 283, // France
  GA: 293, // Gabon
  GM: 307, // Gambia
  GE: 311, // Georgia
  DE: 313, // Germany
  GH: 317, // Ghana
  GR: 331, // Greece
  GD: 337, // Grenada
  GT: 347, // Guatemala
  GN: 349, // Guinea
  GW: 353, // Guinea-Bissau
  GY: 359, // Guyana
  HT: 367, // Haiti
  HN: 373, // Honduras
  // HK: 10000, // Hong Kong
  HU: 379, // Hungary
  IS: 383, // Iceland
  IN: 389, // India
  ID: 397, // Indonesia
  IR: 401, // "Iran, Islamic Republic of"
  IQ: 409, // Iraq
  IE: 419, // Ireland
  IL: 421, // Israel
  IT: 431, // Italy
  JM: 433, // Jamaica
  JP: 439, // Japan
  JO: 443, // Jordan
  KZ: 449, // Kazakhstan
  KE: 457, // Kenya
  KI: 461, // Kiribati
  KP: 463, // "Korea, Democratic People's Republic of"
  KR: 467, // "Korea, Republic of"
  KW: 479, // Kuwait
  KG: 487, // Kyrgyzstan
  LA: 491, // Lao People's Democratic Republic
  LV: 499, // Latvia
  LB: 503, // Lebanon
  LS: 509, // Lesotho
  LR: 521, // Liberia
  LY: 523, // Libya // (formerly Libyan Arab Jamahiriya)
  LI: 541, // Liechtenstein
  LT: 547, // Lithuania
  LU: 557, // Luxembourg
  MK: 563, // North Macedonia // (formerly "Macedonia, the former Yugoslav Republic of")
  MG: 569, // Madagascar
  MW: 571, // Malawi
  MY: 577, // Malaysia
  MV: 587, // Maldives
  ML: 593, // Mali
  MT: 599, // Malta
  MH: 601, // Marshall Islands
  MR: 607, // Mauritania
  MU: 613, // Mauritius
  MX: 617, // Mexico
  FM: 619, // "Micronesia, Federated States of"
  MD: 631, // "Moldova, Republic of",
  MC: 641, // Monaco
  MN: 643, // Mongolia
  ME: 647, // Montenegro
  MA: 653, // Morocco
  MZ: 659, // Mozambique
  MM: 661, // Myanmar
  NA: 673, // Namibia
  NR: 677, // Nauru
  NP: 683, // Nepal
  NL: 691, // Netherlands
  NZ: 701, // New Zealand
  NI: 709, // Nicaragua
  NE: 719, // Niger
  NG: 727, // Nigeria
  NO: 733, // Norway
  OM: 739, // Oman
  PK: 743, // Pakistan
  PW: 751, // Palau
  PA: 757, // Panama
  PG: 761, // Papua New Guinea
  PY: 769, // Paraguay
  PE: 773, // Peru
  PH: 787, // Philippines
  PL: 797, // Poland
  PT: 809, // Portugal
  // PR: 10000, // Puerto Rico
  QA: 811, // Qatar
  RO: 821, // Romania
  RU: 823, // Russian Federation
  RW: 827, // Rwanda
  KN: 829, // Saint Kitts and Nevis
  LC: 839, // Saint Lucia
  VC: 853, // Saint Vincent and the Grenadines
  WS: 857, // Samoa
  SM: 859, // San Marino
  ST: 863, // Sao Tome and Principe
  SA: 877, // Saudi Arabia
  SN: 881, // Senegal
  RS: 883, // Serbia
  SC: 887, // Seychelles
  SL: 907, // Sierra Leone
  SG: 911, // Singapore
  SK: 919, // Slovakia
  SI: 929, // Slovenia
  SB: 937, // Solomon Islands
  SO: 941, // Somalia
  ZA: 947, // South Africa
  // TODO: South Sudan?
  ES: 953, // Spain
  LK: 967, // Sri Lanka,
  SD: 971, // Sudan,
  SR: 977, // Suriname,
  SE: 983, // Sweden,
  CH: 991, // Switzerland,
  SY: 997, // Syrian Arab Republic,
  // TW: 10000, // "Taiwan, Province of China",
  TJ: 1009, // Tajikistan,
  TZ: 1013, // "Tanzania, United Republic of",
  TH: 1019, // Thailand,
  TL: 1021, // Timor-Leste,
  TG: 1031, // Togo,
  TO: 1033, // Tonga,
  TT: 1039, // Trinidad and Tobago,
  TN: 1049, // Tunisia,
  TR: 1051, // Türkiye,
  TM: 1061, // Turkmenistan,
  TV: 1063, // Tuvalu,
  UG: 1069, // Uganda,
  UA: 1087, // Ukraine,
  AE: 1091, // United Arab Emirates,
  GB: 1093, // United Kingdom,
  AF: 1097, // Afghanistan
  UY: 1103, // Uruguay,
  UZ: 1109, // Uzbekistan,
  VU: 1117, // Vanuatu,
  VE: 1123, // "Venezuela, Bolivarian Republic of",
  VN: 1129, // Viet Nam,
  YE: 1151, // Yemen,
  ZM: 1153, // Zambia,
  ZW: 1163, // Zimbabwe
};
