// This file is auto-generated and updated by PdfMapper.
export interface SurveyQuestion {
  id: number;
  texto: string;
  coords?: { x: number; y: number; page: number }[];
}

export interface SurveySection {
  key: string;
  titulo: string;
  instruccion: string;
  filtro?: string;
  preguntas: SurveyQuestion[];
}

export interface FichaQuestion {
  id: number;
  texto: string;
  tipo: 'text' | 'select' | 'number' | 'radio' | 'years';
  opciones?: string[];
  subfields?: { label: string; key: string }[];
  coords?: { x: number; y: number; page: number }[];
}

export interface ConsentimientoField {
  id: string;
  label: string;
  coords?: { x: number; y: number; page: number }[];
}

export const LIKERT_OPTIONS_INTRALABORAL = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'algunas_veces', label: 'Algunas veces' },
  { value: 'casi_nunca', label: 'Casi nunca' },
  { value: 'nunca', label: 'Nunca' },
];

export const LIKERT_OPTIONS_ESTRES = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'a_veces', label: 'A veces' },
  { value: 'nunca', label: 'Nunca' },
];

export const LIKERT_OPTIONS_EXTRALABORAL = [
  { value: 'siempre', label: 'Siempre' },
  { value: 'casi_siempre', label: 'Casi siempre' },
  { value: 'algunas_veces', label: 'Algunas veces' },
  { value: 'casi_nunca', label: 'Casi nunca' },
  { value: 'nunca', label: 'Nunca' },
];

// FORMA A sections
export const formaASections: SurveySection[] = [
  {
    "key": "condiciones_ambientales",
    "titulo": "Condiciones Ambientales del Lugar de Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con las condiciones ambientales del(los) sitio(s) o lugar(es) donde habitualmente realiza su trabajo.",
    "preguntas": [
      {
        "id": 1,
        "texto": "El ruido en el lugar donde trabajo es molesto",
        "coords": [
          {
            "x": 263,
            "y": 390,
            "page": 2
          },
          {
            "x": 295,
            "y": 391,
            "page": 2
          },
          {
            "x": 327,
            "y": 391,
            "page": 2
          },
          {
            "x": 361,
            "y": 391,
            "page": 2
          },
          {
            "x": 392,
            "y": 391,
            "page": 2
          }
        ]
      },
      {
        "id": 2,
        "texto": "En el lugar donde trabajo hace mucho frío",
        "coords": [
          {
            "x": 262,
            "y": 373,
            "page": 2
          },
          {
            "x": 297,
            "y": 372,
            "page": 2
          },
          {
            "x": 326,
            "y": 373,
            "page": 2
          },
          {
            "x": 360,
            "y": 373,
            "page": 2
          },
          {
            "x": 395,
            "y": 373,
            "page": 2
          }
        ]
      },
      {
        "id": 3,
        "texto": "En el lugar donde trabajo hace mucho calor",
        "coords": [
          {
            "x": 268,
            "y": 352,
            "page": 2
          },
          {
            "x": 296,
            "y": 353,
            "page": 2
          },
          {
            "x": 325,
            "y": 353,
            "page": 2
          },
          {
            "x": 360,
            "y": 353,
            "page": 2
          },
          {
            "x": 390,
            "y": 351,
            "page": 2
          }
        ]
      },
      {
        "id": 4,
        "texto": "El aire en el lugar donde trabajo es fresco y agradable",
        "coords": [
          {
            "x": 266,
            "y": 329,
            "page": 2
          },
          {
            "x": 299,
            "y": 328,
            "page": 2
          },
          {
            "x": 328,
            "y": 330,
            "page": 2
          },
          {
            "x": 357,
            "y": 329,
            "page": 2
          },
          {
            "x": 393,
            "y": 327,
            "page": 2
          }
        ]
      },
      {
        "id": 5,
        "texto": "La luz del sitio donde trabajo es agradable",
        "coords": [
          {
            "x": 264,
            "y": 311,
            "page": 2
          },
          {
            "x": 295,
            "y": 309,
            "page": 2
          },
          {
            "x": 327,
            "y": 308,
            "page": 2
          },
          {
            "x": 361,
            "y": 309,
            "page": 2
          },
          {
            "x": 389,
            "y": 308,
            "page": 2
          }
        ]
      },
      {
        "id": 6,
        "texto": "El espacio donde trabajo es cómodo",
        "coords": [
          {
            "x": 267,
            "y": 294,
            "page": 2
          },
          {
            "x": 295,
            "y": 292,
            "page": 2
          },
          {
            "x": 327,
            "y": 292,
            "page": 2
          },
          {
            "x": 357,
            "y": 291,
            "page": 2
          },
          {
            "x": 391,
            "y": 291,
            "page": 2
          }
        ]
      },
      {
        "id": 7,
        "texto": "En mi trabajo me preocupa estar expuesto a sustancias quimicas que afecten mi salud",
        "coords": [
          {
            "x": 266,
            "y": 267,
            "page": 2
          },
          {
            "x": 294,
            "y": 266,
            "page": 2
          },
          {
            "x": 328,
            "y": 269,
            "page": 2
          },
          {
            "x": 356,
            "y": 269,
            "page": 2
          },
          {
            "x": 395,
            "y": 270,
            "page": 2
          }
        ]
      },
      {
        "id": 8,
        "texto": "Mi trabajo me exige hacer mucho esfuerzo físico",
        "coords": [
          {
            "x": 265,
            "y": 242,
            "page": 2
          },
          {
            "x": 295,
            "y": 243,
            "page": 2
          },
          {
            "x": 325,
            "y": 244,
            "page": 2
          },
          {
            "x": 359,
            "y": 243,
            "page": 2
          },
          {
            "x": 389,
            "y": 242,
            "page": 2
          }
        ]
      },
      {
        "id": 9,
        "texto": "Los equipos o herramientas con los que trabajo son cómodos",
        "coords": [
          {
            "x": 265,
            "y": 218,
            "page": 2
          },
          {
            "x": 303,
            "y": 220,
            "page": 2
          },
          {
            "x": 326,
            "y": 221,
            "page": 2
          },
          {
            "x": 356,
            "y": 219,
            "page": 2
          },
          {
            "x": 394,
            "y": 218,
            "page": 2
          }
        ]
      },
      {
        "id": 10,
        "texto": "En mi trabajo me preocupa estar expuesto a sustancias químicas que afecten mi salud",
        "coords": [
          {
            "x": 265,
            "y": 194,
            "page": 2
          },
          {
            "x": 293,
            "y": 194,
            "page": 2
          },
          {
            "x": 327,
            "y": 191,
            "page": 2
          },
          {
            "x": 357,
            "y": 195,
            "page": 2
          },
          {
            "x": 391,
            "y": 193,
            "page": 2
          }
        ]
      },
      {
        "id": 11,
        "texto": "Me preocupa accidentarme en mi trabajo",
        "coords": [
          {
            "x": 263,
            "y": 167,
            "page": 2
          },
          {
            "x": 291,
            "y": 167,
            "page": 2
          },
          {
            "x": 327,
            "y": 168,
            "page": 2
          },
          {
            "x": 363,
            "y": 167,
            "page": 2
          },
          {
            "x": 391,
            "y": 167,
            "page": 2
          }
        ]
      },
      {
        "id": 12,
        "texto": "El lugar donde trabajo es limpio y ordenado",
        "coords": [
          {
            "x": 263,
            "y": 150,
            "page": 2
          },
          {
            "x": 293,
            "y": 151,
            "page": 2
          },
          {
            "x": 329,
            "y": 147,
            "page": 2
          },
          {
            "x": 363,
            "y": 148,
            "page": 2
          },
          {
            "x": 391,
            "y": 149,
            "page": 2
          }
        ]
      }
    ]
  },
  {
    "key": "cantidad_trabajo",
    "titulo": "Cantidad de Trabajo",
    "instruccion": "Para responder a las siguientes preguntas piense en la cantidad de trabajo que usted tiene a cargo.",
    "preguntas": [
      {
        "id": 13,
        "texto": "Por la cantidad de trabajo que tengo debo quedarme tiempo adicional",
        "coords": [
          {
            "x": 265,
            "y": 475,
            "page": 3
          },
          {
            "x": 297,
            "y": 475,
            "page": 3
          },
          {
            "x": 323,
            "y": 475,
            "page": 3
          },
          {
            "x": 358,
            "y": 476,
            "page": 3
          },
          {
            "x": 395,
            "y": 475,
            "page": 3
          }
        ]
      },
      {
        "id": 14,
        "texto": "Me alcanza el tiempo de trabajo para tener al día mis deberes",
        "coords": [
          {
            "x": 267,
            "y": 451,
            "page": 3
          },
          {
            "x": 298,
            "y": 451,
            "page": 3
          },
          {
            "x": 331,
            "y": 451,
            "page": 3
          },
          {
            "x": 360,
            "y": 453,
            "page": 3
          },
          {
            "x": 389,
            "y": 452,
            "page": 3
          }
        ]
      },
      {
        "id": 15,
        "texto": "Por la cantidad de trabajo que tengo debo trabajar sin parar",
        "coords": [
          {
            "x": 267,
            "y": 429,
            "page": 3
          },
          {
            "x": 301,
            "y": 430,
            "page": 3
          },
          {
            "x": 327,
            "y": 431,
            "page": 3
          },
          {
            "x": 365,
            "y": 429,
            "page": 3
          },
          {
            "x": 393,
            "y": 431,
            "page": 3
          }
        ]
      }
    ]
  },
  {
    "key": "esfuerzo_mental",
    "titulo": "Esfuerzo Mental",
    "instruccion": "Las siguientes preguntas están relacionadas con el esfuerzo mental que le exige su trabajo.",
    "preguntas": [
      {
        "id": 16,
        "texto": "Mi trabajo me exige hacer mucho esfuerzo mental",
        "coords": [
          {
            "x": 263,
            "y": 347,
            "page": 3
          },
          {
            "x": 297,
            "y": 348,
            "page": 3
          },
          {
            "x": 325,
            "y": 349,
            "page": 3
          },
          {
            "x": 357,
            "y": 347,
            "page": 3
          },
          {
            "x": 391,
            "y": 347,
            "page": 3
          }
        ]
      },
      {
        "id": 17,
        "texto": "Mi trabajo me exige estar muy concentrado",
        "coords": [
          {
            "x": 273,
            "y": 322,
            "page": 3
          },
          {
            "x": 297,
            "y": 322,
            "page": 3
          },
          {
            "x": 330,
            "y": 325,
            "page": 3
          },
          {
            "x": 357,
            "y": 325,
            "page": 3
          },
          {
            "x": 389,
            "y": 325,
            "page": 3
          }
        ]
      },
      {
        "id": 18,
        "texto": "Mi trabajo me exige memorizar mucha información",
        "coords": [
          {
            "x": 265,
            "y": 301,
            "page": 3
          },
          {
            "x": 294,
            "y": 301,
            "page": 3
          },
          {
            "x": 330,
            "y": 303,
            "page": 3
          },
          {
            "x": 359,
            "y": 301,
            "page": 3
          },
          {
            "x": 391,
            "y": 301,
            "page": 3
          }
        ]
      },
      {
        "id": 19,
        "texto": "En mi trabajo tengo que tomar decisiones difíciles muy rápido",
        "coords": [
          {
            "x": 267,
            "y": 280,
            "page": 3
          },
          {
            "x": 293,
            "y": 279,
            "page": 3
          },
          {
            "x": 328,
            "y": 279,
            "page": 3
          },
          {
            "x": 359,
            "y": 280,
            "page": 3
          },
          {
            "x": 388,
            "y": 281,
            "page": 3
          }
        ]
      },
      {
        "id": 20,
        "texto": "Mi trabajo me exige atender a muchos asuntos al mismo tiempo",
        "coords": [
          {
            "x": 267,
            "y": 257,
            "page": 3
          },
          {
            "x": 297,
            "y": 258,
            "page": 3
          },
          {
            "x": 327,
            "y": 258,
            "page": 3
          },
          {
            "x": 357,
            "y": 257,
            "page": 3
          },
          {
            "x": 391,
            "y": 257,
            "page": 3
          }
        ]
      },
      {
        "id": 21,
        "texto": "Mi trabajo requiere que me fije en pequeños detalles",
        "coords": [
          {
            "x": 263,
            "y": 234,
            "page": 3
          },
          {
            "x": 294,
            "y": 235,
            "page": 3
          },
          {
            "x": 326,
            "y": 237,
            "page": 3
          },
          {
            "x": 361,
            "y": 235,
            "page": 3
          },
          {
            "x": 393,
            "y": 236,
            "page": 3
          }
        ]
      }
    ]
  },
  {
    "key": "responsabilidades",
    "titulo": "Responsabilidades y Actividades",
    "instruccion": "Las siguientes preguntas están relacionadas con las responsabilidades y actividades que usted debe hacer en su trabajo.",
    "preguntas": [
      {
        "id": 22,
        "texto": "En mi trabajo respondo por cosas de mucho valor",
        "coords": [
          {
            "x": 265,
            "y": 152,
            "page": 3
          },
          {
            "x": 296,
            "y": 153,
            "page": 3
          },
          {
            "x": 329,
            "y": 153,
            "page": 3
          },
          {
            "x": 361,
            "y": 150,
            "page": 3
          },
          {
            "x": 389,
            "y": 151,
            "page": 3
          }
        ]
      },
      {
        "id": 23,
        "texto": "En mi trabajo respondo por dinero de la empresa",
        "coords": [
          {
            "x": 263,
            "y": 130,
            "page": 3
          },
          {
            "x": 296,
            "y": 130,
            "page": 3
          },
          {
            "x": 328,
            "y": 129,
            "page": 3
          },
          {
            "x": 361,
            "y": 130,
            "page": 3
          },
          {
            "x": 391,
            "y": 131,
            "page": 3
          }
        ]
      },
      {
        "id": 24,
        "texto": "Como parte de mis funciones debo responder por la seguridad de otros",
        "coords": [
          {
            "x": 275,
            "y": 493,
            "page": 4
          },
          {
            "x": 312,
            "y": 493,
            "page": 4
          },
          {
            "x": 340,
            "y": 492,
            "page": 4
          },
          {
            "x": 377,
            "y": 494,
            "page": 4
          },
          {
            "x": 407,
            "y": 493,
            "page": 4
          }
        ]
      },
      {
        "id": 25,
        "texto": "Respondo ante mi jefe por los resultados de toda mi área de trabajo",
        "coords": [
          {
            "x": 273,
            "y": 471,
            "page": 4
          },
          {
            "x": 306,
            "y": 471,
            "page": 4
          },
          {
            "x": 339,
            "y": 471,
            "page": 4
          },
          {
            "x": 372,
            "y": 469,
            "page": 4
          },
          {
            "x": 405,
            "y": 471,
            "page": 4
          }
        ]
      },
      {
        "id": 26,
        "texto": "Mi trabajo me exige cuidar la salud de otras personas",
        "coords": [
          {
            "x": 278,
            "y": 445,
            "page": 4
          },
          {
            "x": 307,
            "y": 447,
            "page": 4
          },
          {
            "x": 341,
            "y": 448,
            "page": 4
          },
          {
            "x": 375,
            "y": 447,
            "page": 4
          },
          {
            "x": 408,
            "y": 447,
            "page": 4
          }
        ]
      },
      {
        "id": 27,
        "texto": "En el trabajo me dan órdenes contradictorias",
        "coords": [
          {
            "x": 273,
            "y": 427,
            "page": 4
          },
          {
            "x": 307,
            "y": 426,
            "page": 4
          },
          {
            "x": 341,
            "y": 427,
            "page": 4
          },
          {
            "x": 374,
            "y": 427,
            "page": 4
          },
          {
            "x": 409,
            "y": 425,
            "page": 4
          }
        ]
      },
      {
        "id": 28,
        "texto": "En mi trabajo me piden hacer cosas innecesarias",
        "coords": [
          {
            "x": 273,
            "y": 404,
            "page": 4
          },
          {
            "x": 307,
            "y": 405,
            "page": 4
          },
          {
            "x": 339,
            "y": 402,
            "page": 4
          },
          {
            "x": 371,
            "y": 403,
            "page": 4
          },
          {
            "x": 410,
            "y": 403,
            "page": 4
          }
        ]
      },
      {
        "id": 29,
        "texto": "En mi trabajo se presentan situaciones en las que debo pasar por alto normas o procedimientos",
        "coords": [
          {
            "x": 273,
            "y": 375,
            "page": 4
          },
          {
            "x": 309,
            "y": 377,
            "page": 4
          },
          {
            "x": 344,
            "y": 376,
            "page": 4
          },
          {
            "x": 374,
            "y": 375,
            "page": 4
          },
          {
            "x": 410,
            "y": 375,
            "page": 4
          }
        ]
      },
      {
        "id": 30,
        "texto": "En mi trabajo tengo que hacer cosas que se podrían hacer de una forma más práctica",
        "coords": [
          {
            "x": 277,
            "y": 344,
            "page": 4
          },
          {
            "x": 307,
            "y": 343,
            "page": 4
          },
          {
            "x": 343,
            "y": 343,
            "page": 4
          },
          {
            "x": 377,
            "y": 344,
            "page": 4
          },
          {
            "x": 410,
            "y": 342,
            "page": 4
          }
        ]
      }
    ]
  },
  {
    "key": "jornada_trabajo",
    "titulo": "Jornada de Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con la jornada de trabajo.",
    "preguntas": [
      {
        "id": 31,
        "texto": "Trabajo en horario de noche",
        "coords": [
          {
            "x": 270,
            "y": 259,
            "page": 4
          },
          {
            "x": 304,
            "y": 260,
            "page": 4
          },
          {
            "x": 341,
            "y": 260,
            "page": 4
          },
          {
            "x": 379,
            "y": 260,
            "page": 4
          },
          {
            "x": 407,
            "y": 259,
            "page": 4
          }
        ]
      },
      {
        "id": 32,
        "texto": "En mi trabajo es posible tomar pausas para descansar",
        "coords": [
          {
            "x": 269,
            "y": 243,
            "page": 4
          },
          {
            "x": 305,
            "y": 240,
            "page": 4
          },
          {
            "x": 337,
            "y": 237,
            "page": 4
          },
          {
            "x": 373,
            "y": 239,
            "page": 4
          },
          {
            "x": 403,
            "y": 237,
            "page": 4
          }
        ]
      },
      {
        "id": 33,
        "texto": "Mi trabajo me exige laborar en días de descanso, festivos o fines de semana",
        "coords": [
          {
            "x": 272,
            "y": 216,
            "page": 4
          },
          {
            "x": 304,
            "y": 215,
            "page": 4
          },
          {
            "x": 339,
            "y": 217,
            "page": 4
          },
          {
            "x": 374,
            "y": 216,
            "page": 4
          },
          {
            "x": 405,
            "y": 215,
            "page": 4
          }
        ]
      },
      {
        "id": 34,
        "texto": "En mi trabajo puedo tomar fines de semana o días de descanso al mes",
        "coords": [
          {
            "x": 275,
            "y": 189,
            "page": 4
          },
          {
            "x": 299,
            "y": 191,
            "page": 4
          },
          {
            "x": 343,
            "y": 190,
            "page": 4
          },
          {
            "x": 371,
            "y": 189,
            "page": 4
          },
          {
            "x": 407,
            "y": 190,
            "page": 4
          }
        ]
      },
      {
        "id": 35,
        "texto": "Cuando estoy en casa sigo pensando en el trabajo",
        "coords": [
          {
            "x": 267,
            "y": 168,
            "page": 4
          },
          {
            "x": 303,
            "y": 167,
            "page": 4
          },
          {
            "x": 338,
            "y": 167,
            "page": 4
          },
          {
            "x": 373,
            "y": 168,
            "page": 4
          },
          {
            "x": 408,
            "y": 169,
            "page": 4
          }
        ]
      },
      {
        "id": 36,
        "texto": "Discuto con mi familia o amigos por causa de mi trabajo",
        "coords": [
          {
            "x": 272,
            "y": 144,
            "page": 4
          },
          {
            "x": 302,
            "y": 145,
            "page": 4
          },
          {
            "x": 340,
            "y": 146,
            "page": 4
          },
          {
            "x": 374,
            "y": 145,
            "page": 4
          },
          {
            "x": 406,
            "y": 144,
            "page": 4
          }
        ]
      },
      {
        "id": 37,
        "texto": "Debo atender asuntos de trabajo cuando estoy en casa",
        "coords": [
          {
            "x": 271,
            "y": 123,
            "page": 4
          },
          {
            "x": 305,
            "y": 123,
            "page": 4
          },
          {
            "x": 341,
            "y": 123,
            "page": 4
          },
          {
            "x": 379,
            "y": 121,
            "page": 4
          },
          {
            "x": 407,
            "y": 121,
            "page": 4
          }
        ]
      },
      {
        "id": 38,
        "texto": "Por mi trabajo el tiempo que paso con mi familia y amigos es muy poco",
        "coords": [
          {
            "x": 273,
            "y": 98,
            "page": 4
          },
          {
            "x": 306,
            "y": 97,
            "page": 4
          },
          {
            "x": 340,
            "y": 99,
            "page": 4
          },
          {
            "x": 377,
            "y": 99,
            "page": 4
          },
          {
            "x": 405,
            "y": 99,
            "page": 4
          }
        ]
      }
    ]
  },
  {
    "key": "decisiones_control",
    "titulo": "Decisiones y Control",
    "instruccion": "Las siguientes preguntas están relacionadas con las decisiones y el control que le permite su trabajo.",
    "preguntas": [
      {
        "id": 39,
        "texto": "Mi trabajo me permite desarrollar mis habilidades",
        "coords": [
          {
            "x": 273,
            "y": 465,
            "page": 5
          },
          {
            "x": 306,
            "y": 466,
            "page": 5
          },
          {
            "x": 342,
            "y": 467,
            "page": 5
          },
          {
            "x": 379,
            "y": 469,
            "page": 5
          },
          {
            "x": 410,
            "y": 469,
            "page": 5
          }
        ]
      },
      {
        "id": 40,
        "texto": "Mi trabajo me permite aplicar mis conocimientos",
        "coords": [
          {
            "x": 273,
            "y": 442,
            "page": 5
          },
          {
            "x": 305,
            "y": 443,
            "page": 5
          },
          {
            "x": 346,
            "y": 443,
            "page": 5
          },
          {
            "x": 378,
            "y": 442,
            "page": 5
          },
          {
            "x": 405,
            "y": 443,
            "page": 5
          }
        ]
      },
      {
        "id": 41,
        "texto": "Mi trabajo me permite aprender nuevas cosas",
        "coords": [
          {
            "x": 276,
            "y": 422,
            "page": 5
          },
          {
            "x": 307,
            "y": 420,
            "page": 5
          },
          {
            "x": 341,
            "y": 420,
            "page": 5
          },
          {
            "x": 379,
            "y": 421,
            "page": 5
          },
          {
            "x": 410,
            "y": 420,
            "page": 5
          }
        ]
      },
      {
        "id": 42,
        "texto": "Me asignan el trabajo teniendo en cuenta mis capacidades",
        "coords": [
          {
            "x": 272,
            "y": 394,
            "page": 5
          },
          {
            "x": 309,
            "y": 397,
            "page": 5
          },
          {
            "x": 342,
            "y": 397,
            "page": 5
          },
          {
            "x": 376,
            "y": 396,
            "page": 5
          },
          {
            "x": 410,
            "y": 396,
            "page": 5
          }
        ]
      },
      {
        "id": 43,
        "texto": "Puedo tomar pausas cuando las necesito",
        "coords": [
          {
            "x": 273,
            "y": 377,
            "page": 5
          },
          {
            "x": 309,
            "y": 378,
            "page": 5
          },
          {
            "x": 345,
            "y": 376,
            "page": 5
          },
          {
            "x": 379,
            "y": 377,
            "page": 5
          },
          {
            "x": 407,
            "y": 375,
            "page": 5
          }
        ]
      },
      {
        "id": 44,
        "texto": "Puedo decidir cuánto trabajo hago en el día",
        "coords": [
          {
            "x": 275,
            "y": 351,
            "page": 5
          },
          {
            "x": 305,
            "y": 352,
            "page": 5
          },
          {
            "x": 340,
            "y": 354,
            "page": 5
          },
          {
            "x": 378,
            "y": 356,
            "page": 5
          },
          {
            "x": 411,
            "y": 356,
            "page": 5
          }
        ]
      },
      {
        "id": 45,
        "texto": "Puedo decidir la velocidad a la que trabajo",
        "coords": [
          {
            "x": 275,
            "y": 333,
            "page": 5
          },
          {
            "x": 306,
            "y": 331,
            "page": 5
          },
          {
            "x": 347,
            "y": 332,
            "page": 5
          },
          {
            "x": 372,
            "y": 329,
            "page": 5
          },
          {
            "x": 411,
            "y": 333,
            "page": 5
          }
        ]
      },
      {
        "id": 46,
        "texto": "Puedo cambiar el orden de las actividades en mi trabajo",
        "coords": [
          {
            "x": 273,
            "y": 310,
            "page": 5
          },
          {
            "x": 306,
            "y": 308,
            "page": 5
          },
          {
            "x": 341,
            "y": 307,
            "page": 5
          },
          {
            "x": 376,
            "y": 309,
            "page": 5
          },
          {
            "x": 409,
            "y": 311,
            "page": 5
          }
        ]
      },
      {
        "id": 47,
        "texto": "Puedo parar un momento mi trabajo para atender algún asunto personal",
        "coords": [
          {
            "x": 275,
            "y": 287,
            "page": 5
          },
          {
            "x": 307,
            "y": 286,
            "page": 5
          },
          {
            "x": 347,
            "y": 287,
            "page": 5
          },
          {
            "x": 377,
            "y": 285,
            "page": 5
          },
          {
            "x": 409,
            "y": 285,
            "page": 5
          }
        ]
      }
    ]
  },
  {
    "key": "cambios_trabajo",
    "titulo": "Cambios en el Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con cualquier tipo de cambio que ocurra en su trabajo.",
    "preguntas": [
      {
        "id": 48,
        "texto": "Los cambios en mi trabajo han sido beneficiosos",
        "coords": [
          {
            "x": 278,
            "y": 199,
            "page": 5
          },
          {
            "x": 305,
            "y": 197,
            "page": 5
          },
          {
            "x": 343,
            "y": 193,
            "page": 5
          },
          {
            "x": 377,
            "y": 197,
            "page": 5
          },
          {
            "x": 411,
            "y": 193,
            "page": 5
          }
        ]
      },
      {
        "id": 49,
        "texto": "Me explican claramente los cambios que ocurren en mi trabajo",
        "coords": [
          {
            "x": 277,
            "y": 174,
            "page": 5
          },
          {
            "x": 312,
            "y": 173,
            "page": 5
          },
          {
            "x": 343,
            "y": 173,
            "page": 5
          },
          {
            "x": 380,
            "y": 175,
            "page": 5
          },
          {
            "x": 410,
            "y": 174,
            "page": 5
          }
        ]
      },
      {
        "id": 50,
        "texto": "Puedo dar sugerencias sobre los cambios que ocurren en mi trabajo",
        "coords": [
          {
            "x": 276,
            "y": 151,
            "page": 5
          },
          {
            "x": 312,
            "y": 149,
            "page": 5
          },
          {
            "x": 343,
            "y": 150,
            "page": 5
          },
          {
            "x": 376,
            "y": 149,
            "page": 5
          },
          {
            "x": 408,
            "y": 150,
            "page": 5
          }
        ]
      },
      {
        "id": 51,
        "texto": "Cuando se presentan cambios en mi trabajo se tienen en cuenta mis ideas y sugerencias",
        "coords": [
          {
            "x": 279,
            "y": 125,
            "page": 5
          },
          {
            "x": 307,
            "y": 121,
            "page": 5
          },
          {
            "x": 344,
            "y": 120,
            "page": 5
          },
          {
            "x": 380,
            "y": 120,
            "page": 5
          },
          {
            "x": 410,
            "y": 121,
            "page": 5
          }
        ]
      },
      {
        "id": 52,
        "texto": "Los cambios que se presentan en mi trabajo dificultan mi labor",
        "coords": [
          {
            "x": 279,
            "y": 93,
            "page": 5
          },
          {
            "x": 313,
            "y": 93,
            "page": 5
          },
          {
            "x": 345,
            "y": 93,
            "page": 5
          },
          {
            "x": 377,
            "y": 94,
            "page": 5
          },
          {
            "x": 409,
            "y": 95,
            "page": 5
          }
        ]
      }
    ]
  },
  {
    "key": "informacion_empresa",
    "titulo": "Información de la Empresa",
    "instruccion": "Las siguientes preguntas están relacionadas con la información que la empresa le ha dado sobre su trabajo.",
    "preguntas": [
      {
        "id": 53,
        "texto": "Me informan con claridad cuáles son mis funciones",
        "coords": [
          {
            "x": 273,
            "y": 465,
            "page": 6
          },
          {
            "x": 307,
            "y": 463,
            "page": 6
          },
          {
            "x": 344,
            "y": 463,
            "page": 6
          },
          {
            "x": 378,
            "y": 463,
            "page": 6
          },
          {
            "x": 408,
            "y": 465,
            "page": 6
          }
        ]
      },
      {
        "id": 54,
        "texto": "Me informan cuáles son las decisiones que puedo tomar en mi trabajo",
        "coords": [
          {
            "x": 277,
            "y": 441,
            "page": 6
          },
          {
            "x": 304,
            "y": 438,
            "page": 6
          },
          {
            "x": 341,
            "y": 443,
            "page": 6
          },
          {
            "x": 379,
            "y": 442,
            "page": 6
          },
          {
            "x": 409,
            "y": 441,
            "page": 6
          }
        ]
      },
      {
        "id": 55,
        "texto": "Me explican claramente los resultados que debo lograr en mi trabajo",
        "coords": [
          {
            "x": 277,
            "y": 418,
            "page": 6
          },
          {
            "x": 305,
            "y": 417,
            "page": 6
          },
          {
            "x": 347,
            "y": 419,
            "page": 6
          },
          {
            "x": 382,
            "y": 416,
            "page": 6
          },
          {
            "x": 409,
            "y": 418,
            "page": 6
          }
        ]
      },
      {
        "id": 56,
        "texto": "Me explican claramente el efecto de mi trabajo en la empresa",
        "coords": [
          {
            "x": 271,
            "y": 393,
            "page": 6
          },
          {
            "x": 307,
            "y": 395,
            "page": 6
          },
          {
            "x": 341,
            "y": 393,
            "page": 6
          },
          {
            "x": 377,
            "y": 393,
            "page": 6
          },
          {
            "x": 410,
            "y": 395,
            "page": 6
          }
        ]
      },
      {
        "id": 57,
        "texto": "Me explican claramente los objetivos de mi trabajo",
        "coords": [
          {
            "x": 271,
            "y": 373,
            "page": 6
          },
          {
            "x": 303,
            "y": 371,
            "page": 6
          },
          {
            "x": 341,
            "y": 371,
            "page": 6
          },
          {
            "x": 378,
            "y": 370,
            "page": 6
          },
          {
            "x": 413,
            "y": 371,
            "page": 6
          }
        ]
      },
      {
        "id": 58,
        "texto": "Me informan claramente quién me puede orientar para hacer mi trabajo",
        "coords": [
          {
            "x": 275,
            "y": 348,
            "page": 6
          },
          {
            "x": 305,
            "y": 347,
            "page": 6
          },
          {
            "x": 343,
            "y": 345,
            "page": 6
          },
          {
            "x": 381,
            "y": 347,
            "page": 6
          },
          {
            "x": 409,
            "y": 347,
            "page": 6
          }
        ]
      },
      {
        "id": 59,
        "texto": "Me informan claramente con quién puedo resolver los asuntos de trabajo",
        "coords": [
          {
            "x": 272,
            "y": 324,
            "page": 6
          },
          {
            "x": 307,
            "y": 325,
            "page": 6
          },
          {
            "x": 344,
            "y": 325,
            "page": 6
          },
          {
            "x": 379,
            "y": 325,
            "page": 6
          },
          {
            "x": 414,
            "y": 323,
            "page": 6
          }
        ]
      }
    ]
  },
  {
    "key": "formacion_capacitacion",
    "titulo": "Formación y Capacitación",
    "instruccion": "Las siguientes preguntas están relacionadas con la formación y capacitación que la empresa le facilita para hacer su trabajo.",
    "preguntas": [
      {
        "id": 60,
        "texto": "La empresa me permite asistir a capacitaciones relacionadas con mi trabajo",
        "coords": [
          {
            "x": 279,
            "y": 216,
            "page": 6
          },
          {
            "x": 307,
            "y": 213,
            "page": 6
          },
          {
            "x": 343,
            "y": 213,
            "page": 6
          },
          {
            "x": 375,
            "y": 212,
            "page": 6
          },
          {
            "x": 405,
            "y": 214,
            "page": 6
          }
        ]
      },
      {
        "id": 61,
        "texto": "Recibo capacitación útil para hacer mi trabajo",
        "coords": [
          {
            "x": 281,
            "y": 183,
            "page": 6
          },
          {
            "x": 312,
            "y": 187,
            "page": 6
          },
          {
            "x": 345,
            "y": 187,
            "page": 6
          },
          {
            "x": 376,
            "y": 188,
            "page": 6
          },
          {
            "x": 411,
            "y": 186,
            "page": 6
          }
        ]
      },
      {
        "id": 62,
        "texto": "Recibo capacitación que me ayuda a hacer mejor mi trabajo",
        "coords": [
          {
            "x": 278,
            "y": 163,
            "page": 6
          },
          {
            "x": 311,
            "y": 165,
            "page": 6
          },
          {
            "x": 344,
            "y": 163,
            "page": 6
          },
          {
            "x": 379,
            "y": 165,
            "page": 6
          },
          {
            "x": 413,
            "y": 165,
            "page": 6
          }
        ]
      }
    ]
  },
  {
    "key": "jefes",
    "titulo": "Relación con Jefes",
    "instruccion": "Las siguientes preguntas están relacionadas con el o los jefes con quien tenga más contacto.",
    "preguntas": [
      {
        "id": 63,
        "texto": "Mi jefe me da instrucciones claras",
        "coords": [
          {
            "x": 268,
            "y": 471,
            "page": 7
          },
          {
            "x": 305,
            "y": 473,
            "page": 7
          },
          {
            "x": 339,
            "y": 471,
            "page": 7
          },
          {
            "x": 383,
            "y": 470,
            "page": 7
          },
          {
            "x": 411,
            "y": 471,
            "page": 7
          }
        ]
      },
      {
        "id": 64,
        "texto": "Mi jefe ayuda a organizar mejor el trabajo",
        "coords": [
          {
            "x": 271,
            "y": 454,
            "page": 7
          },
          {
            "x": 306,
            "y": 451,
            "page": 7
          },
          {
            "x": 339,
            "y": 454,
            "page": 7
          },
          {
            "x": 376,
            "y": 455,
            "page": 7
          },
          {
            "x": 410,
            "y": 455,
            "page": 7
          }
        ]
      },
      {
        "id": 65,
        "texto": "Mi jefe tiene en cuenta mis puntos de vista y opiniones",
        "coords": [
          {
            "x": 275,
            "y": 433,
            "page": 7
          },
          {
            "x": 303,
            "y": 432,
            "page": 7
          },
          {
            "x": 343,
            "y": 430,
            "page": 7
          },
          {
            "x": 385,
            "y": 431,
            "page": 7
          },
          {
            "x": 414,
            "y": 434,
            "page": 7
          }
        ]
      },
      {
        "id": 66,
        "texto": "Mi jefe me anima para hacer mejor mi trabajo",
        "coords": [
          {
            "x": 275,
            "y": 409,
            "page": 7
          },
          {
            "x": 307,
            "y": 409,
            "page": 7
          },
          {
            "x": 343,
            "y": 410,
            "page": 7
          },
          {
            "x": 377,
            "y": 410,
            "page": 7
          },
          {
            "x": 417,
            "y": 411,
            "page": 7
          }
        ]
      },
      {
        "id": 67,
        "texto": "Mi jefe distribuye las tareas de forma que me facilita el trabajo",
        "coords": [
          {
            "x": 274,
            "y": 387,
            "page": 7
          },
          {
            "x": 304,
            "y": 387,
            "page": 7
          },
          {
            "x": 342,
            "y": 387,
            "page": 7
          },
          {
            "x": 384,
            "y": 390,
            "page": 7
          },
          {
            "x": 415,
            "y": 389,
            "page": 7
          }
        ]
      },
      {
        "id": 68,
        "texto": "Mi jefe me comunica a tiempo la información relacionada con el trabajo",
        "coords": [
          {
            "x": 275,
            "y": 363,
            "page": 7
          },
          {
            "x": 309,
            "y": 365,
            "page": 7
          },
          {
            "x": 340,
            "y": 364,
            "page": 7
          },
          {
            "x": 378,
            "y": 363,
            "page": 7
          },
          {
            "x": 412,
            "y": 364,
            "page": 7
          }
        ]
      },
      {
        "id": 69,
        "texto": "La orientación que me da mi jefe me ayuda a hacer mejor el trabajo",
        "coords": [
          {
            "x": 269,
            "y": 338,
            "page": 7
          },
          {
            "x": 303,
            "y": 342,
            "page": 7
          },
          {
            "x": 344,
            "y": 340,
            "page": 7
          },
          {
            "x": 380,
            "y": 339,
            "page": 7
          },
          {
            "x": 413,
            "y": 339,
            "page": 7
          }
        ]
      },
      {
        "id": 70,
        "texto": "Mi jefe me ayuda a progresar en el trabajo",
        "coords": [
          {
            "x": 279,
            "y": 321,
            "page": 7
          },
          {
            "x": 307,
            "y": 320,
            "page": 7
          },
          {
            "x": 345,
            "y": 323,
            "page": 7
          },
          {
            "x": 377,
            "y": 322,
            "page": 7
          },
          {
            "x": 412,
            "y": 323,
            "page": 7
          }
        ]
      },
      {
        "id": 71,
        "texto": "Mi jefe me ayuda a sentirme bien en el trabajo",
        "coords": [
          {
            "x": 273,
            "y": 301,
            "page": 7
          },
          {
            "x": 307,
            "y": 303,
            "page": 7
          },
          {
            "x": 341,
            "y": 301,
            "page": 7
          },
          {
            "x": 377,
            "y": 305,
            "page": 7
          },
          {
            "x": 412,
            "y": 303,
            "page": 7
          }
        ]
      },
      {
        "id": 72,
        "texto": "Mi jefe ayuda a solucionar los problemas que se presentan en el trabajo",
        "coords": [
          {
            "x": 271,
            "y": 283,
            "page": 7
          },
          {
            "x": 303,
            "y": 279,
            "page": 7
          },
          {
            "x": 343,
            "y": 277,
            "page": 7
          },
          {
            "x": 377,
            "y": 280,
            "page": 7
          },
          {
            "x": 411,
            "y": 279,
            "page": 7
          }
        ]
      },
      {
        "id": 73,
        "texto": "Siento que puedo confiar en mi jefe",
        "coords": [
          {
            "x": 268,
            "y": 259,
            "page": 7
          },
          {
            "x": 307,
            "y": 259,
            "page": 7
          },
          {
            "x": 340,
            "y": 259,
            "page": 7
          },
          {
            "x": 381,
            "y": 259,
            "page": 7
          },
          {
            "x": 411,
            "y": 259,
            "page": 7
          }
        ]
      },
      {
        "id": 74,
        "texto": "Mi jefe me escucha cuando tengo problemas de trabajo",
        "coords": [
          {
            "x": 278,
            "y": 240,
            "page": 7
          },
          {
            "x": 305,
            "y": 235,
            "page": 7
          },
          {
            "x": 343,
            "y": 240,
            "page": 7
          },
          {
            "x": 381,
            "y": 238,
            "page": 7
          },
          {
            "x": 412,
            "y": 237,
            "page": 7
          }
        ]
      },
      {
        "id": 75,
        "texto": "Mi jefe me brinda su apoyo cuando lo necesito",
        "coords": [
          {
            "x": 271,
            "y": 215,
            "page": 7
          },
          {
            "x": 308,
            "y": 217,
            "page": 7
          },
          {
            "x": 343,
            "y": 213,
            "page": 7
          },
          {
            "x": 381,
            "y": 215,
            "page": 7
          },
          {
            "x": 411,
            "y": 214,
            "page": 7
          }
        ]
      }
    ]
  },
  {
    "key": "relaciones_apoyo",
    "titulo": "Relaciones y Apoyo",
    "instruccion": "Las siguientes preguntas indagan sobre las relaciones con otras personas y el apoyo entre las personas de su trabajo.",
    "preguntas": [
      {
        "id": 76,
        "texto": "Me agrada el ambiente de mi grupo de trabajo",
        "coords": [
          {
            "x": 271,
            "y": 476,
            "page": 8
          },
          {
            "x": 298,
            "y": 476,
            "page": 8
          },
          {
            "x": 336,
            "y": 477,
            "page": 8
          },
          {
            "x": 373,
            "y": 475,
            "page": 8
          },
          {
            "x": 406,
            "y": 477,
            "page": 8
          }
        ]
      },
      {
        "id": 77,
        "texto": "En mi grupo de trabajo me tratan de forma respetuosa",
        "coords": [
          {
            "x": 270,
            "y": 455,
            "page": 8
          },
          {
            "x": 303,
            "y": 455,
            "page": 8
          },
          {
            "x": 339,
            "y": 455,
            "page": 8
          },
          {
            "x": 375,
            "y": 455,
            "page": 8
          },
          {
            "x": 407,
            "y": 455,
            "page": 8
          }
        ]
      },
      {
        "id": 78,
        "texto": "Siento que puedo confiar en mis compañeros de trabajo",
        "coords": [
          {
            "x": 271,
            "y": 433,
            "page": 8
          },
          {
            "x": 301,
            "y": 432,
            "page": 8
          },
          {
            "x": 339,
            "y": 435,
            "page": 8
          },
          {
            "x": 372,
            "y": 433,
            "page": 8
          },
          {
            "x": 405,
            "y": 432,
            "page": 8
          }
        ]
      },
      {
        "id": 79,
        "texto": "Me siento a gusto con mis compañeros de trabajo",
        "coords": [
          {
            "x": 273,
            "y": 411,
            "page": 8
          },
          {
            "x": 303,
            "y": 411,
            "page": 8
          },
          {
            "x": 337,
            "y": 409,
            "page": 8
          },
          {
            "x": 375,
            "y": 410,
            "page": 8
          },
          {
            "x": 407,
            "y": 411,
            "page": 8
          }
        ]
      },
      {
        "id": 80,
        "texto": "En mi grupo de trabajo algunas personas me maltratan",
        "coords": [
          {
            "x": 269,
            "y": 391,
            "page": 8
          },
          {
            "x": 303,
            "y": 390,
            "page": 8
          },
          {
            "x": 338,
            "y": 391,
            "page": 8
          },
          {
            "x": 371,
            "y": 391,
            "page": 8
          },
          {
            "x": 409,
            "y": 389,
            "page": 8
          }
        ]
      },
      {
        "id": 81,
        "texto": "Entre compañeros solucionamos los problemas de forma respetuosa",
        "coords": [
          {
            "x": 270,
            "y": 365,
            "page": 8
          },
          {
            "x": 304,
            "y": 366,
            "page": 8
          },
          {
            "x": 339,
            "y": 367,
            "page": 8
          },
          {
            "x": 376,
            "y": 369,
            "page": 8
          },
          {
            "x": 404,
            "y": 369,
            "page": 8
          }
        ]
      },
      {
        "id": 82,
        "texto": "Hay integración en mi grupo de trabajo",
        "coords": [
          {
            "x": 268,
            "y": 348,
            "page": 8
          },
          {
            "x": 302,
            "y": 347,
            "page": 8
          },
          {
            "x": 338,
            "y": 345,
            "page": 8
          },
          {
            "x": 375,
            "y": 345,
            "page": 8
          },
          {
            "x": 406,
            "y": 347,
            "page": 8
          }
        ]
      },
      {
        "id": 83,
        "texto": "Mi grupo de trabajo es muy unido",
        "coords": [
          {
            "x": 275,
            "y": 322,
            "page": 8
          },
          {
            "x": 305,
            "y": 325,
            "page": 8
          },
          {
            "x": 337,
            "y": 324,
            "page": 8
          },
          {
            "x": 373,
            "y": 324,
            "page": 8
          },
          {
            "x": 403,
            "y": 323,
            "page": 8
          }
        ]
      },
      {
        "id": 84,
        "texto": "Las personas en mi trabajo me hacen sentir parte del grupo",
        "coords": [
          {
            "x": 271,
            "y": 300,
            "page": 8
          },
          {
            "x": 305,
            "y": 302,
            "page": 8
          },
          {
            "x": 339,
            "y": 301,
            "page": 8
          },
          {
            "x": 373,
            "y": 301,
            "page": 8
          },
          {
            "x": 405,
            "y": 303,
            "page": 8
          }
        ]
      },
      {
        "id": 85,
        "texto": "Cuando tenemos que realizar trabajo de grupo los compañeros colaboran",
        "coords": [
          {
            "x": 268,
            "y": 280,
            "page": 8
          },
          {
            "x": 301,
            "y": 279,
            "page": 8
          },
          {
            "x": 338,
            "y": 279,
            "page": 8
          },
          {
            "x": 372,
            "y": 279,
            "page": 8
          },
          {
            "x": 403,
            "y": 279,
            "page": 8
          }
        ]
      },
      {
        "id": 86,
        "texto": "Es fácil poner de acuerdo al grupo para hacer el trabajo",
        "coords": [
          {
            "x": 269,
            "y": 257,
            "page": 8
          },
          {
            "x": 309,
            "y": 258,
            "page": 8
          },
          {
            "x": 337,
            "y": 255,
            "page": 8
          },
          {
            "x": 373,
            "y": 258,
            "page": 8
          },
          {
            "x": 405,
            "y": 261,
            "page": 8
          }
        ]
      },
      {
        "id": 87,
        "texto": "Mis compañeros de trabajo me ayudan cuando tengo dificultades",
        "coords": [
          {
            "x": 272,
            "y": 237,
            "page": 8
          },
          {
            "x": 305,
            "y": 238,
            "page": 8
          },
          {
            "x": 339,
            "y": 235,
            "page": 8
          },
          {
            "x": 376,
            "y": 236,
            "page": 8
          },
          {
            "x": 406,
            "y": 235,
            "page": 8
          }
        ]
      },
      {
        "id": 88,
        "texto": "En mi trabajo las personas nos apoyamos unos a otros",
        "coords": [
          {
            "x": 268,
            "y": 211,
            "page": 8
          },
          {
            "x": 303,
            "y": 213,
            "page": 8
          },
          {
            "x": 341,
            "y": 213,
            "page": 8
          },
          {
            "x": 372,
            "y": 214,
            "page": 8
          },
          {
            "x": 407,
            "y": 214,
            "page": 8
          }
        ]
      },
      {
        "id": 89,
        "texto": "Algunos compañeros de trabajo me escuchan cuando tengo problemas",
        "coords": [
          {
            "x": 267,
            "y": 190,
            "page": 8
          },
          {
            "x": 305,
            "y": 190,
            "page": 8
          },
          {
            "x": 339,
            "y": 191,
            "page": 8
          },
          {
            "x": 375,
            "y": 191,
            "page": 8
          },
          {
            "x": 409,
            "y": 192,
            "page": 8
          }
        ]
      }
    ]
  },
  {
    "key": "rendimiento",
    "titulo": "Rendimiento en el Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con la información que usted recibe sobre su rendimiento en el trabajo.",
    "preguntas": [
      {
        "id": 90,
        "texto": "Me informan sobre lo que hago bien en mi trabajo",
        "coords": [
          {
            "x": 263,
            "y": 473,
            "page": 9
          },
          {
            "x": 296,
            "y": 475,
            "page": 9
          },
          {
            "x": 335,
            "y": 473,
            "page": 9
          },
          {
            "x": 368,
            "y": 475,
            "page": 9
          },
          {
            "x": 399,
            "y": 474,
            "page": 9
          }
        ]
      },
      {
        "id": 91,
        "texto": "Me informan sobre lo que debo mejorar en mi trabajo",
        "coords": [
          {
            "x": 271,
            "y": 451,
            "page": 9
          },
          {
            "x": 297,
            "y": 451,
            "page": 9
          },
          {
            "x": 335,
            "y": 450,
            "page": 9
          },
          {
            "x": 367,
            "y": 451,
            "page": 9
          },
          {
            "x": 399,
            "y": 451,
            "page": 9
          }
        ]
      },
      {
        "id": 92,
        "texto": "La información que recibo sobre mi rendimiento en el trabajo es clara",
        "coords": [
          {
            "x": 264,
            "y": 427,
            "page": 9
          },
          {
            "x": 299,
            "y": 427,
            "page": 9
          },
          {
            "x": 334,
            "y": 427,
            "page": 9
          },
          {
            "x": 365,
            "y": 427,
            "page": 9
          },
          {
            "x": 397,
            "y": 428,
            "page": 9
          }
        ]
      },
      {
        "id": 93,
        "texto": "La forma como evalúan mi trabajo en la empresa me ayuda a mejorar",
        "coords": [
          {
            "x": 267,
            "y": 407,
            "page": 9
          },
          {
            "x": 299,
            "y": 405,
            "page": 9
          },
          {
            "x": 334,
            "y": 403,
            "page": 9
          },
          {
            "x": 369,
            "y": 403,
            "page": 9
          },
          {
            "x": 399,
            "y": 403,
            "page": 9
          }
        ]
      },
      {
        "id": 94,
        "texto": "Me informan a tiempo sobre lo que debo mejorar en el trabajo",
        "coords": [
          {
            "x": 264,
            "y": 382,
            "page": 9
          },
          {
            "x": 301,
            "y": 379,
            "page": 9
          },
          {
            "x": 332,
            "y": 381,
            "page": 9
          },
          {
            "x": 364,
            "y": 383,
            "page": 9
          },
          {
            "x": 399,
            "y": 383,
            "page": 9
          }
        ]
      }
    ]
  },
  {
    "key": "satisfaccion_seguridad",
    "titulo": "Satisfacción y Seguridad",
    "instruccion": "Las siguientes preguntas están relacionadas con la satisfacción, reconocimiento y la seguridad que le ofrece su trabajo.",
    "preguntas": [
      {
        "id": 95,
        "texto": "En la empresa confían en mi trabajo",
        "coords": [
          {
            "x": 273,
            "y": 313,
            "page": 9
          },
          {
            "x": 301,
            "y": 311,
            "page": 9
          },
          {
            "x": 333,
            "y": 310,
            "page": 9
          },
          {
            "x": 369,
            "y": 312,
            "page": 9
          },
          {
            "x": 399,
            "y": 311,
            "page": 9
          }
        ]
      },
      {
        "id": 96,
        "texto": "En la empresa me pagan a tiempo mi salario",
        "coords": [
          {
            "x": 273,
            "y": 292,
            "page": 9
          },
          {
            "x": 301,
            "y": 289,
            "page": 9
          },
          {
            "x": 334,
            "y": 292,
            "page": 9
          },
          {
            "x": 367,
            "y": 291,
            "page": 9
          },
          {
            "x": 400,
            "y": 292,
            "page": 9
          }
        ]
      },
      {
        "id": 97,
        "texto": "El pago que recibo es el que me ofreció la empresa",
        "coords": [
          {
            "x": 269,
            "y": 267,
            "page": 9
          },
          {
            "x": 301,
            "y": 269,
            "page": 9
          },
          {
            "x": 333,
            "y": 268,
            "page": 9
          },
          {
            "x": 365,
            "y": 267,
            "page": 9
          },
          {
            "x": 396,
            "y": 267,
            "page": 9
          }
        ]
      },
      {
        "id": 98,
        "texto": "El pago que recibo es el que merezco por el trabajo que realizo",
        "coords": [
          {
            "x": 272,
            "y": 249,
            "page": 9
          },
          {
            "x": 302,
            "y": 245,
            "page": 9
          },
          {
            "x": 333,
            "y": 246,
            "page": 9
          },
          {
            "x": 369,
            "y": 247,
            "page": 9
          },
          {
            "x": 401,
            "y": 244,
            "page": 9
          }
        ]
      },
      {
        "id": 99,
        "texto": "En mi trabajo tengo posibilidades de progresar",
        "coords": [
          {
            "x": 272,
            "y": 222,
            "page": 9
          },
          {
            "x": 299,
            "y": 223,
            "page": 9
          },
          {
            "x": 335,
            "y": 225,
            "page": 9
          },
          {
            "x": 365,
            "y": 225,
            "page": 9
          },
          {
            "x": 398,
            "y": 223,
            "page": 9
          }
        ]
      },
      {
        "id": 100,
        "texto": "Las personas que hacen bien el trabajo pueden progresar en la empresa",
        "coords": [
          {
            "x": 273,
            "y": 199,
            "page": 9
          },
          {
            "x": 301,
            "y": 201,
            "page": 9
          },
          {
            "x": 339,
            "y": 200,
            "page": 9
          },
          {
            "x": 367,
            "y": 199,
            "page": 9
          },
          {
            "x": 398,
            "y": 203,
            "page": 9
          }
        ]
      },
      {
        "id": 101,
        "texto": "La empresa se preocupa por el bienestar de los trabajadores",
        "coords": [
          {
            "x": 269,
            "y": 180,
            "page": 9
          },
          {
            "x": 302,
            "y": 179,
            "page": 9
          },
          {
            "x": 335,
            "y": 179,
            "page": 9
          },
          {
            "x": 365,
            "y": 180,
            "page": 9
          },
          {
            "x": 399,
            "y": 179,
            "page": 9
          }
        ]
      },
      {
        "id": 102,
        "texto": "Mi trabajo en la empresa es estable",
        "coords": [
          {
            "x": 271,
            "y": 159,
            "page": 9
          },
          {
            "x": 300,
            "y": 159,
            "page": 9
          },
          {
            "x": 332,
            "y": 159,
            "page": 9
          },
          {
            "x": 369,
            "y": 160,
            "page": 9
          },
          {
            "x": 395,
            "y": 160,
            "page": 9
          }
        ]
      },
      {
        "id": 103,
        "texto": "El trabajo que hago me hace sentir bien",
        "coords": [
          {
            "x": 272,
            "y": 141,
            "page": 9
          },
          {
            "x": 302,
            "y": 141,
            "page": 9
          },
          {
            "x": 333,
            "y": 141,
            "page": 9
          },
          {
            "x": 368,
            "y": 143,
            "page": 9
          },
          {
            "x": 400,
            "y": 144,
            "page": 9
          }
        ]
      },
      {
        "id": 104,
        "texto": "Siento orgullo de trabajar en esta empresa",
        "coords": [
          {
            "x": 273,
            "y": 125,
            "page": 9
          },
          {
            "x": 302,
            "y": 121,
            "page": 9
          },
          {
            "x": 333,
            "y": 122,
            "page": 9
          },
          {
            "x": 369,
            "y": 122,
            "page": 9
          },
          {
            "x": 395,
            "y": 121,
            "page": 9
          }
        ]
      },
      {
        "id": 105,
        "texto": "Hablo bien de la empresa con otras personas",
        "coords": [
          {
            "x": 266,
            "y": 102,
            "page": 9
          },
          {
            "x": 300,
            "y": 101,
            "page": 9
          },
          {
            "x": 335,
            "y": 99,
            "page": 9
          },
          {
            "x": 367,
            "y": 101,
            "page": 9
          },
          {
            "x": 399,
            "y": 101,
            "page": 9
          }
        ]
      }
    ]
  },
  {
    "key": "clientes_usuarios",
    "titulo": "Servicio a Clientes o Usuarios",
    "instruccion": "Las siguientes preguntas están relacionadas con el servicio que usted brinda a clientes o usuarios.",
    "filtro": "En mi trabajo debo brindar servicio a clientes o usuarios",
    "preguntas": [
      {
        "id": 106,
        "texto": "Atiendo clientes o usuarios muy enojados",
        "coords": [
          {
            "x": 263,
            "y": 411,
            "page": 10
          },
          {
            "x": 299,
            "y": 409,
            "page": 10
          },
          {
            "x": 331,
            "y": 410,
            "page": 10
          },
          {
            "x": 365,
            "y": 406,
            "page": 10
          },
          {
            "x": 393,
            "y": 407,
            "page": 10
          }
        ]
      },
      {
        "id": 107,
        "texto": "Atiendo clientes o usuarios muy preocupados",
        "coords": [
          {
            "x": 266,
            "y": 385,
            "page": 10
          },
          {
            "x": 298,
            "y": 386,
            "page": 10
          },
          {
            "x": 330,
            "y": 387,
            "page": 10
          },
          {
            "x": 363,
            "y": 386,
            "page": 10
          },
          {
            "x": 393,
            "y": 385,
            "page": 10
          }
        ]
      },
      {
        "id": 108,
        "texto": "Atiendo clientes o usuarios muy tristes",
        "coords": [
          {
            "x": 266,
            "y": 365,
            "page": 10
          },
          {
            "x": 297,
            "y": 365,
            "page": 10
          },
          {
            "x": 327,
            "y": 368,
            "page": 10
          },
          {
            "x": 362,
            "y": 367,
            "page": 10
          },
          {
            "x": 391,
            "y": 367,
            "page": 10
          }
        ]
      },
      {
        "id": 109,
        "texto": "Mi trabajo me exige atender personas muy enfermas",
        "coords": [
          {
            "x": 262,
            "y": 348,
            "page": 10
          },
          {
            "x": 295,
            "y": 345,
            "page": 10
          },
          {
            "x": 331,
            "y": 346,
            "page": 10
          },
          {
            "x": 366,
            "y": 347,
            "page": 10
          },
          {
            "x": 393,
            "y": 347,
            "page": 10
          }
        ]
      },
      {
        "id": 110,
        "texto": "Mi trabajo me exige atender personas muy necesitadas de ayuda",
        "coords": [
          {
            "x": 269,
            "y": 327,
            "page": 10
          },
          {
            "x": 294,
            "y": 324,
            "page": 10
          },
          {
            "x": 331,
            "y": 325,
            "page": 10
          },
          {
            "x": 363,
            "y": 326,
            "page": 10
          },
          {
            "x": 393,
            "y": 324,
            "page": 10
          }
        ]
      },
      {
        "id": 111,
        "texto": "Atiendo clientes o usuarios que me maltratan",
        "coords": [
          {
            "x": 275,
            "y": 308,
            "page": 10
          },
          {
            "x": 297,
            "y": 306,
            "page": 10
          },
          {
            "x": 326,
            "y": 305,
            "page": 10
          },
          {
            "x": 363,
            "y": 305,
            "page": 10
          },
          {
            "x": 395,
            "y": 306,
            "page": 10
          }
        ]
      },
      {
        "id": 112,
        "texto": "Para hacer mi trabajo debo demostrar sentimientos distintos a los míos",
        "coords": [
          {
            "x": 269,
            "y": 286,
            "page": 10
          },
          {
            "x": 296,
            "y": 285,
            "page": 10
          },
          {
            "x": 328,
            "y": 286,
            "page": 10
          },
          {
            "x": 361,
            "y": 285,
            "page": 10
          },
          {
            "x": 391,
            "y": 287,
            "page": 10
          }
        ]
      },
      {
        "id": 113,
        "texto": "Mi trabajo me exige atender situaciones de violencia",
        "coords": [
          {
            "x": 265,
            "y": 266,
            "page": 10
          },
          {
            "x": 292,
            "y": 264,
            "page": 10
          },
          {
            "x": 329,
            "y": 263,
            "page": 10
          },
          {
            "x": 365,
            "y": 264,
            "page": 10
          },
          {
            "x": 399,
            "y": 263,
            "page": 10
          }
        ]
      },
      {
        "id": 114,
        "texto": "Mi trabajo me exige atender situaciones muy tristes o dolorosas",
        "coords": [
          {
            "x": 267,
            "y": 239,
            "page": 10
          },
          {
            "x": 296,
            "y": 239,
            "page": 10
          },
          {
            "x": 329,
            "y": 237,
            "page": 10
          },
          {
            "x": 361,
            "y": 239,
            "page": 10
          },
          {
            "x": 393,
            "y": 242,
            "page": 10
          }
        ]
      }
    ]
  },
  {
    "key": "jefatura",
    "titulo": "Supervisión y Dirección de Personas",
    "instruccion": "Las siguientes preguntas están relacionadas con las personas que usted supervisa o dirige.",
    "filtro": "Soy jefe de otras personas en mi trabajo",
    "preguntas": [
      {
        "id": 115,
        "texto": "Tengo colaboradores que comunican tarde los asuntos de trabajo",
        "coords": [
          {
            "x": 259,
            "y": 399,
            "page": 11
          },
          {
            "x": 294,
            "y": 393,
            "page": 11
          },
          {
            "x": 323,
            "y": 396,
            "page": 11
          },
          {
            "x": 359,
            "y": 393,
            "page": 11
          },
          {
            "x": 394,
            "y": 395,
            "page": 11
          }
        ]
      },
      {
        "id": 116,
        "texto": "Tengo colaboradores que tienen comportamientos irrespetuosos",
        "coords": [
          {
            "x": 261,
            "y": 375,
            "page": 11
          },
          {
            "x": 289,
            "y": 372,
            "page": 11
          },
          {
            "x": 327,
            "y": 373,
            "page": 11
          },
          {
            "x": 358,
            "y": 373,
            "page": 11
          },
          {
            "x": 392,
            "y": 372,
            "page": 11
          }
        ]
      },
      {
        "id": 117,
        "texto": "Tengo colaboradores que dificultan la organización del trabajo",
        "coords": [
          {
            "x": 262,
            "y": 349,
            "page": 11
          },
          {
            "x": 289,
            "y": 348,
            "page": 11
          },
          {
            "x": 331,
            "y": 354,
            "page": 11
          },
          {
            "x": 360,
            "y": 352,
            "page": 11
          },
          {
            "x": 393,
            "y": 351,
            "page": 11
          }
        ]
      },
      {
        "id": 118,
        "texto": "Tengo colaboradores que guardan silencio cuando les piden opiniones",
        "coords": [
          {
            "x": 263,
            "y": 329,
            "page": 11
          },
          {
            "x": 291,
            "y": 331,
            "page": 11
          },
          {
            "x": 321,
            "y": 329,
            "page": 11
          },
          {
            "x": 359,
            "y": 328,
            "page": 11
          },
          {
            "x": 392,
            "y": 330,
            "page": 11
          }
        ]
      },
      {
        "id": 119,
        "texto": "Tengo colaboradores que dificultan el logro de los resultados del trabajo",
        "coords": [
          {
            "x": 265,
            "y": 311,
            "page": 11
          },
          {
            "x": 288,
            "y": 309,
            "page": 11
          },
          {
            "x": 319,
            "y": 306,
            "page": 11
          },
          {
            "x": 358,
            "y": 305,
            "page": 11
          },
          {
            "x": 391,
            "y": 307,
            "page": 11
          }
        ]
      },
      {
        "id": 120,
        "texto": "Tengo colaboradores que expresan de forma irrespetuosa sus desacuerdos",
        "coords": [
          {
            "x": 261,
            "y": 285,
            "page": 11
          },
          {
            "x": 292,
            "y": 285,
            "page": 11
          },
          {
            "x": 323,
            "y": 285,
            "page": 11
          },
          {
            "x": 360,
            "y": 288,
            "page": 11
          },
          {
            "x": 393,
            "y": 284,
            "page": 11
          }
        ]
      },
      {
        "id": 121,
        "texto": "Tengo colaboradores que cooperan poco cuando se necesita",
        "coords": [
          {
            "x": 263,
            "y": 264,
            "page": 11
          },
          {
            "x": 292,
            "y": 263,
            "page": 11
          },
          {
            "x": 323,
            "y": 261,
            "page": 11
          },
          {
            "x": 359,
            "y": 261,
            "page": 11
          },
          {
            "x": 395,
            "y": 263,
            "page": 11
          }
        ]
      },
      {
        "id": 122,
        "texto": "Tengo colaboradores que me preocupan por su desempeño",
        "coords": [
          {
            "x": 265,
            "y": 239,
            "page": 11
          },
          {
            "x": 293,
            "y": 238,
            "page": 11
          },
          {
            "x": 334,
            "y": 240,
            "page": 11
          },
          {
            "x": 355,
            "y": 242,
            "page": 11
          },
          {
            "x": 390,
            "y": 241,
            "page": 11
          }
        ]
      },
      {
        "id": 123,
        "texto": "Tengo colaboradores que ignoran las sugerencias para mejorar su trabajo",
        "coords": [
          {
            "x": 273,
            "y": 221,
            "page": 11
          },
          {
            "x": 293,
            "y": 219,
            "page": 11
          },
          {
            "x": 331,
            "y": 216,
            "page": 11
          },
          {
            "x": 363,
            "y": 218,
            "page": 11
          },
          {
            "x": 395,
            "y": 217,
            "page": 11
          }
        ]
      }
    ]
  }
];

// FORMA B sections
export const formaBSections: SurveySection[] = [
  {
    "key": "condiciones_ambientales",
    "titulo": "Condiciones Ambientales del Lugar de Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con las condiciones ambientales del(los) sitio(s) o lugar(es) donde habitualmente realiza su trabajo.",
    "preguntas": [
      {
        "id": 1,
        "texto": "El ruido en el lugar donde trabajo es molesto",
        "coords": [
          {
            "x": 278,
            "y": 472,
            "page": 2
          },
          {
            "x": 313,
            "y": 470,
            "page": 2
          },
          {
            "x": 341,
            "y": 469,
            "page": 2
          },
          {
            "x": 379,
            "y": 469,
            "page": 2
          },
          {
            "x": 411,
            "y": 469,
            "page": 2
          }
        ]
      },
      {
        "id": 2,
        "texto": "En el lugar donde trabajo hace mucho frío",
        "coords": [
          {
            "x": 283,
            "y": 451,
            "page": 2
          },
          {
            "x": 311,
            "y": 451,
            "page": 2
          },
          {
            "x": 355,
            "y": 450,
            "page": 2
          },
          {
            "x": 371,
            "y": 452,
            "page": 2
          },
          {
            "x": 406,
            "y": 451,
            "page": 2
          }
        ]
      },
      {
        "id": 3,
        "texto": "En el lugar donde trabajo hace mucho calor",
        "coords": [
          {
            "x": 277,
            "y": 430,
            "page": 2
          },
          {
            "x": 309,
            "y": 429,
            "page": 2
          },
          {
            "x": 340,
            "y": 429,
            "page": 2
          },
          {
            "x": 381,
            "y": 428,
            "page": 2
          },
          {
            "x": 413,
            "y": 428,
            "page": 2
          }
        ]
      },
      {
        "id": 4,
        "texto": "El aire en el lugar donde trabajo es fresco y agradable",
        "coords": [
          {
            "x": 275,
            "y": 403,
            "page": 2
          },
          {
            "x": 310,
            "y": 402,
            "page": 2
          },
          {
            "x": 337,
            "y": 403,
            "page": 2
          },
          {
            "x": 374,
            "y": 403,
            "page": 2
          },
          {
            "x": 417,
            "y": 403,
            "page": 2
          }
        ]
      },
      {
        "id": 5,
        "texto": "La luz del sitio donde trabajo es agradable",
        "coords": [
          {
            "x": 275,
            "y": 383,
            "page": 2
          },
          {
            "x": 311,
            "y": 382,
            "page": 2
          },
          {
            "x": 340,
            "y": 381,
            "page": 2
          },
          {
            "x": 380,
            "y": 382,
            "page": 2
          },
          {
            "x": 411,
            "y": 380,
            "page": 2
          }
        ]
      },
      {
        "id": 6,
        "texto": "El espacio donde trabajo es cómodo",
        "coords": [
          {
            "x": 276,
            "y": 363,
            "page": 2
          },
          {
            "x": 303,
            "y": 363,
            "page": 2
          },
          {
            "x": 334,
            "y": 362,
            "page": 2
          },
          {
            "x": 377,
            "y": 362,
            "page": 2
          },
          {
            "x": 407,
            "y": 361,
            "page": 2
          }
        ]
      },
      {
        "id": 7,
        "texto": "En mi trabajo me preocupa estar expuesto a sustancias químicas que afecten mi salud",
        "coords": [
          {
            "x": 271,
            "y": 337,
            "page": 2
          },
          {
            "x": 308,
            "y": 337,
            "page": 2
          },
          {
            "x": 335,
            "y": 337,
            "page": 2
          },
          {
            "x": 378,
            "y": 337,
            "page": 2
          },
          {
            "x": 413,
            "y": 336,
            "page": 2
          }
        ]
      },
      {
        "id": 8,
        "texto": "Mi trabajo me exige hacer mucho esfuerzo físico",
        "coords": [
          {
            "x": 273,
            "y": 307,
            "page": 2
          },
          {
            "x": 311,
            "y": 309,
            "page": 2
          },
          {
            "x": 346,
            "y": 309,
            "page": 2
          },
          {
            "x": 380,
            "y": 308,
            "page": 2
          },
          {
            "x": 410,
            "y": 307,
            "page": 2
          }
        ]
      },
      {
        "id": 9,
        "texto": "Los equipos o herramientas con los que trabajo son cómodos",
        "coords": [
          {
            "x": 280,
            "y": 283,
            "page": 2
          },
          {
            "x": 305,
            "y": 283,
            "page": 2
          },
          {
            "x": 345,
            "y": 282,
            "page": 2
          },
          {
            "x": 373,
            "y": 283,
            "page": 2
          },
          {
            "x": 415,
            "y": 281,
            "page": 2
          }
        ]
      },
      {
        "id": 10,
        "texto": "En mi trabajo me preocupa estar expuesto a microbios, animales o plantas que afecten mi salud",
        "coords": [
          {
            "x": 283,
            "y": 256,
            "page": 2
          },
          {
            "x": 310,
            "y": 255,
            "page": 2
          },
          {
            "x": 346,
            "y": 255,
            "page": 2
          },
          {
            "x": 380,
            "y": 252,
            "page": 2
          },
          {
            "x": 408,
            "y": 252,
            "page": 2
          }
        ]
      },
      {
        "id": 11,
        "texto": "Me preocupa accidentarme en mi trabajo",
        "coords": [
          {
            "x": 278,
            "y": 226,
            "page": 2
          },
          {
            "x": 311,
            "y": 225,
            "page": 2
          },
          {
            "x": 343,
            "y": 225,
            "page": 2
          },
          {
            "x": 378,
            "y": 225,
            "page": 2
          },
          {
            "x": 408,
            "y": 225,
            "page": 2
          }
        ]
      },
      {
        "id": 12,
        "texto": "El lugar donde trabajo es limpio y ordenado",
        "coords": [
          {
            "x": 275,
            "y": 205,
            "page": 2
          },
          {
            "x": 311,
            "y": 205,
            "page": 2
          },
          {
            "x": 343,
            "y": 205,
            "page": 2
          },
          {
            "x": 377,
            "y": 204,
            "page": 2
          },
          {
            "x": 407,
            "y": 203,
            "page": 2
          }
        ]
      }
    ]
  },
  {
    "key": "cantidad_trabajo",
    "titulo": "Cantidad de Trabajo",
    "instruccion": "Para responder a las siguientes preguntas piense en la cantidad de trabajo que usted tiene a cargo.",
    "preguntas": [
      {
        "id": 13,
        "texto": "Por la cantidad de trabajo que tengo debo quedarme tiempo adicional",
        "coords": [
          {
            "x": 274,
            "y": 474,
            "page": 3
          },
          {
            "x": 298,
            "y": 478,
            "page": 3
          },
          {
            "x": 329,
            "y": 476,
            "page": 3
          },
          {
            "x": 361,
            "y": 474,
            "page": 3
          },
          {
            "x": 395,
            "y": 476,
            "page": 3
          }
        ]
      },
      {
        "id": 14,
        "texto": "Me alcanza el tiempo de trabajo para tener al día mis deberes",
        "coords": [
          {
            "x": 270,
            "y": 455,
            "page": 3
          },
          {
            "x": 304,
            "y": 455,
            "page": 3
          },
          {
            "x": 329,
            "y": 456,
            "page": 3
          },
          {
            "x": 365,
            "y": 454,
            "page": 3
          },
          {
            "x": 396,
            "y": 453,
            "page": 3
          }
        ]
      },
      {
        "id": 15,
        "texto": "Por la cantidad de trabajo que tengo debo trabajar sin parar",
        "coords": [
          {
            "x": 273,
            "y": 434,
            "page": 3
          },
          {
            "x": 303,
            "y": 435,
            "page": 3
          },
          {
            "x": 335,
            "y": 432,
            "page": 3
          },
          {
            "x": 363,
            "y": 432,
            "page": 3
          },
          {
            "x": 402,
            "y": 432,
            "page": 3
          }
        ]
      }
    ]
  },
  {
    "key": "esfuerzo_mental",
    "titulo": "Esfuerzo Mental",
    "instruccion": "Las siguientes preguntas están relacionadas con el esfuerzo mental que le exige su trabajo.",
    "preguntas": [
      {
        "id": 16,
        "texto": "Mi trabajo me exige hacer mucho esfuerzo mental",
        "coords": [
          {
            "x": 267,
            "y": 353,
            "page": 3
          },
          {
            "x": 303,
            "y": 352,
            "page": 3
          },
          {
            "x": 327,
            "y": 350,
            "page": 3
          },
          {
            "x": 376,
            "y": 351,
            "page": 3
          },
          {
            "x": 393,
            "y": 351,
            "page": 3
          }
        ]
      },
      {
        "id": 17,
        "texto": "Mi trabajo me exige estar muy concentrado",
        "coords": [
          {
            "x": 268,
            "y": 329,
            "page": 3
          },
          {
            "x": 301,
            "y": 327,
            "page": 3
          },
          {
            "x": 335,
            "y": 329,
            "page": 3
          },
          {
            "x": 361,
            "y": 329,
            "page": 3
          },
          {
            "x": 394,
            "y": 331,
            "page": 3
          }
        ]
      },
      {
        "id": 18,
        "texto": "Mi trabajo me exige memorizar mucha información",
        "coords": [
          {
            "x": 276,
            "y": 312,
            "page": 3
          },
          {
            "x": 304,
            "y": 310,
            "page": 3
          },
          {
            "x": 331,
            "y": 309,
            "page": 3
          },
          {
            "x": 363,
            "y": 308,
            "page": 3
          },
          {
            "x": 396,
            "y": 305,
            "page": 3
          }
        ]
      },
      {
        "id": 19,
        "texto": "En mi trabajo tengo que hacer cálculos matemáticos",
        "coords": [
          {
            "x": 270,
            "y": 285,
            "page": 3
          },
          {
            "x": 303,
            "y": 286,
            "page": 3
          },
          {
            "x": 335,
            "y": 285,
            "page": 3
          },
          {
            "x": 361,
            "y": 285,
            "page": 3
          },
          {
            "x": 394,
            "y": 284,
            "page": 3
          }
        ]
      },
      {
        "id": 20,
        "texto": "Mi trabajo requiere que me fije en pequeños detalles",
        "coords": [
          {
            "x": 270,
            "y": 262,
            "page": 3
          },
          {
            "x": 301,
            "y": 261,
            "page": 3
          },
          {
            "x": 328,
            "y": 263,
            "page": 3
          },
          {
            "x": 360,
            "y": 263,
            "page": 3
          },
          {
            "x": 397,
            "y": 264,
            "page": 3
          }
        ]
      }
    ]
  },
  {
    "key": "jornada_trabajo",
    "titulo": "Jornada de Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con la jornada de trabajo.",
    "preguntas": [
      {
        "id": 21,
        "texto": "Trabajo en horario de noche",
        "coords": [
          {
            "x": 264,
            "y": 182,
            "page": 3
          },
          {
            "x": 298,
            "y": 182,
            "page": 3
          },
          {
            "x": 328,
            "y": 183,
            "page": 3
          },
          {
            "x": 369,
            "y": 183,
            "page": 3
          },
          {
            "x": 392,
            "y": 183,
            "page": 3
          }
        ]
      },
      {
        "id": 22,
        "texto": "En mi trabajo es posible tomar pausas para descansar",
        "coords": [
          {
            "x": 271,
            "y": 162,
            "page": 3
          },
          {
            "x": 299,
            "y": 163,
            "page": 3
          },
          {
            "x": 330,
            "y": 164,
            "page": 3
          },
          {
            "x": 363,
            "y": 164,
            "page": 3
          },
          {
            "x": 397,
            "y": 163,
            "page": 3
          }
        ]
      },
      {
        "id": 23,
        "texto": "Mi trabajo me exige laborar en días de descanso, festivos o fines de semana",
        "coords": [
          {
            "x": 267,
            "y": 493,
            "page": 4
          },
          {
            "x": 295,
            "y": 492,
            "page": 4
          },
          {
            "x": 329,
            "y": 492,
            "page": 4
          },
          {
            "x": 363,
            "y": 491,
            "page": 4
          },
          {
            "x": 400,
            "y": 491,
            "page": 4
          }
        ]
      },
      {
        "id": 24,
        "texto": "En mi trabajo puedo tomar fines de semana o días de descanso al mes",
        "coords": [
          {
            "x": 270,
            "y": 471,
            "page": 4
          },
          {
            "x": 296,
            "y": 469,
            "page": 4
          },
          {
            "x": 331,
            "y": 467,
            "page": 4
          },
          {
            "x": 365,
            "y": 467,
            "page": 4
          },
          {
            "x": 404,
            "y": 467,
            "page": 4
          }
        ]
      },
      {
        "id": 25,
        "texto": "Cuando estoy en casa sigo pensando en el trabajo",
        "coords": [
          {
            "x": 268,
            "y": 442,
            "page": 4
          },
          {
            "x": 301,
            "y": 444,
            "page": 4
          },
          {
            "x": 332,
            "y": 445,
            "page": 4
          },
          {
            "x": 361,
            "y": 445,
            "page": 4
          },
          {
            "x": 395,
            "y": 445,
            "page": 4
          }
        ]
      },
      {
        "id": 26,
        "texto": "Discuto con mi familia o amigos por causa de mi trabajo",
        "coords": [
          {
            "x": 268,
            "y": 423,
            "page": 4
          },
          {
            "x": 308,
            "y": 421,
            "page": 4
          },
          {
            "x": 329,
            "y": 423,
            "page": 4
          },
          {
            "x": 374,
            "y": 423,
            "page": 4
          },
          {
            "x": 404,
            "y": 423,
            "page": 4
          }
        ]
      },
      {
        "id": 27,
        "texto": "Debo atender asuntos de trabajo cuando estoy en casa",
        "coords": [
          {
            "x": 261,
            "y": 397,
            "page": 4
          },
          {
            "x": 297,
            "y": 398,
            "page": 4
          },
          {
            "x": 337,
            "y": 399,
            "page": 4
          },
          {
            "x": 368,
            "y": 399,
            "page": 4
          },
          {
            "x": 403,
            "y": 399,
            "page": 4
          }
        ]
      },
      {
        "id": 28,
        "texto": "Por mi trabajo el tiempo que paso con mi familia y amigos es muy poco",
        "coords": [
          {
            "x": 262,
            "y": 375,
            "page": 4
          },
          {
            "x": 297,
            "y": 376,
            "page": 4
          },
          {
            "x": 327,
            "y": 375,
            "page": 4
          },
          {
            "x": 368,
            "y": 375,
            "page": 4
          },
          {
            "x": 399,
            "y": 374,
            "page": 4
          }
        ]
      }
    ]
  },
  {
    "key": "decisiones_control",
    "titulo": "Decisiones y Control",
    "instruccion": "Las siguientes preguntas están relacionadas con las decisiones y el control que le permite su trabajo.",
    "preguntas": [
      {
        "id": 29,
        "texto": "En mi trabajo puedo hacer cosas nuevas",
        "coords": [
          {
            "x": 263,
            "y": 295,
            "page": 4
          },
          {
            "x": 297,
            "y": 295,
            "page": 4
          },
          {
            "x": 331,
            "y": 294,
            "page": 4
          },
          {
            "x": 372,
            "y": 295,
            "page": 4
          },
          {
            "x": 396,
            "y": 293,
            "page": 4
          }
        ]
      },
      {
        "id": 30,
        "texto": "Mi trabajo me permite desarrollar mis habilidades",
        "coords": [
          {
            "x": 267,
            "y": 274,
            "page": 4
          },
          {
            "x": 298,
            "y": 275,
            "page": 4
          },
          {
            "x": 329,
            "y": 275,
            "page": 4
          },
          {
            "x": 366,
            "y": 275,
            "page": 4
          },
          {
            "x": 397,
            "y": 275,
            "page": 4
          }
        ]
      },
      {
        "id": 31,
        "texto": "Mi trabajo me permite aplicar mis conocimientos",
        "coords": [
          {
            "x": 262,
            "y": 252,
            "page": 4
          },
          {
            "x": 298,
            "y": 252,
            "page": 4
          },
          {
            "x": 335,
            "y": 253,
            "page": 4
          },
          {
            "x": 373,
            "y": 252,
            "page": 4
          },
          {
            "x": 396,
            "y": 252,
            "page": 4
          }
        ]
      },
      {
        "id": 32,
        "texto": "Mi trabajo me permite aprender nuevas cosas",
        "coords": [
          {
            "x": 268,
            "y": 227,
            "page": 4
          },
          {
            "x": 299,
            "y": 226,
            "page": 4
          },
          {
            "x": 329,
            "y": 227,
            "page": 4
          },
          {
            "x": 365,
            "y": 227,
            "page": 4
          },
          {
            "x": 399,
            "y": 225,
            "page": 4
          }
        ]
      },
      {
        "id": 33,
        "texto": "Puedo tomar pausas cuando las necesito",
        "coords": [
          {
            "x": 265,
            "y": 203,
            "page": 4
          },
          {
            "x": 299,
            "y": 204,
            "page": 4
          },
          {
            "x": 336,
            "y": 203,
            "page": 4
          },
          {
            "x": 367,
            "y": 204,
            "page": 4
          },
          {
            "x": 399,
            "y": 204,
            "page": 4
          }
        ]
      },
      {
        "id": 34,
        "texto": "Puedo decidir cuánto trabajo hago en el día",
        "coords": [
          {
            "x": 262,
            "y": 181,
            "page": 4
          },
          {
            "x": 303,
            "y": 183,
            "page": 4
          },
          {
            "x": 327,
            "y": 183,
            "page": 4
          },
          {
            "x": 368,
            "y": 183,
            "page": 4
          },
          {
            "x": 396,
            "y": 183,
            "page": 4
          }
        ]
      },
      {
        "id": 35,
        "texto": "Puedo decidir la velocidad a la que trabajo",
        "coords": [
          {
            "x": 263,
            "y": 157,
            "page": 4
          },
          {
            "x": 294,
            "y": 158,
            "page": 4
          },
          {
            "x": 332,
            "y": 159,
            "page": 4
          },
          {
            "x": 365,
            "y": 157,
            "page": 4
          },
          {
            "x": 395,
            "y": 158,
            "page": 4
          }
        ]
      },
      {
        "id": 36,
        "texto": "Puedo cambiar el orden de las actividades en mi trabajo",
        "coords": [
          {
            "x": 263,
            "y": 498,
            "page": 5
          },
          {
            "x": 301,
            "y": 495,
            "page": 5
          },
          {
            "x": 331,
            "y": 492,
            "page": 5
          },
          {
            "x": 363,
            "y": 494,
            "page": 5
          },
          {
            "x": 399,
            "y": 493,
            "page": 5
          }
        ]
      },
      {
        "id": 37,
        "texto": "Puedo parar un momento mi trabajo para atender algún asunto personal",
        "coords": [
          {
            "x": 264,
            "y": 475,
            "page": 5
          },
          {
            "x": 293,
            "y": 472,
            "page": 5
          },
          {
            "x": 332,
            "y": 470,
            "page": 5
          },
          {
            "x": 365,
            "y": 471,
            "page": 5
          },
          {
            "x": 402,
            "y": 471,
            "page": 5
          }
        ]
      }
    ]
  },
  {
    "key": "cambios_trabajo",
    "titulo": "Cambios en el Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con cualquier tipo de cambio que ocurra en su trabajo.",
    "preguntas": [
      {
        "id": 38,
        "texto": "Me explican claramente los cambios que ocurren en mi trabajo",
        "coords": [
          {
            "x": 269,
            "y": 387,
            "page": 5
          },
          {
            "x": 301,
            "y": 388,
            "page": 5
          },
          {
            "x": 330,
            "y": 387,
            "page": 5
          },
          {
            "x": 365,
            "y": 387,
            "page": 5
          },
          {
            "x": 397,
            "y": 387,
            "page": 5
          }
        ]
      },
      {
        "id": 39,
        "texto": "Puedo dar sugerencias sobre los cambios que ocurren en mi trabajo",
        "coords": [
          {
            "x": 269,
            "y": 368,
            "page": 5
          },
          {
            "x": 303,
            "y": 368,
            "page": 5
          },
          {
            "x": 339,
            "y": 368,
            "page": 5
          },
          {
            "x": 363,
            "y": 366,
            "page": 5
          },
          {
            "x": 398,
            "y": 365,
            "page": 5
          }
        ]
      },
      {
        "id": 40,
        "texto": "Cuando se presentan cambios en mi trabajo se tienen en cuenta mis ideas y sugerencias",
        "coords": [
          {
            "x": 265,
            "y": 337,
            "page": 5
          },
          {
            "x": 297,
            "y": 337,
            "page": 5
          },
          {
            "x": 331,
            "y": 337,
            "page": 5
          },
          {
            "x": 365,
            "y": 337,
            "page": 5
          },
          {
            "x": 397,
            "y": 336,
            "page": 5
          }
        ]
      }
    ]
  },
  {
    "key": "informacion_empresa",
    "titulo": "Información de la Empresa",
    "instruccion": "Las siguientes preguntas están relacionadas con la información que la empresa le ha dado sobre su trabajo.",
    "preguntas": [
      {
        "id": 41,
        "texto": "Me informan con claridad cuáles son mis funciones",
        "coords": [
          {
            "x": 268,
            "y": 237,
            "page": 5
          },
          {
            "x": 299,
            "y": 236,
            "page": 5
          },
          {
            "x": 330,
            "y": 236,
            "page": 5
          },
          {
            "x": 368,
            "y": 237,
            "page": 5
          },
          {
            "x": 395,
            "y": 234,
            "page": 5
          }
        ]
      },
      {
        "id": 42,
        "texto": "Me informan cuáles son las decisiones que puedo tomar en mi trabajo",
        "coords": [
          {
            "x": 265,
            "y": 212,
            "page": 5
          },
          {
            "x": 303,
            "y": 211,
            "page": 5
          },
          {
            "x": 329,
            "y": 213,
            "page": 5
          },
          {
            "x": 364,
            "y": 214,
            "page": 5
          },
          {
            "x": 399,
            "y": 214,
            "page": 5
          }
        ]
      },
      {
        "id": 43,
        "texto": "Me explican claramente los resultados que debo lograr en mi trabajo",
        "coords": [
          {
            "x": 265,
            "y": 189,
            "page": 5
          },
          {
            "x": 303,
            "y": 191,
            "page": 5
          },
          {
            "x": 335,
            "y": 191,
            "page": 5
          },
          {
            "x": 367,
            "y": 192,
            "page": 5
          },
          {
            "x": 399,
            "y": 191,
            "page": 5
          }
        ]
      },
      {
        "id": 44,
        "texto": "Me explican claramente los objetivos de mi trabajo",
        "coords": [
          {
            "x": 268,
            "y": 169,
            "page": 5
          },
          {
            "x": 300,
            "y": 169,
            "page": 5
          },
          {
            "x": 338,
            "y": 167,
            "page": 5
          },
          {
            "x": 366,
            "y": 168,
            "page": 5
          },
          {
            "x": 399,
            "y": 168,
            "page": 5
          }
        ]
      },
      {
        "id": 45,
        "texto": "Me informan claramente con quién puedo resolver los asuntos de trabajo",
        "coords": [
          {
            "x": 269,
            "y": 493,
            "page": 6
          },
          {
            "x": 307,
            "y": 493,
            "page": 6
          },
          {
            "x": 336,
            "y": 494,
            "page": 6
          },
          {
            "x": 369,
            "y": 493,
            "page": 6
          },
          {
            "x": 405,
            "y": 493,
            "page": 6
          }
        ]
      }
    ]
  },
  {
    "key": "formacion_capacitacion",
    "titulo": "Formación y Capacitación",
    "instruccion": "Las siguientes preguntas están relacionadas con la formación y capacitación que la empresa le facilita para hacer su trabajo.",
    "preguntas": [
      {
        "id": 46,
        "texto": "La empresa me permite asistir a capacitaciones relacionadas con mi trabajo",
        "coords": [
          {
            "x": 268,
            "y": 397,
            "page": 6
          },
          {
            "x": 306,
            "y": 395,
            "page": 6
          },
          {
            "x": 338,
            "y": 393,
            "page": 6
          },
          {
            "x": 373,
            "y": 394,
            "page": 6
          },
          {
            "x": 402,
            "y": 392,
            "page": 6
          }
        ]
      },
      {
        "id": 47,
        "texto": "Recibo capacitación útil para hacer mi trabajo",
        "coords": [
          {
            "x": 274,
            "y": 366,
            "page": 6
          },
          {
            "x": 308,
            "y": 366,
            "page": 6
          },
          {
            "x": 345,
            "y": 367,
            "page": 6
          },
          {
            "x": 367,
            "y": 367,
            "page": 6
          },
          {
            "x": 401,
            "y": 369,
            "page": 6
          }
        ]
      },
      {
        "id": 48,
        "texto": "Recibo capacitación que me ayuda a hacer mejor mi trabajo",
        "coords": [
          {
            "x": 275,
            "y": 347,
            "page": 6
          },
          {
            "x": 307,
            "y": 348,
            "page": 6
          },
          {
            "x": 339,
            "y": 349,
            "page": 6
          },
          {
            "x": 374,
            "y": 349,
            "page": 6
          },
          {
            "x": 411,
            "y": 348,
            "page": 6
          }
        ]
      }
    ]
  },
  {
    "key": "jefes",
    "titulo": "Relación con Jefes",
    "instruccion": "Las siguientes preguntas están relacionadas con el o los jefes con quien tenga más contacto.",
    "preguntas": [
      {
        "id": 49,
        "texto": "Mi jefe ayuda a organizar mejor el trabajo",
        "coords": [
          {
            "x": 257,
            "y": 266,
            "page": 6
          },
          {
            "x": 305,
            "y": 265,
            "page": 6
          },
          {
            "x": 344,
            "y": 265,
            "page": 6
          },
          {
            "x": 374,
            "y": 264,
            "page": 6
          },
          {
            "x": 401,
            "y": 265,
            "page": 6
          }
        ]
      },
      {
        "id": 50,
        "texto": "Mi jefe tiene en cuenta mis puntos de vista y opiniones",
        "coords": [
          {
            "x": 271,
            "y": 245,
            "page": 6
          },
          {
            "x": 301,
            "y": 243,
            "page": 6
          },
          {
            "x": 339,
            "y": 243,
            "page": 6
          },
          {
            "x": 374,
            "y": 243,
            "page": 6
          },
          {
            "x": 406,
            "y": 245,
            "page": 6
          }
        ]
      },
      {
        "id": 51,
        "texto": "Mi jefe me anima para hacer mejor mi trabajo",
        "coords": [
          {
            "x": 270,
            "y": 220,
            "page": 6
          },
          {
            "x": 301,
            "y": 217,
            "page": 6
          },
          {
            "x": 341,
            "y": 219,
            "page": 6
          },
          {
            "x": 369,
            "y": 219,
            "page": 6
          },
          {
            "x": 406,
            "y": 220,
            "page": 6
          }
        ]
      },
      {
        "id": 52,
        "texto": "Mi jefe distribuye las tareas de forma que me facilita el trabajo",
        "coords": [
          {
            "x": 274,
            "y": 195,
            "page": 6
          },
          {
            "x": 303,
            "y": 195,
            "page": 6
          },
          {
            "x": 341,
            "y": 196,
            "page": 6
          },
          {
            "x": 369,
            "y": 197,
            "page": 6
          },
          {
            "x": 405,
            "y": 197,
            "page": 6
          }
        ]
      },
      {
        "id": 53,
        "texto": "Mi jefe me comunica a tiempo la información relacionada con el trabajo",
        "coords": [
          {
            "x": 273,
            "y": 176,
            "page": 6
          },
          {
            "x": 300,
            "y": 174,
            "page": 6
          },
          {
            "x": 339,
            "y": 175,
            "page": 6
          },
          {
            "x": 369,
            "y": 171,
            "page": 6
          },
          {
            "x": 408,
            "y": 174,
            "page": 6
          }
        ]
      },
      {
        "id": 54,
        "texto": "La orientación que me da mi jefe me ayuda a hacer mejor el trabajo",
        "coords": [
          {
            "x": 269,
            "y": 149,
            "page": 6
          },
          {
            "x": 306,
            "y": 151,
            "page": 6
          },
          {
            "x": 334,
            "y": 150,
            "page": 6
          },
          {
            "x": 370,
            "y": 148,
            "page": 6
          },
          {
            "x": 405,
            "y": 149,
            "page": 6
          }
        ]
      },
      {
        "id": 55,
        "texto": "Mi jefe me ayuda a progresar en el trabajo",
        "coords": [
          {
            "x": 267,
            "y": 500,
            "page": 7
          },
          {
            "x": 301,
            "y": 498,
            "page": 7
          },
          {
            "x": 338,
            "y": 498,
            "page": 7
          },
          {
            "x": 369,
            "y": 499,
            "page": 7
          },
          {
            "x": 405,
            "y": 499,
            "page": 7
          }
        ]
      },
      {
        "id": 56,
        "texto": "Mi jefe me ayuda a sentirme bien en el trabajo",
        "coords": [
          {
            "x": 271,
            "y": 479,
            "page": 7
          },
          {
            "x": 305,
            "y": 479,
            "page": 7
          },
          {
            "x": 337,
            "y": 478,
            "page": 7
          },
          {
            "x": 371,
            "y": 478,
            "page": 7
          },
          {
            "x": 411,
            "y": 477,
            "page": 7
          }
        ]
      },
      {
        "id": 57,
        "texto": "Mi jefe ayuda a solucionar los problemas que se presentan en el trabajo",
        "coords": [
          {
            "x": 273,
            "y": 453,
            "page": 7
          },
          {
            "x": 301,
            "y": 454,
            "page": 7
          },
          {
            "x": 339,
            "y": 455,
            "page": 7
          },
          {
            "x": 376,
            "y": 453,
            "page": 7
          },
          {
            "x": 406,
            "y": 455,
            "page": 7
          }
        ]
      },
      {
        "id": 58,
        "texto": "Mi jefe me trata con respeto",
        "coords": [
          {
            "x": 266,
            "y": 435,
            "page": 7
          },
          {
            "x": 303,
            "y": 435,
            "page": 7
          },
          {
            "x": 335,
            "y": 435,
            "page": 7
          },
          {
            "x": 372,
            "y": 435,
            "page": 7
          },
          {
            "x": 413,
            "y": 437,
            "page": 7
          }
        ]
      },
      {
        "id": 59,
        "texto": "Siento que puedo confiar en mi jefe",
        "coords": [
          {
            "x": 277,
            "y": 419,
            "page": 7
          },
          {
            "x": 305,
            "y": 419,
            "page": 7
          },
          {
            "x": 337,
            "y": 419,
            "page": 7
          },
          {
            "x": 376,
            "y": 418,
            "page": 7
          },
          {
            "x": 405,
            "y": 418,
            "page": 7
          }
        ]
      },
      {
        "id": 60,
        "texto": "Mi jefe me escucha cuando tengo problemas de trabajo",
        "coords": [
          {
            "x": 277,
            "y": 396,
            "page": 7
          },
          {
            "x": 304,
            "y": 396,
            "page": 7
          },
          {
            "x": 337,
            "y": 397,
            "page": 7
          },
          {
            "x": 375,
            "y": 397,
            "page": 7
          },
          {
            "x": 407,
            "y": 397,
            "page": 7
          }
        ]
      },
      {
        "id": 61,
        "texto": "Mi jefe me brinda su apoyo cuando lo necesito",
        "coords": [
          {
            "x": 270,
            "y": 375,
            "page": 7
          },
          {
            "x": 303,
            "y": 374,
            "page": 7
          },
          {
            "x": 339,
            "y": 375,
            "page": 7
          },
          {
            "x": 372,
            "y": 375,
            "page": 7
          },
          {
            "x": 404,
            "y": 375,
            "page": 7
          }
        ]
      }
    ]
  },
  {
    "key": "relaciones_apoyo",
    "titulo": "Relaciones y Apoyo",
    "instruccion": "Las siguientes preguntas indagan sobre las relaciones con otras personas y el apoyo entre las personas de su trabajo.",
    "preguntas": [
      {
        "id": 62,
        "texto": "Me agrada el ambiente de mi grupo de trabajo",
        "coords": [
          {
            "x": 269,
            "y": 281,
            "page": 7
          },
          {
            "x": 307,
            "y": 281,
            "page": 7
          },
          {
            "x": 339,
            "y": 281,
            "page": 7
          },
          {
            "x": 375,
            "y": 281,
            "page": 7
          },
          {
            "x": 410,
            "y": 281,
            "page": 7
          }
        ]
      },
      {
        "id": 63,
        "texto": "En mi grupo de trabajo me tratan de forma respetuosa",
        "coords": [
          {
            "x": 269,
            "y": 257,
            "page": 7
          },
          {
            "x": 307,
            "y": 256,
            "page": 7
          },
          {
            "x": 340,
            "y": 255,
            "page": 7
          },
          {
            "x": 369,
            "y": 257,
            "page": 7
          },
          {
            "x": 403,
            "y": 257,
            "page": 7
          }
        ]
      },
      {
        "id": 64,
        "texto": "Siento que puedo confiar en mis compañeros de trabajo",
        "coords": [
          {
            "x": 272,
            "y": 235,
            "page": 7
          },
          {
            "x": 301,
            "y": 235,
            "page": 7
          },
          {
            "x": 349,
            "y": 234,
            "page": 7
          },
          {
            "x": 377,
            "y": 234,
            "page": 7
          },
          {
            "x": 412,
            "y": 233,
            "page": 7
          }
        ]
      },
      {
        "id": 65,
        "texto": "Me siento a gusto con mis compañeros de trabajo",
        "coords": [
          {
            "x": 271,
            "y": 213,
            "page": 7
          },
          {
            "x": 298,
            "y": 212,
            "page": 7
          },
          {
            "x": 342,
            "y": 211,
            "page": 7
          },
          {
            "x": 373,
            "y": 214,
            "page": 7
          },
          {
            "x": 405,
            "y": 211,
            "page": 7
          }
        ]
      },
      {
        "id": 66,
        "texto": "En mi grupo de trabajo algunas personas me maltratan",
        "coords": [
          {
            "x": 271,
            "y": 187,
            "page": 7
          },
          {
            "x": 313,
            "y": 187,
            "page": 7
          },
          {
            "x": 334,
            "y": 188,
            "page": 7
          },
          {
            "x": 371,
            "y": 187,
            "page": 7
          },
          {
            "x": 404,
            "y": 187,
            "page": 7
          }
        ]
      },
      {
        "id": 67,
        "texto": "Entre compañeros solucionamos los problemas de forma respetuosa",
        "coords": [
          {
            "x": 268,
            "y": 161,
            "page": 7
          },
          {
            "x": 307,
            "y": 161,
            "page": 7
          },
          {
            "x": 339,
            "y": 163,
            "page": 7
          },
          {
            "x": 382,
            "y": 163,
            "page": 7
          },
          {
            "x": 403,
            "y": 165,
            "page": 7
          }
        ]
      },
      {
        "id": 68,
        "texto": "Mi grupo de trabajo es muy unido",
        "coords": [
          {
            "x": 273,
            "y": 144,
            "page": 7
          },
          {
            "x": 307,
            "y": 143,
            "page": 7
          },
          {
            "x": 333,
            "y": 145,
            "page": 7
          },
          {
            "x": 371,
            "y": 143,
            "page": 7
          },
          {
            "x": 403,
            "y": 144,
            "page": 7
          }
        ]
      },
      {
        "id": 69,
        "texto": "Cuando tenemos que realizar trabajo de grupo los compañeros colaboran",
        "coords": [
          {
            "x": 270,
            "y": 489,
            "page": 8
          },
          {
            "x": 305,
            "y": 490,
            "page": 8
          },
          {
            "x": 341,
            "y": 486,
            "page": 8
          },
          {
            "x": 377,
            "y": 487,
            "page": 8
          },
          {
            "x": 412,
            "y": 487,
            "page": 8
          }
        ]
      },
      {
        "id": 70,
        "texto": "Es fácil poner de acuerdo al grupo para hacer el trabajo",
        "coords": [
          {
            "x": 269,
            "y": 465,
            "page": 8
          },
          {
            "x": 313,
            "y": 463,
            "page": 8
          },
          {
            "x": 357,
            "y": 463,
            "page": 8
          },
          {
            "x": 382,
            "y": 463,
            "page": 8
          },
          {
            "x": 415,
            "y": 463,
            "page": 8
          }
        ]
      },
      {
        "id": 71,
        "texto": "Mis compañeros de trabajo me ayudan cuando tengo dificultades",
        "coords": [
          {
            "x": 270,
            "y": 438,
            "page": 8
          },
          {
            "x": 313,
            "y": 439,
            "page": 8
          },
          {
            "x": 345,
            "y": 439,
            "page": 8
          },
          {
            "x": 384,
            "y": 440,
            "page": 8
          },
          {
            "x": 414,
            "y": 440,
            "page": 8
          }
        ]
      },
      {
        "id": 72,
        "texto": "En mi trabajo las personas nos apoyamos unos a otros",
        "coords": [
          {
            "x": 267,
            "y": 414,
            "page": 8
          },
          {
            "x": 306,
            "y": 416,
            "page": 8
          },
          {
            "x": 345,
            "y": 417,
            "page": 8
          },
          {
            "x": 389,
            "y": 416,
            "page": 8
          },
          {
            "x": 416,
            "y": 417,
            "page": 8
          }
        ]
      },
      {
        "id": 73,
        "texto": "Algunos compañeros de trabajo me escuchan cuando tengo problemas",
        "coords": [
          {
            "x": 273,
            "y": 393,
            "page": 8
          },
          {
            "x": 305,
            "y": 393,
            "page": 8
          },
          {
            "x": 346,
            "y": 393,
            "page": 8
          },
          {
            "x": 382,
            "y": 393,
            "page": 8
          },
          {
            "x": 413,
            "y": 393,
            "page": 8
          }
        ]
      }
    ]
  },
  {
    "key": "rendimiento",
    "titulo": "Rendimiento en el Trabajo",
    "instruccion": "Las siguientes preguntas están relacionadas con la información que usted recibe sobre su rendimiento en el trabajo.",
    "preguntas": [
      {
        "id": 74,
        "texto": "Me informan sobre lo que hago bien en mi trabajo",
        "coords": [
          {
            "x": 268,
            "y": 297,
            "page": 8
          },
          {
            "x": 308,
            "y": 296,
            "page": 8
          },
          {
            "x": 345,
            "y": 296,
            "page": 8
          },
          {
            "x": 382,
            "y": 295,
            "page": 8
          },
          {
            "x": 413,
            "y": 294,
            "page": 8
          }
        ]
      },
      {
        "id": 75,
        "texto": "Me informan sobre lo que debo mejorar en mi trabajo",
        "coords": [
          {
            "x": 274,
            "y": 269,
            "page": 8
          },
          {
            "x": 307,
            "y": 269,
            "page": 8
          },
          {
            "x": 350,
            "y": 271,
            "page": 8
          },
          {
            "x": 381,
            "y": 270,
            "page": 8
          },
          {
            "x": 416,
            "y": 271,
            "page": 8
          }
        ]
      },
      {
        "id": 76,
        "texto": "La información que recibo sobre mi rendimiento en el trabajo es clara",
        "coords": [
          {
            "x": 271,
            "y": 245,
            "page": 8
          },
          {
            "x": 305,
            "y": 246,
            "page": 8
          },
          {
            "x": 352,
            "y": 245,
            "page": 8
          },
          {
            "x": 387,
            "y": 246,
            "page": 8
          },
          {
            "x": 415,
            "y": 247,
            "page": 8
          }
        ]
      },
      {
        "id": 77,
        "texto": "La forma como evalúan mi trabajo en la empresa me ayuda a mejorar",
        "coords": [
          {
            "x": 269,
            "y": 222,
            "page": 8
          },
          {
            "x": 305,
            "y": 223,
            "page": 8
          },
          {
            "x": 350,
            "y": 221,
            "page": 8
          },
          {
            "x": 389,
            "y": 222,
            "page": 8
          },
          {
            "x": 411,
            "y": 223,
            "page": 8
          }
        ]
      },
      {
        "id": 78,
        "texto": "Me informan a tiempo sobre lo que debo mejorar en el trabajo",
        "coords": [
          {
            "x": 267,
            "y": 197,
            "page": 8
          },
          {
            "x": 302,
            "y": 199,
            "page": 8
          },
          {
            "x": 349,
            "y": 199,
            "page": 8
          },
          {
            "x": 381,
            "y": 199,
            "page": 8
          },
          {
            "x": 417,
            "y": 199,
            "page": 8
          }
        ]
      }
    ]
  },
  {
    "key": "satisfaccion_seguridad",
    "titulo": "Satisfacción y Seguridad",
    "instruccion": "Las siguientes preguntas están relacionadas con la satisfacción, reconocimiento y la seguridad que le ofrece su trabajo.",
    "preguntas": [
      {
        "id": 79,
        "texto": "En la empresa me pagan a tiempo mi salario",
        "coords": [
          {
            "x": 273,
            "y": 473,
            "page": 9
          },
          {
            "x": 307,
            "y": 471,
            "page": 9
          },
          {
            "x": 335,
            "y": 470,
            "page": 9
          },
          {
            "x": 373,
            "y": 471,
            "page": 9
          },
          {
            "x": 402,
            "y": 470,
            "page": 9
          }
        ]
      },
      {
        "id": 80,
        "texto": "El pago que recibo es el que me ofreció la empresa",
        "coords": [
          {
            "x": 275,
            "y": 451,
            "page": 9
          },
          {
            "x": 308,
            "y": 449,
            "page": 9
          },
          {
            "x": 342,
            "y": 448,
            "page": 9
          },
          {
            "x": 379,
            "y": 447,
            "page": 9
          },
          {
            "x": 404,
            "y": 447,
            "page": 9
          }
        ]
      },
      {
        "id": 81,
        "texto": "El pago que recibo es el que merezco por el trabajo que realizo",
        "coords": [
          {
            "x": 271,
            "y": 421,
            "page": 9
          },
          {
            "x": 307,
            "y": 423,
            "page": 9
          },
          {
            "x": 343,
            "y": 423,
            "page": 9
          },
          {
            "x": 378,
            "y": 425,
            "page": 9
          },
          {
            "x": 407,
            "y": 424,
            "page": 9
          }
        ]
      },
      {
        "id": 82,
        "texto": "En mi trabajo tengo posibilidades de progresar",
        "coords": [
          {
            "x": 269,
            "y": 403,
            "page": 9
          },
          {
            "x": 304,
            "y": 402,
            "page": 9
          },
          {
            "x": 337,
            "y": 403,
            "page": 9
          },
          {
            "x": 378,
            "y": 403,
            "page": 9
          },
          {
            "x": 409,
            "y": 402,
            "page": 9
          }
        ]
      },
      {
        "id": 83,
        "texto": "Las personas que hacen bien el trabajo pueden progresar en la empresa",
        "coords": [
          {
            "x": 273,
            "y": 380,
            "page": 9
          },
          {
            "x": 302,
            "y": 379,
            "page": 9
          },
          {
            "x": 337,
            "y": 381,
            "page": 9
          },
          {
            "x": 370,
            "y": 381,
            "page": 9
          },
          {
            "x": 405,
            "y": 381,
            "page": 9
          }
        ]
      },
      {
        "id": 84,
        "texto": "La empresa se preocupa por el bienestar de los trabajadores",
        "coords": [
          {
            "x": 270,
            "y": 359,
            "page": 9
          },
          {
            "x": 307,
            "y": 357,
            "page": 9
          },
          {
            "x": 333,
            "y": 357,
            "page": 9
          },
          {
            "x": 377,
            "y": 357,
            "page": 9
          },
          {
            "x": 404,
            "y": 356,
            "page": 9
          }
        ]
      },
      {
        "id": 85,
        "texto": "Mi trabajo en la empresa es estable",
        "coords": [
          {
            "x": 268,
            "y": 335,
            "page": 9
          },
          {
            "x": 308,
            "y": 335,
            "page": 9
          },
          {
            "x": 333,
            "y": 336,
            "page": 9
          },
          {
            "x": 365,
            "y": 335,
            "page": 9
          },
          {
            "x": 409,
            "y": 335,
            "page": 9
          }
        ]
      },
      {
        "id": 86,
        "texto": "El trabajo que hago me hace sentir bien",
        "coords": [
          {
            "x": 268,
            "y": 318,
            "page": 9
          },
          {
            "x": 310,
            "y": 320,
            "page": 9
          },
          {
            "x": 340,
            "y": 319,
            "page": 9
          },
          {
            "x": 374,
            "y": 318,
            "page": 9
          },
          {
            "x": 407,
            "y": 317,
            "page": 9
          }
        ]
      },
      {
        "id": 87,
        "texto": "Siento orgullo de trabajar en esta empresa",
        "coords": [
          {
            "x": 272,
            "y": 300,
            "page": 9
          },
          {
            "x": 305,
            "y": 299,
            "page": 9
          },
          {
            "x": 339,
            "y": 300,
            "page": 9
          },
          {
            "x": 377,
            "y": 299,
            "page": 9
          },
          {
            "x": 407,
            "y": 300,
            "page": 9
          }
        ]
      },
      {
        "id": 88,
        "texto": "Hablo bien de la empresa con otras personas",
        "coords": [
          {
            "x": 267,
            "y": 274,
            "page": 9
          },
          {
            "x": 303,
            "y": 276,
            "page": 9
          },
          {
            "x": 338,
            "y": 275,
            "page": 9
          },
          {
            "x": 373,
            "y": 277,
            "page": 9
          },
          {
            "x": 409,
            "y": 276,
            "page": 9
          }
        ]
      }
    ]
  },
  {
    "key": "clientes_usuarios",
    "titulo": "Servicio a Clientes o Usuarios",
    "instruccion": "Las siguientes preguntas están relacionadas con el servicio que usted brinda a clientes o usuarios.",
    "filtro": "En mi trabajo debo brindar servicio a clientes o usuarios",
    "preguntas": [
      {
        "id": 89,
        "texto": "Atiendo clientes o usuarios muy enojados",
        "coords": [
          {
            "x": 264,
            "y": 407,
            "page": 10
          },
          {
            "x": 300,
            "y": 407,
            "page": 10
          },
          {
            "x": 335,
            "y": 407,
            "page": 10
          },
          {
            "x": 364,
            "y": 407,
            "page": 10
          },
          {
            "x": 395,
            "y": 405,
            "page": 10
          }
        ]
      },
      {
        "id": 90,
        "texto": "Atiendo clientes o usuarios muy preocupados",
        "coords": [
          {
            "x": 269,
            "y": 387,
            "page": 10
          },
          {
            "x": 300,
            "y": 388,
            "page": 10
          },
          {
            "x": 333,
            "y": 384,
            "page": 10
          },
          {
            "x": 367,
            "y": 384,
            "page": 10
          },
          {
            "x": 401,
            "y": 385,
            "page": 10
          }
        ]
      },
      {
        "id": 91,
        "texto": "Atiendo clientes o usuarios muy tristes",
        "coords": [
          {
            "x": 273,
            "y": 366,
            "page": 10
          },
          {
            "x": 296,
            "y": 366,
            "page": 10
          },
          {
            "x": 331,
            "y": 367,
            "page": 10
          },
          {
            "x": 367,
            "y": 367,
            "page": 10
          },
          {
            "x": 400,
            "y": 368,
            "page": 10
          }
        ]
      },
      {
        "id": 92,
        "texto": "Mi trabajo me exige atender personas muy enfermas",
        "coords": [
          {
            "x": 266,
            "y": 347,
            "page": 10
          },
          {
            "x": 300,
            "y": 347,
            "page": 10
          },
          {
            "x": 333,
            "y": 347,
            "page": 10
          },
          {
            "x": 369,
            "y": 347,
            "page": 10
          },
          {
            "x": 396,
            "y": 347,
            "page": 10
          }
        ]
      },
      {
        "id": 93,
        "texto": "Mi trabajo me exige atender personas muy necesitadas de ayuda",
        "coords": [
          {
            "x": 273,
            "y": 325,
            "page": 10
          },
          {
            "x": 299,
            "y": 325,
            "page": 10
          },
          {
            "x": 335,
            "y": 327,
            "page": 10
          },
          {
            "x": 366,
            "y": 323,
            "page": 10
          },
          {
            "x": 399,
            "y": 324,
            "page": 10
          }
        ]
      },
      {
        "id": 94,
        "texto": "Atiendo clientes o usuarios que me maltratan",
        "coords": [
          {
            "x": 274,
            "y": 305,
            "page": 10
          },
          {
            "x": 296,
            "y": 303,
            "page": 10
          },
          {
            "x": 329,
            "y": 301,
            "page": 10
          },
          {
            "x": 369,
            "y": 302,
            "page": 10
          },
          {
            "x": 398,
            "y": 301,
            "page": 10
          }
        ]
      },
      {
        "id": 95,
        "texto": "Mi trabajo me exige atender situaciones de violencia",
        "coords": [
          {
            "x": 268,
            "y": 277,
            "page": 10
          },
          {
            "x": 303,
            "y": 279,
            "page": 10
          },
          {
            "x": 337,
            "y": 279,
            "page": 10
          },
          {
            "x": 363,
            "y": 278,
            "page": 10
          },
          {
            "x": 397,
            "y": 279,
            "page": 10
          }
        ]
      },
      {
        "id": 96,
        "texto": "Mi trabajo me exige atender situaciones muy tristes o dolorosas",
        "coords": [
          {
            "x": 274,
            "y": 259,
            "page": 10
          },
          {
            "x": 297,
            "y": 257,
            "page": 10
          },
          {
            "x": 333,
            "y": 257,
            "page": 10
          },
          {
            "x": 365,
            "y": 257,
            "page": 10
          },
          {
            "x": 397,
            "y": 253,
            "page": 10
          }
        ]
      },
      {
        "id": 97,
        "texto": "Puedo expresar tristeza o enojo frente a las personas que atiendo",
        "coords": [
          {
            "x": 269,
            "y": 237,
            "page": 10
          },
          {
            "x": 297,
            "y": 232,
            "page": 10
          },
          {
            "x": 335,
            "y": 233,
            "page": 10
          },
          {
            "x": 363,
            "y": 234,
            "page": 10
          },
          {
            "x": 405,
            "y": 233,
            "page": 10
          }
        ]
      }
    ]
  }
];

// Extralaboral sections
export const extralaboralSections: SurveySection[] = [
  {
    "key": "zona_vivienda",
    "titulo": "Condiciones de la Zona de Vivienda",
    "instruccion": "Las siguientes preguntas están relacionadas con varias condiciones de la zona donde usted vive.",
    "preguntas": [
      {
        "id": 1,
        "texto": "Es fácil transportarme entre mi casa y el trabajo",
        "coords": [
          {
            "x": 281,
            "y": 477,
            "page": 2
          },
          {
            "x": 317,
            "y": 475,
            "page": 2
          },
          {
            "x": 349,
            "y": 474,
            "page": 2
          },
          {
            "x": 383,
            "y": 476,
            "page": 2
          },
          {
            "x": 415,
            "y": 475,
            "page": 2
          }
        ]
      },
      {
        "id": 2,
        "texto": "Tengo que tomar varios medios de transporte para llegar a mi lugar de trabajo",
        "coords": [
          {
            "x": 282,
            "y": 452,
            "page": 2
          },
          {
            "x": 317,
            "y": 450,
            "page": 2
          },
          {
            "x": 348,
            "y": 452,
            "page": 2
          },
          {
            "x": 379,
            "y": 451,
            "page": 2
          },
          {
            "x": 413,
            "y": 449,
            "page": 2
          }
        ]
      },
      {
        "id": 3,
        "texto": "Paso mucho tiempo viajando de ida y regreso al trabajo",
        "coords": [
          {
            "x": 282,
            "y": 426,
            "page": 2
          },
          {
            "x": 321,
            "y": 425,
            "page": 2
          },
          {
            "x": 345,
            "y": 424,
            "page": 2
          },
          {
            "x": 379,
            "y": 425,
            "page": 2
          },
          {
            "x": 411,
            "y": 425,
            "page": 2
          }
        ]
      },
      {
        "id": 4,
        "texto": "Me transporto cómodamente entre mi casa y el trabajo",
        "coords": [
          {
            "x": 283,
            "y": 400,
            "page": 2
          },
          {
            "x": 320,
            "y": 399,
            "page": 2
          },
          {
            "x": 348,
            "y": 400,
            "page": 2
          },
          {
            "x": 384,
            "y": 401,
            "page": 2
          },
          {
            "x": 414,
            "y": 402,
            "page": 2
          }
        ]
      },
      {
        "id": 5,
        "texto": "La zona donde vivo es segura",
        "coords": [
          {
            "x": 283,
            "y": 379,
            "page": 2
          },
          {
            "x": 321,
            "y": 381,
            "page": 2
          },
          {
            "x": 349,
            "y": 380,
            "page": 2
          },
          {
            "x": 388,
            "y": 381,
            "page": 2
          },
          {
            "x": 407,
            "y": 381,
            "page": 2
          }
        ]
      },
      {
        "id": 6,
        "texto": "En la zona donde vivo se presentan hurtos y mucha delincuencia",
        "coords": [
          {
            "x": 290,
            "y": 358,
            "page": 2
          },
          {
            "x": 317,
            "y": 357,
            "page": 2
          },
          {
            "x": 361,
            "y": 359,
            "page": 2
          },
          {
            "x": 381,
            "y": 356,
            "page": 2
          },
          {
            "x": 411,
            "y": 358,
            "page": 2
          }
        ]
      },
      {
        "id": 7,
        "texto": "Desde donde vivo me es fácil llegar al centro médico donde me atienden",
        "coords": [
          {
            "x": 285,
            "y": 333,
            "page": 2
          },
          {
            "x": 315,
            "y": 335,
            "page": 2
          },
          {
            "x": 347,
            "y": 335,
            "page": 2
          },
          {
            "x": 376,
            "y": 337,
            "page": 2
          },
          {
            "x": 408,
            "y": 335,
            "page": 2
          }
        ]
      },
      {
        "id": 8,
        "texto": "Cerca a mi vivienda las vías están en buenas condiciones",
        "coords": [
          {
            "x": 285,
            "y": 313,
            "page": 2
          },
          {
            "x": 314,
            "y": 312,
            "page": 2
          },
          {
            "x": 351,
            "y": 312,
            "page": 2
          },
          {
            "x": 380,
            "y": 311,
            "page": 2
          },
          {
            "x": 410,
            "y": 311,
            "page": 2
          }
        ]
      },
      {
        "id": 9,
        "texto": "Cerca a mi vivienda encuentro fácilmente transporte",
        "coords": [
          {
            "x": 287,
            "y": 287,
            "page": 2
          },
          {
            "x": 314,
            "y": 287,
            "page": 2
          },
          {
            "x": 349,
            "y": 287,
            "page": 2
          },
          {
            "x": 379,
            "y": 287,
            "page": 2
          },
          {
            "x": 416,
            "y": 288,
            "page": 2
          }
        ]
      },
      {
        "id": 10,
        "texto": "Las condiciones de mi vivienda son buenas",
        "coords": [
          {
            "x": 289,
            "y": 268,
            "page": 2
          },
          {
            "x": 317,
            "y": 269,
            "page": 2
          },
          {
            "x": 345,
            "y": 267,
            "page": 2
          },
          {
            "x": 382,
            "y": 268,
            "page": 2
          },
          {
            "x": 411,
            "y": 268,
            "page": 2
          }
        ]
      },
      {
        "id": 11,
        "texto": "En mi vivienda hay servicios de agua y luz",
        "coords": [
          {
            "x": 283,
            "y": 249,
            "page": 2
          },
          {
            "x": 313,
            "y": 251,
            "page": 2
          },
          {
            "x": 346,
            "y": 249,
            "page": 2
          },
          {
            "x": 377,
            "y": 251,
            "page": 2
          },
          {
            "x": 411,
            "y": 249,
            "page": 2
          }
        ]
      },
      {
        "id": 12,
        "texto": "Las condiciones de mi vivienda me permiten descansar cuando lo requiero",
        "coords": [
          {
            "x": 281,
            "y": 232,
            "page": 2
          },
          {
            "x": 321,
            "y": 231,
            "page": 2
          },
          {
            "x": 347,
            "y": 229,
            "page": 2
          },
          {
            "x": 379,
            "y": 227,
            "page": 2
          },
          {
            "x": 413,
            "y": 227,
            "page": 2
          }
        ]
      },
      {
        "id": 13,
        "texto": "Las condiciones de mi vivienda me permiten sentirme cómodo",
        "coords": [
          {
            "x": 287,
            "y": 207,
            "page": 2
          },
          {
            "x": 314,
            "y": 205,
            "page": 2
          },
          {
            "x": 345,
            "y": 205,
            "page": 2
          },
          {
            "x": 379,
            "y": 205,
            "page": 2
          },
          {
            "x": 414,
            "y": 204,
            "page": 2
          }
        ]
      }
    ]
  },
  {
    "key": "vida_laboral_familiar",
    "titulo": "Balance Vida Laboral y Familiar",
    "instruccion": "Las siguientes preguntas están relacionadas con el balance entre la vida laboral y familiar.",
    "preguntas": [
      {
        "id": 14,
        "texto": "Tengo tiempo para actividades de esparcimiento",
        "coords": [
          {
            "x": 271,
            "y": 469,
            "page": 3
          },
          {
            "x": 309,
            "y": 470,
            "page": 3
          },
          {
            "x": 341,
            "y": 470,
            "page": 3
          },
          {
            "x": 371,
            "y": 468,
            "page": 3
          },
          {
            "x": 403,
            "y": 469,
            "page": 3
          }
        ]
      },
      {
        "id": 15,
        "texto": "Tengo tiempo suficiente para descansar",
        "coords": [
          {
            "x": 263,
            "y": 445,
            "page": 3
          },
          {
            "x": 309,
            "y": 444,
            "page": 3
          },
          {
            "x": 341,
            "y": 444,
            "page": 3
          },
          {
            "x": 373,
            "y": 443,
            "page": 3
          },
          {
            "x": 411,
            "y": 445,
            "page": 3
          }
        ]
      },
      {
        "id": 16,
        "texto": "Mi trabajo me permite tener disponibilidad para atender compromisos personales y familiares",
        "coords": [
          {
            "x": 271,
            "y": 417,
            "page": 3
          },
          {
            "x": 307,
            "y": 418,
            "page": 3
          },
          {
            "x": 341,
            "y": 418,
            "page": 3
          },
          {
            "x": 375,
            "y": 419,
            "page": 3
          },
          {
            "x": 407,
            "y": 417,
            "page": 3
          }
        ]
      },
      {
        "id": 17,
        "texto": "Tengo tiempo para compartir con mi familia o amigos",
        "coords": [
          {
            "x": 273,
            "y": 390,
            "page": 3
          },
          {
            "x": 311,
            "y": 391,
            "page": 3
          },
          {
            "x": 337,
            "y": 391,
            "page": 3
          },
          {
            "x": 377,
            "y": 388,
            "page": 3
          },
          {
            "x": 406,
            "y": 389,
            "page": 3
          }
        ]
      },
      {
        "id": 18,
        "texto": "Tengo buena comunicación con las personas cercanas",
        "coords": [
          {
            "x": 269,
            "y": 365,
            "page": 3
          },
          {
            "x": 301,
            "y": 365,
            "page": 3
          },
          {
            "x": 335,
            "y": 365,
            "page": 3
          },
          {
            "x": 375,
            "y": 365,
            "page": 3
          },
          {
            "x": 404,
            "y": 365,
            "page": 3
          }
        ]
      },
      {
        "id": 19,
        "texto": "Las relaciones con mis amigos son buenas",
        "coords": [
          {
            "x": 272,
            "y": 342,
            "page": 3
          },
          {
            "x": 303,
            "y": 345,
            "page": 3
          },
          {
            "x": 340,
            "y": 345,
            "page": 3
          },
          {
            "x": 373,
            "y": 346,
            "page": 3
          },
          {
            "x": 405,
            "y": 344,
            "page": 3
          }
        ]
      },
      {
        "id": 20,
        "texto": "Converso con personas cercanas sobre diferentes temas",
        "coords": [
          {
            "x": 272,
            "y": 323,
            "page": 3
          },
          {
            "x": 302,
            "y": 324,
            "page": 3
          },
          {
            "x": 340,
            "y": 325,
            "page": 3
          },
          {
            "x": 379,
            "y": 322,
            "page": 3
          },
          {
            "x": 403,
            "y": 323,
            "page": 3
          }
        ]
      },
      {
        "id": 21,
        "texto": "Mis amigos están dispuestos a escucharme cuando tengo problemas",
        "coords": [
          {
            "x": 278,
            "y": 302,
            "page": 3
          },
          {
            "x": 298,
            "y": 301,
            "page": 3
          },
          {
            "x": 342,
            "y": 301,
            "page": 3
          },
          {
            "x": 377,
            "y": 300,
            "page": 3
          },
          {
            "x": 407,
            "y": 299,
            "page": 3
          }
        ]
      },
      {
        "id": 22,
        "texto": "Cuento con el apoyo de mi familia cuando tengo problemas",
        "coords": [
          {
            "x": 272,
            "y": 276,
            "page": 3
          },
          {
            "x": 306,
            "y": 276,
            "page": 3
          },
          {
            "x": 339,
            "y": 276,
            "page": 3
          },
          {
            "x": 374,
            "y": 275,
            "page": 3
          },
          {
            "x": 412,
            "y": 275,
            "page": 3
          }
        ]
      },
      {
        "id": 23,
        "texto": "Puedo hablar con personas cercanas sobre las cosas que me pasan",
        "coords": [
          {
            "x": 271,
            "y": 249,
            "page": 3
          },
          {
            "x": 304,
            "y": 251,
            "page": 3
          },
          {
            "x": 342,
            "y": 252,
            "page": 3
          },
          {
            "x": 376,
            "y": 252,
            "page": 3
          },
          {
            "x": 412,
            "y": 251,
            "page": 3
          }
        ]
      },
      {
        "id": 24,
        "texto": "Mis problemas personales o familiares afectan mi trabajo",
        "coords": [
          {
            "x": 267,
            "y": 229,
            "page": 3
          },
          {
            "x": 303,
            "y": 229,
            "page": 3
          },
          {
            "x": 341,
            "y": 227,
            "page": 3
          },
          {
            "x": 373,
            "y": 227,
            "page": 3
          },
          {
            "x": 408,
            "y": 226,
            "page": 3
          }
        ]
      },
      {
        "id": 25,
        "texto": "La relación con mi familia cercana es cordial",
        "coords": [
          {
            "x": 270,
            "y": 208,
            "page": 3
          },
          {
            "x": 301,
            "y": 205,
            "page": 3
          },
          {
            "x": 336,
            "y": 207,
            "page": 3
          },
          {
            "x": 375,
            "y": 205,
            "page": 3
          },
          {
            "x": 409,
            "y": 205,
            "page": 3
          }
        ]
      },
      {
        "id": 26,
        "texto": "Mis problemas personales o familiares me quitan la energía que necesito para trabajar",
        "coords": [
          {
            "x": 273,
            "y": 182,
            "page": 3
          },
          {
            "x": 307,
            "y": 182,
            "page": 3
          },
          {
            "x": 336,
            "y": 183,
            "page": 3
          },
          {
            "x": 376,
            "y": 182,
            "page": 3
          },
          {
            "x": 411,
            "y": 182,
            "page": 3
          }
        ]
      },
      {
        "id": 27,
        "texto": "Los problemas con mis familiares los resolvemos de manera amistosa",
        "coords": [
          {
            "x": 271,
            "y": 150,
            "page": 3
          },
          {
            "x": 304,
            "y": 150,
            "page": 3
          },
          {
            "x": 339,
            "y": 152,
            "page": 3
          },
          {
            "x": 370,
            "y": 151,
            "page": 3
          },
          {
            "x": 402,
            "y": 152,
            "page": 3
          }
        ]
      },
      {
        "id": 28,
        "texto": "Mis problemas personales o familiares afectan mis relaciones en el trabajo",
        "coords": [
          {
            "x": 273,
            "y": 489,
            "page": 4
          },
          {
            "x": 313,
            "y": 489,
            "page": 4
          },
          {
            "x": 345,
            "y": 491,
            "page": 4
          },
          {
            "x": 376,
            "y": 489,
            "page": 4
          },
          {
            "x": 408,
            "y": 489,
            "page": 4
          }
        ]
      },
      {
        "id": 29,
        "texto": "El dinero que ganamos en el hogar alcanza para cubrir los gastos básicos",
        "coords": [
          {
            "x": 278,
            "y": 466,
            "page": 4
          },
          {
            "x": 310,
            "y": 465,
            "page": 4
          },
          {
            "x": 347,
            "y": 463,
            "page": 4
          },
          {
            "x": 379,
            "y": 465,
            "page": 4
          },
          {
            "x": 408,
            "y": 465,
            "page": 4
          }
        ]
      },
      {
        "id": 30,
        "texto": "Tengo otros compromisos económicos que afectan mucho el presupuesto familiar",
        "coords": [
          {
            "x": 272,
            "y": 431,
            "page": 4
          },
          {
            "x": 308,
            "y": 435,
            "page": 4
          },
          {
            "x": 346,
            "y": 435,
            "page": 4
          },
          {
            "x": 377,
            "y": 436,
            "page": 4
          },
          {
            "x": 414,
            "y": 437,
            "page": 4
          }
        ]
      },
      {
        "id": 31,
        "texto": "En mi hogar tenemos deudas difíciles de pagar",
        "coords": [
          {
            "x": 273,
            "y": 405,
            "page": 4
          },
          {
            "x": 310,
            "y": 408,
            "page": 4
          },
          {
            "x": 351,
            "y": 408,
            "page": 4
          },
          {
            "x": 387,
            "y": 407,
            "page": 4
          },
          {
            "x": 411,
            "y": 409,
            "page": 4
          }
        ]
      }
    ]
  }
];

// Estrés questions
export const estresQuestions: SurveyQuestion[] = [
  {
    "id": 1,
    "texto": "Dolores en el cuello y espalda o tensión muscular",
    "coords": [
      {
        "x": 300,
        "y": 458,
        "page": 1
      },
      {
        "x": 334,
        "y": 459,
        "page": 1
      },
      {
        "x": 373,
        "y": 457,
        "page": 1
      },
      {
        "x": 410,
        "y": 458,
        "page": 1
      }
    ]
  },
  {
    "id": 2,
    "texto": "Problemas gastrointestinales, úlcera péptica, acidez, problemas digestivos o del colon",
    "coords": [
      {
        "x": 302,
        "y": 444,
        "page": 1
      },
      {
        "x": 338,
        "y": 444,
        "page": 1
      },
      {
        "x": 375,
        "y": 444,
        "page": 1
      },
      {
        "x": 408,
        "y": 443,
        "page": 1
      }
    ]
  },
  {
    "id": 3,
    "texto": "Problemas respiratorios",
    "coords": [
      {
        "x": 303,
        "y": 431,
        "page": 1
      },
      {
        "x": 336,
        "y": 430,
        "page": 1
      },
      {
        "x": 375,
        "y": 430,
        "page": 1
      },
      {
        "x": 411,
        "y": 429,
        "page": 1
      }
    ]
  },
  {
    "id": 4,
    "texto": "Dolor de cabeza",
    "coords": [
      {
        "x": 301,
        "y": 419,
        "page": 1
      },
      {
        "x": 337,
        "y": 419,
        "page": 1
      },
      {
        "x": 373,
        "y": 417,
        "page": 1
      },
      {
        "x": 410,
        "y": 419,
        "page": 1
      }
    ]
  },
  {
    "id": 5,
    "texto": "Trastornos del sueño como somnolencia durante el día o desvelo en la noche",
    "coords": [
      {
        "x": 301,
        "y": 405,
        "page": 1
      },
      {
        "x": 334,
        "y": 405,
        "page": 1
      },
      {
        "x": 371,
        "y": 403,
        "page": 1
      },
      {
        "x": 408,
        "y": 404,
        "page": 1
      }
    ]
  },
  {
    "id": 6,
    "texto": "Palpitaciones en el pecho o problemas cardiacos",
    "coords": [
      {
        "x": 300,
        "y": 390,
        "page": 1
      },
      {
        "x": 335,
        "y": 391,
        "page": 1
      },
      {
        "x": 373,
        "y": 391,
        "page": 1
      },
      {
        "x": 409,
        "y": 391,
        "page": 1
      }
    ]
  },
  {
    "id": 7,
    "texto": "Cambios fuertes del apetito",
    "coords": [
      {
        "x": 302,
        "y": 379,
        "page": 1
      },
      {
        "x": 335,
        "y": 380,
        "page": 1
      },
      {
        "x": 370,
        "y": 380,
        "page": 1
      },
      {
        "x": 408,
        "y": 379,
        "page": 1
      }
    ]
  },
  {
    "id": 8,
    "texto": "Problemas relacionados con la función de los órganos genitales (impotencia, frigidez)",
    "coords": [
      {
        "x": 302,
        "y": 365,
        "page": 1
      },
      {
        "x": 338,
        "y": 365,
        "page": 1
      },
      {
        "x": 369,
        "y": 365,
        "page": 1
      },
      {
        "x": 413,
        "y": 365,
        "page": 1
      }
    ]
  },
  {
    "id": 9,
    "texto": "Dificultad en las relaciones familiares",
    "coords": [
      {
        "x": 303,
        "y": 352,
        "page": 1
      },
      {
        "x": 339,
        "y": 352,
        "page": 1
      },
      {
        "x": 373,
        "y": 352,
        "page": 1
      },
      {
        "x": 408,
        "y": 352,
        "page": 1
      }
    ]
  },
  {
    "id": 10,
    "texto": "Dificultad para permanecer quieto o dificultad para iniciar actividades",
    "coords": [
      {
        "x": 301,
        "y": 338,
        "page": 1
      },
      {
        "x": 334,
        "y": 339,
        "page": 1
      },
      {
        "x": 374,
        "y": 337,
        "page": 1
      },
      {
        "x": 413,
        "y": 337,
        "page": 1
      }
    ]
  },
  {
    "id": 11,
    "texto": "Dificultad en las relaciones con otras personas",
    "coords": [
      {
        "x": 301,
        "y": 324,
        "page": 1
      },
      {
        "x": 337,
        "y": 325,
        "page": 1
      },
      {
        "x": 376,
        "y": 325,
        "page": 1
      },
      {
        "x": 412,
        "y": 323,
        "page": 1
      }
    ]
  },
  {
    "id": 12,
    "texto": "Sensación de aislamiento y desinterés",
    "coords": [
      {
        "x": 301,
        "y": 313,
        "page": 1
      },
      {
        "x": 336,
        "y": 313,
        "page": 1
      },
      {
        "x": 373,
        "y": 313,
        "page": 1
      },
      {
        "x": 413,
        "y": 311,
        "page": 1
      }
    ]
  },
  {
    "id": 13,
    "texto": "Sentimiento de sobrecarga de trabajo",
    "coords": [
      {
        "x": 299,
        "y": 301,
        "page": 1
      },
      {
        "x": 335,
        "y": 302,
        "page": 1
      },
      {
        "x": 371,
        "y": 302,
        "page": 1
      },
      {
        "x": 413,
        "y": 301,
        "page": 1
      }
    ]
  },
  {
    "id": 14,
    "texto": "Dificultad para concentrarse, olvidos frecuentes",
    "coords": [
      {
        "x": 301,
        "y": 290,
        "page": 1
      },
      {
        "x": 339,
        "y": 291,
        "page": 1
      },
      {
        "x": 370,
        "y": 291,
        "page": 1
      },
      {
        "x": 413,
        "y": 291,
        "page": 1
      }
    ]
  },
  {
    "id": 15,
    "texto": "Aumento en el número de accidentes de trabajo",
    "coords": [
      {
        "x": 305,
        "y": 280,
        "page": 1
      },
      {
        "x": 335,
        "y": 279,
        "page": 1
      },
      {
        "x": 373,
        "y": 279,
        "page": 1
      },
      {
        "x": 417,
        "y": 279,
        "page": 1
      }
    ]
  },
  {
    "id": 16,
    "texto": "Sentimiento de frustración, de no haber hecho lo que se quería en la vida",
    "coords": [
      {
        "x": 301,
        "y": 265,
        "page": 1
      },
      {
        "x": 339,
        "y": 265,
        "page": 1
      },
      {
        "x": 370,
        "y": 265,
        "page": 1
      },
      {
        "x": 411,
        "y": 265,
        "page": 1
      }
    ]
  },
  {
    "id": 17,
    "texto": "Cansancio, tedio o desgano",
    "coords": [
      {
        "x": 303,
        "y": 251,
        "page": 1
      },
      {
        "x": 333,
        "y": 251,
        "page": 1
      },
      {
        "x": 369,
        "y": 252,
        "page": 1
      },
      {
        "x": 410,
        "y": 251,
        "page": 1
      }
    ]
  },
  {
    "id": 18,
    "texto": "Disminución del rendimiento en el trabajo o poca creatividad",
    "coords": [
      {
        "x": 307,
        "y": 240,
        "page": 1
      },
      {
        "x": 333,
        "y": 241,
        "page": 1
      },
      {
        "x": 375,
        "y": 240,
        "page": 1
      },
      {
        "x": 412,
        "y": 240,
        "page": 1
      }
    ]
  },
  {
    "id": 19,
    "texto": "Deseo de no asistir al trabajo",
    "coords": [
      {
        "x": 301,
        "y": 229,
        "page": 1
      },
      {
        "x": 335,
        "y": 229,
        "page": 1
      },
      {
        "x": 373,
        "y": 229,
        "page": 1
      },
      {
        "x": 411,
        "y": 229,
        "page": 1
      }
    ]
  },
  {
    "id": 20,
    "texto": "Bajo compromiso o poco interés con lo que se hace",
    "coords": [
      {
        "x": 305,
        "y": 218,
        "page": 1
      },
      {
        "x": 333,
        "y": 218,
        "page": 1
      },
      {
        "x": 369,
        "y": 218,
        "page": 1
      },
      {
        "x": 411,
        "y": 218,
        "page": 1
      }
    ]
  },
  {
    "id": 21,
    "texto": "Dificultad para tomar decisiones",
    "coords": [
      {
        "x": 303,
        "y": 205,
        "page": 1
      },
      {
        "x": 337,
        "y": 205,
        "page": 1
      },
      {
        "x": 373,
        "y": 206,
        "page": 1
      },
      {
        "x": 415,
        "y": 207,
        "page": 1
      }
    ]
  },
  {
    "id": 22,
    "texto": "Deseo de cambiar de empleo",
    "coords": [
      {
        "x": 307,
        "y": 195,
        "page": 1
      },
      {
        "x": 335,
        "y": 195,
        "page": 1
      },
      {
        "x": 375,
        "y": 195,
        "page": 1
      },
      {
        "x": 410,
        "y": 195,
        "page": 1
      }
    ]
  },
  {
    "id": 23,
    "texto": "Sentimiento de soledad y miedo",
    "coords": [
      {
        "x": 303,
        "y": 185,
        "page": 1
      },
      {
        "x": 333,
        "y": 185,
        "page": 1
      },
      {
        "x": 373,
        "y": 183,
        "page": 1
      },
      {
        "x": 409,
        "y": 185,
        "page": 1
      }
    ]
  },
  {
    "id": 24,
    "texto": "Sentimiento de irritabilidad, actitudes y pensamientos negativos",
    "coords": [
      {
        "x": 293,
        "y": 171,
        "page": 1
      },
      {
        "x": 342,
        "y": 171,
        "page": 1
      },
      {
        "x": 373,
        "y": 170,
        "page": 1
      },
      {
        "x": 409,
        "y": 172,
        "page": 1
      }
    ]
  },
  {
    "id": 25,
    "texto": "Sentimiento de angustia, preocupación o tristeza",
    "coords": [
      {
        "x": 303,
        "y": 157,
        "page": 1
      },
      {
        "x": 343,
        "y": 157,
        "page": 1
      },
      {
        "x": 372,
        "y": 157,
        "page": 1
      },
      {
        "x": 411,
        "y": 157,
        "page": 1
      }
    ]
  },
  {
    "id": 26,
    "texto": "Consumo de drogas para aliviar la tensión o los nervios",
    "coords": [
      {
        "x": 311,
        "y": 146,
        "page": 1
      },
      {
        "x": 337,
        "y": 147,
        "page": 1
      },
      {
        "x": 371,
        "y": 147,
        "page": 1
      },
      {
        "x": 407,
        "y": 147,
        "page": 1
      }
    ]
  },
  {
    "id": 27,
    "texto": "Sentimientos de que \"no vale nada\", o \"no sirve para nada\"",
    "coords": [
      {
        "x": 299,
        "y": 136,
        "page": 1
      },
      {
        "x": 336,
        "y": 135,
        "page": 1
      },
      {
        "x": 373,
        "y": 134,
        "page": 1
      },
      {
        "x": 412,
        "y": 134,
        "page": 1
      }
    ]
  },
  {
    "id": 28,
    "texto": "Consumo de bebidas alcohólicas o café o cigarrillo",
    "coords": [
      {
        "x": 303,
        "y": 124,
        "page": 1
      },
      {
        "x": 337,
        "y": 125,
        "page": 1
      },
      {
        "x": 381,
        "y": 124,
        "page": 1
      },
      {
        "x": 413,
        "y": 124,
        "page": 1
      }
    ]
  },
  {
    "id": 29,
    "texto": "Sentimiento de que está perdiendo la razón",
    "coords": [
      {
        "x": 299,
        "y": 114,
        "page": 1
      },
      {
        "x": 336,
        "y": 113,
        "page": 1
      },
      {
        "x": 373,
        "y": 113,
        "page": 1
      },
      {
        "x": 406,
        "y": 113,
        "page": 1
      }
    ]
  },
  {
    "id": 30,
    "texto": "Comportamientos rígidos, obstinación o terquedad",
    "coords": [
      {
        "x": 303,
        "y": 102,
        "page": 1
      },
      {
        "x": 333,
        "y": 103,
        "page": 1
      },
      {
        "x": 374,
        "y": 101,
        "page": 1
      },
      {
        "x": 415,
        "y": 102,
        "page": 1
      }
    ]
  },
  {
    "id": 31,
    "texto": "Sensación de no poder manejar los problemas de la vida",
    "coords": [
      {
        "x": 306,
        "y": 91,
        "page": 1
      },
      {
        "x": 332,
        "y": 90,
        "page": 1
      },
      {
        "x": 372,
        "y": 91,
        "page": 1
      },
      {
        "x": 409,
        "y": 89,
        "page": 1
      }
    ]
  }
];

// Ficha de datos generales
export const fichaQuestions: FichaQuestion[] = [
  {
    "id": 1,
    "texto": "Nombre completo",
    "tipo": "text",
    "coords": [
      {
        "x": 92,
        "y": 319,
        "page": 1
      }
    ]
  },
  {
    "id": 2,
    "texto": "Sexo",
    "tipo": "select",
    "opciones": [
      "Masculino",
      "Femenino",
      "No Binario"
    ],
    "coords": [
      {
        "x": 149,
        "y": 268,
        "page": 1
      },
      {
        "x": 149,
        "y": 255,
        "page": 1
      },
      {
        "x": 150,
        "y": 244,
        "page": 1
      }
    ]
  },
  {
    "id": 3,
    "texto": "Año de nacimiento",
    "tipo": "number",
    "coords": [
      {
        "x": 95,
        "y": 204,
        "page": 1
      }
    ]
  },
  {
    "id": 4,
    "texto": "Último nivel de estudios que alcanzó",
    "tipo": "select",
    "opciones": [
      "Ninguno",
      "Primaria incompleta",
      "Primaria completa",
      "Bachillerato incompleto",
      "Bachillerato completo",
      "Técnico/tecnológico incompleto",
      "Técnico/tecnológico completo",
      "Profesional incompleto",
      "Profesional completo",
      "Carrera militar / policía",
      "Posgrado incompleto",
      "Posgrado completo"
    ],
    "coords": [
      {
        "x": 241,
        "y": 500,
        "page": 2
      },
      {
        "x": 241,
        "y": 487,
        "page": 2
      },
      {
        "x": 241,
        "y": 475,
        "page": 2
      },
      {
        "x": 243,
        "y": 466,
        "page": 2
      },
      {
        "x": 243,
        "y": 455,
        "page": 2
      },
      {
        "x": 242,
        "y": 441,
        "page": 2
      },
      {
        "x": 243,
        "y": 431,
        "page": 2
      },
      {
        "x": 243,
        "y": 419,
        "page": 2
      },
      {
        "x": 243,
        "y": 410,
        "page": 2
      },
      {
        "x": 241,
        "y": 396,
        "page": 2
      },
      {
        "x": 242,
        "y": 385,
        "page": 2
      },
      {
        "x": 243,
        "y": 373,
        "page": 2
      }
    ]
  },
  {
    "id": 5,
    "texto": "¿Cuál es su ocupación o profesión?",
    "tipo": "text",
    "coords": [
      {
        "x": 94,
        "y": 333,
        "page": 2
      }
    ]
  },
  {
    "id": 6,
    "texto": "Lugar de residencia actual",
    "tipo": "text",
    "subfields": [
      {
        "label": "Ciudad/Municipio",
        "key": "ciudad_residencia"
      },
      {
        "label": "Departamento",
        "key": "departamento_residencia"
      }
    ],
    "coords": [
      {
        "x": 184,
        "y": 295,
        "page": 2
      },
      {
        "x": 185,
        "y": 283,
        "page": 2
      }
    ]
  },
  {
    "id": 7,
    "texto": "Estrato de los servicios públicos de su vivienda",
    "tipo": "select",
    "opciones": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Finca",
      "No sé"
    ],
    "coords": [
      {
        "x": 97,
        "y": 244,
        "page": 2
      },
      {
        "x": 98,
        "y": 232,
        "page": 2
      },
      {
        "x": 99,
        "y": 221,
        "page": 2
      },
      {
        "x": 134,
        "y": 244,
        "page": 2
      },
      {
        "x": 137,
        "y": 232,
        "page": 2
      },
      {
        "x": 138,
        "y": 219,
        "page": 2
      },
      {
        "x": 181,
        "y": 243,
        "page": 2
      },
      {
        "x": 180,
        "y": 230,
        "page": 2
      }
    ]
  },
  {
    "id": 8,
    "texto": "Tipo de vivienda",
    "tipo": "radio",
    "opciones": [
      "Propia",
      "En arriendo",
      "Familiar"
    ],
    "coords": [
      {
        "x": 163,
        "y": 181,
        "page": 2
      },
      {
        "x": 164,
        "y": 169,
        "page": 2
      },
      {
        "x": 164,
        "y": 157,
        "page": 2
      }
    ]
  },
  {
    "id": 9,
    "texto": "Número de personas que dependen económicamente de usted (aunque vivan en otro lugar)",
    "tipo": "number",
    "coords": [
      {
        "x": 345,
        "y": 127,
        "page": 2
      }
    ]
  },
  {
    "id": 10,
    "texto": "Lugar donde trabaja actualmente",
    "tipo": "text",
    "subfields": [
      {
        "label": "Ciudad/Municipio",
        "key": "ciudad_trabajo"
      },
      {
        "label": "Departamento",
        "key": "departamento_trabajo"
      }
    ],
    "coords": [
      {
        "x": 191,
        "y": 499,
        "page": 3
      },
      {
        "x": 192,
        "y": 489,
        "page": 3
      }
    ]
  },
  {
    "id": 11,
    "texto": "¿Hace cuántos años que trabaja en esta empresa?",
    "tipo": "years",
    "coords": [
      {
        "x": 293,
        "y": 438,
        "page": 3
      }
    ]
  },
  {
    "id": 12,
    "texto": "¿Cuál es el nombre del cargo que ocupa en la empresa?",
    "tipo": "text",
    "coords": [
      {
        "x": 97,
        "y": 373,
        "page": 3
      }
    ]
  },
  {
    "id": 13,
    "texto": "Seleccione el tipo de cargo que más se parece al que usted desempeña",
    "tipo": "select",
    "opciones": [
      "Jefatura - tiene personal a cargo",
      "Profesional, analista, técnico, tecnólogo",
      "Auxiliar, asistente administrativo, asistente técnico",
      "Operario, operador, ayudante, servicios generales"
    ],
    "coords": [
      {
        "x": 315,
        "y": 295,
        "page": 3
      },
      {
        "x": 313,
        "y": 283,
        "page": 3
      },
      {
        "x": 313,
        "y": 271,
        "page": 3
      },
      {
        "x": 312,
        "y": 261,
        "page": 3
      }
    ]
  },
  {
    "id": 14,
    "texto": "¿Hace cuántos años que desempeña el cargo u oficio actual en esta empresa?",
    "tipo": "years",
    "coords": [
      {
        "x": 296,
        "y": 201,
        "page": 3
      }
    ]
  },
  {
    "id": 15,
    "texto": "Nombre del departamento, área o sección de la empresa en el que trabaja",
    "tipo": "text",
    "coords": [
      {
        "x": 99,
        "y": 145,
        "page": 3
      }
    ]
  },
  {
    "id": 16,
    "texto": "Tipo de contrato que tiene actualmente",
    "tipo": "select",
    "opciones": [
      "Temporal de menos de 1 año",
      "Temporal de 1 año o más",
      "Término indefinido",
      "Cooperado (cooperativa)",
      "Prestación de servicios",
      "No sé"
    ],
    "coords": [
      {
        "x": 219,
        "y": 499,
        "page": 4
      },
      {
        "x": 219,
        "y": 489,
        "page": 4
      },
      {
        "x": 218,
        "y": 476,
        "page": 4
      },
      {
        "x": 218,
        "y": 465,
        "page": 4
      },
      {
        "x": 219,
        "y": 455,
        "page": 4
      },
      {
        "x": 219,
        "y": 444,
        "page": 4
      }
    ]
  },
  {
    "id": 17,
    "texto": "Horas diarias de trabajo establecidas por la empresa para su cargo",
    "tipo": "number",
    "coords": [
      {
        "x": 265,
        "y": 391,
        "page": 4
      }
    ]
  },
  {
    "id": 18,
    "texto": "Tipo de salario que recibe",
    "tipo": "radio",
    "opciones": [
      "Fijo (diario, semanal, quincenal o mensual)",
      "Una parte fija y otra variable",
      "Todo variable (a destajo, por producción, por comisión)"
    ],
    "coords": [
      {
        "x": 308,
        "y": 313,
        "page": 4
      },
      {
        "x": 311,
        "y": 301,
        "page": 4
      },
      {
        "x": 312,
        "y": 285,
        "page": 4
      }
    ]
  }
];

// Consentimiento Informado fields
export const consentimientoFields: ConsentimientoField[] = [
  {
    "id": "fecha_dia",
    "label": "Fecha: Día",
    "coords": [
      {
        "x": 383,
        "y": 637,
        "page": 1
      }
    ]
  },
  {
    "id": "fecha_mes",
    "label": "Fecha: Mes",
    "coords": [
      {
        "x": 443,
        "y": 637,
        "page": 1
      }
    ]
  },
  {
    "id": "fecha_ano",
    "label": "Fecha: Año",
    "coords": [
      {
        "x": 500,
        "y": 637,
        "page": 1
      }
    ]
  },
  {
    "id": "ciudad",
    "label": "Ciudad",
    "coords": [
      {
        "x": 93,
        "y": 562,
        "page": 1
      }
    ]
  },
  {
    "id": "cedula_1",
    "label": "Número de Cédula (Primera aparición)",
    "coords": [
      {
        "x": 299,
        "y": 580,
        "page": 1
      }
    ]
  },
  {
    "id": "nombre",
    "label": "Nombre Completo",
    "coords": [
      {
        "x": 107,
        "y": 603,
        "page": 1
      }
    ]
  },
  {
    "id": "cedula_2",
    "label": "Número de Cédula (Segunda aparición)",
    "coords": [
      {
        "x": 375,
        "y": 144,
        "page": 1
      }
    ]
  },
  {
    "id": "firma",
    "label": "Firma",
    "coords": [
      {
        "x": 126,
        "y": 143,
        "page": 1
      }
    ]
  },
  {
    "id": "empresa",
    "label": "Nombre de la Empresa",
    "coords": [
      {
        "x": 91,
        "y": 497,
        "page": 1
      }
    ]
  }
];
