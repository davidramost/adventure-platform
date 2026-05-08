-- ============================================================
-- DATOS: 50 RUTAS DE SENDERISMO EN CÓRDOBA
-- Fuente: AllTrails.com/es/spain/cordoba
-- Generado: 2026
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;
-- --------------------------------------------------------
-- UBICACIONES REFERENCIADAS POR LAS RUTAS
-- ON DUPLICATE KEY UPDATE: inserta si no existe, actualiza si ya existe
-- --------------------------------------------------------
INSERT INTO `ubicacion` (`id_ubicacion`, `nombre`, `latitud`, `longitud`)
VALUES (
        1,
        'Santa María de Trassierra',
        37.93510000,
        -4.89420000
    ),
    (
        3,
        'Las Ermitas',
        37.91670000,
        -4.89900000
    ),
    (
        4,
        'Zuheros',
        37.53470000,
        -4.31920000
    ),
    (
        6,
        'Cerro Muriano',
        38.00150000,
        -4.76800000
    ),
    (
        8,
        'Las Jaras',
        37.96900000,
        -4.82500000
    ),
    (
        10,
        'Vía Verde de la Subbética',
        37.55800000,
        -4.27500000
    ),
    (
        18,
        'Córdoba',
        37.88470000,
        -4.77940000
    ),
    (
        20,
        'Hornachuelos',
        37.84390000,
        -5.20970000
    ),
    (
        21,
        'Iznájar',
        37.26170000,
        -4.31390000
    ),
    (
        22,
        'Lucena',
        37.40880000,
        -4.48550000
    ),
    (
        23,
        'Cabra',
        37.47240000,
        -4.44100000
    ),
    (
        24,
        'Baena',
        37.61520000,
        -4.32540000
    ),
    (
        25,
        'Cardeña',
        38.27000000,
        -4.35000000
    ),
    (
        26,
        'Doña Mencía',
        37.54830000,
        -4.35110000
    ) ON DUPLICATE KEY
UPDATE `nombre` =
VALUES(`nombre`),
    `latitud` =
VALUES(`latitud`),
    `longitud` =
VALUES(`longitud`);
-- --------------------------------------------------------
-- 50 RUTAS DE SENDERISMO EN CÓRDOBA
-- id_usuario = 9 (daten)
-- --------------------------------------------------------
INSERT INTO `ruta` (
        `id_usuario`,
        `id_ubicacion`,
        `titulo`,
        `nombre_ruta`,
        `descripcion`,
        `distancia_km`,
        `duracion_estimada`,
        `dificultad`,
        `desnivel_metros`,
        `imagen_url`
    )
VALUES -- 1
    (
        9,
        4,
        'Zuheros - Cañón del Río Bailón',
        'Zuheros - Cañón del Río Bailón',
        'Ruta circular de senderismo que discurre por el Parque Natural de las Sierras Subbéticas, en Zuheros. El sendero recorre el espectacular Cañón del Río Bailón, una profunda garganta caliza de gran belleza.',
        12.4,
        '4,5-5 h',
        'Moderada',
        549,
        'https://assets.alltrails.com/uploads/photo/image/113936033/540582f74bd121e3962ba2c35adfd3a8.jpg'
    ),
    -- 2
    (
        9,
        18,
        'Paseo de Córdoba - Río Guadalquivir - Plaza de la Corredera',
        'Paseo de Córdoba - Río Guadalquivir - Plaza de la Corredera',
        'Paseo urbano por el corazón histórico de Córdoba. La ruta comienza junto al río Guadalquivir y discurre por la Ribera, pasando por el Puente Romano y la Mezquita-Catedral hasta la animada Plaza de la Corredera.',
        7.6,
        '1,5-2 h',
        'Moderada',
        80,
        'https://assets.alltrails.com/uploads/photo/image/115019934/e49b4347ebc95dc83616c5c08de917ed.jpg'
    ),
    -- 3
    (
        9,
        1,
        'Bejarano - Baños de Popea vía GR®48 Sierra Morena',
        'Bejarano - Baños de Popea vía GR®48 Sierra Morena',
        'Ruta circular que recorre el entorno del Arroyo Bejarano y llega hasta los Baños de Popea siguiendo el sendero GR®48 de Sierra Morena, con bonitas vistas de la Sierra Cordobesa.',
        7.7,
        '2-2,5 h',
        'Moderada',
        320,
        'https://assets.alltrails.com/uploads/photo/image/52728094/d374ddb73f10fd2d0d23d8450c5313fb.jpg'
    ),
    -- 4
    (
        9,
        18,
        'Córdoba: Puerta de Almodóvar - Torre de la Calahorra',
        'Córdoba: Puerta de Almodóvar - Torre de la Calahorra',
        'Paseo histórico por el casco antiguo de Córdoba. El recorrido comienza en la Puerta de Almodóvar, una de las puertas medievales mejor conservadas de la muralla romana, y termina en la Torre de la Calahorra.',
        3.5,
        '0,5-1 h',
        'Fácil',
        50,
        NULL
    ),
    -- 5
    (
        9,
        18,
        'Parque de la Asomadilla - Meseta Blanca',
        'Parque de la Asomadilla - Meseta Blanca',
        'Ruta de senderismo y running por los alrededores de Córdoba. La ruta es popular entre los corredores locales y permite disfrutar de los parques y zonas verdes del cinturón periurbano de la ciudad.',
        14.3,
        NULL,
        'Moderada',
        450,
        NULL
    ),
    -- 6
    (
        9,
        18,
        'El Naranjo - Ermita Santo Domingo - Sendero Arroyo Santo Domingo',
        'El Naranjo - Ermita Santo Domingo - Sendero Arroyo Santo Domingo',
        'Ruta circular por la sierra cordobesa que parte desde El Naranjo, pasa junto a la Ermita de Santo Domingo y regresa por el Sendero del Arroyo Santo Domingo, disfrutando de bonitas vistas de Córdoba.',
        12.4,
        '3,5-4 h',
        'Moderada',
        380,
        NULL
    ),
    -- 7
    (
        9,
        3,
        'Subida al Reventón',
        'Subida al Reventón',
        'Bonita ruta de senderismo de subida hasta el Reventón, el punto más alto de los alrededores de Córdoba, con magníficas panorámicas sobre la ciudad y la campiña.',
        4.3,
        '1,5-2 h',
        'Moderada',
        250,
        NULL
    ),
    -- 8
    (
        9,
        4,
        'Sendero del Río Bailón',
        'Sendero del Río Bailón',
        'Ruta de senderismo por el Parque Natural de las Sierras Subbéticas que sigue el curso del Río Bailón, discurriendo entre impresionantes paredes calizas y una exuberante vegetación ribereña.',
        11.9,
        '3-3,5 h',
        'Moderada',
        420,
        NULL
    ),
    -- 9
    (
        9,
        18,
        'Ermita de Santo Domingo - La Pili - Arroyo Barrionuevo',
        'Ermita de Santo Domingo - La Pili - Arroyo Barrionuevo',
        'Ruta circular en las inmediaciones de las Ermitas de Córdoba, pasando por el mirador de La Pili y el Arroyo Barrionuevo, con vistas privilegiadas de la ciudad y la Sierra.',
        7.4,
        '2,5-3 h',
        'Moderada',
        280,
        NULL
    ),
    -- 10
    (
        9,
        20,
        'Hornachuelos - Sendero Los Ángeles',
        'Hornachuelos - Sendero Los Ángeles',
        'Ruta de senderismo en el Parque Natural de la Sierra de Hornachuelos. El sendero Los Ángeles atraviesa un magnífico bosque mediterráneo con abundante fauna y flora.',
        10.5,
        '3-3,5 h',
        'Moderada',
        350,
        NULL
    ),
    -- 11
    (
        9,
        18,
        'Arroyo Santo Domingo - Casa Rota - Arroyo Pedroches',
        'Arroyo Santo Domingo - Casa Rota - Arroyo Pedroches',
        'Ruta circular que parte del Arroyo Santo Domingo, pasa por el área recreativa de Casa Rota y regresa por el Arroyo Pedroches, recorriendo los bosques de pinos y eucaliptos de la sierra cordobesa.',
        7.1,
        '2-2,5 h',
        'Moderada',
        230,
        NULL
    ),
    -- 12
    (
        9,
        20,
        'Hornachuelos - Sendero Los Ángeles (ruta alternativa)',
        'Hornachuelos - Sendero Los Ángeles (ruta alternativa)',
        'Segunda versión del sendero Los Ángeles en el Parque Natural de Hornachuelos, con un trazado ligeramente diferente que permite explorar distintos rincones del bosque mediterráneo.',
        10.6,
        '3,5-4 h',
        'Moderada',
        350,
        NULL
    ),
    -- 13
    (
        9,
        4,
        'Paseo por Zuheros',
        'Paseo por Zuheros',
        'Agradable paseo por el pintoresco pueblo de Zuheros, declarado uno de los pueblos más bonitos de España, con sus calles empedradas y magníficas vistas a las Sierras Subbéticas.',
        2.3,
        '0,5-1 h',
        'Fácil',
        80,
        NULL
    ),
    -- 14
    (
        9,
        3,
        'Cuesta de los Pobres - Balcón del Mundo',
        'Cuesta de los Pobres - Balcón del Mundo',
        'Corto pero intenso recorrido que asciende desde la Cuesta de los Pobres hasta el mirador del Balcón del Mundo, con extraordinarias vistas panorámicas de Córdoba y su entorno.',
        3.5,
        '1-1,5 h',
        'Moderada',
        200,
        NULL
    ),
    -- 15
    (
        9,
        21,
        'Paseo por Iznájar',
        'Paseo por Iznájar',
        'Agradable paseo por la localidad de Iznájar y sus alrededores, con vistas al embalse de Iznájar, el mayor de Andalucía, y al pintoresco casco urbano coronado por su castillo medieval.',
        4.3,
        '1,5-2 h',
        'Moderada',
        150,
        NULL
    ),
    -- 16
    (
        9,
        18,
        'Cuesta de la Traición - Los Morales - Vereda del Villar',
        'Cuesta de la Traición - Los Morales - Vereda del Villar',
        'Ruta circular por la sierra cordobesa que recorre la Cuesta de la Traición, pasa por Los Morales y regresa por la Vereda del Villar, con bonitas vistas del entorno natural.',
        6.1,
        '2-2,5 h',
        'Moderada',
        300,
        NULL
    ),
    -- 17
    (
        9,
        20,
        'Sendero Las Herrerías',
        'Sendero Las Herrerías',
        'Ruta de senderismo por el Parque Natural de la Sierra de Hornachuelos que discurre por el sendero de Las Herrerías, atravesando un denso bosque mediterráneo.',
        6.0,
        '1,5-2 h',
        'Moderada',
        250,
        NULL
    ),
    -- 18
    (
        9,
        23,
        'Cabra - Doña Mencía vía Vía Verde de la Subbética',
        'Cabra - Doña Mencía vía Vía Verde de la Subbética',
        'Larga ruta en bicicleta de montaña o a pie que sigue el trazado de la Vía Verde de la Subbética entre Cabra y Doña Mencía, por el corazón de la campiña cordobesa.',
        26.9,
        '6,5-7 h',
        'Moderada',
        380,
        NULL
    ),
    -- 19
    (
        9,
        4,
        'Pecho del Canalizo',
        'Pecho del Canalizo',
        'Ruta circular por los alrededores de Zuheros que asciende hasta el Pecho del Canalizo, con espectaculares vistas del Cañón del Río Bailón y las Sierras Subbéticas.',
        7.7,
        '2-2,5 h',
        'Moderada',
        280,
        NULL
    ),
    -- 20
    (
        9,
        10,
        'Vía Verde del Aceite: Lucena - Cabra',
        'Vía Verde del Aceite: Lucena - Cabra',
        'Ruta lineal por la Vía Verde del Aceite entre Lucena y Cabra, siguiendo el antiguo trazado del ferrocarril olivarero por la campiña cordobesa, con extensos olivares y suaves lomas.',
        16.6,
        '4-4,5 h',
        'Moderada',
        200,
        NULL
    ),
    -- 21
    (
        9,
        3,
        'Vereda del Villar - Sendero del Lobo - Balcón del Mundo',
        'Vereda del Villar - Sendero del Lobo - Balcón del Mundo',
        'Extensa ruta circular por la sierra cordobesa que recorre la Vereda del Villar, el Sendero del Lobo y sube hasta el mirador del Balcón del Mundo.',
        12.9,
        '4-4,5 h',
        'Moderada',
        420,
        NULL
    ),
    -- 22
    (
        9,
        1,
        'Camino Río - Baños de Popea - Minas Romanas de Cobre del Bejarano',
        'Camino Río - Baños de Popea - Minas Romanas de Cobre del Bejarano',
        'Ruta que combina el paseo por el Camino Río con la visita a los Baños de Popea y las antiguas Minas Romanas de Cobre del Bejarano, en el entorno de Santa María de Trassierra.',
        6.1,
        '2-2,5 h',
        'Moderada',
        250,
        NULL
    ),
    -- 23
    (
        9,
        22,
        'Camino Mozárabe de Málaga: Lucena - Cabra',
        'Camino Mozárabe de Málaga: Lucena - Cabra',
        'Etapa del Camino Mozárabe de Santiago que discurre por la comarca de la Subbética cordobesa entre Lucena y Cabra, cruzando olivares y campos de labor.',
        13.7,
        '3-3,5 h',
        'Moderada',
        280,
        NULL
    ),
    -- 24
    (
        9,
        18,
        'Cerro de Almadenejo',
        'Cerro de Almadenejo',
        'Ruta de senderismo por el entorno del Cerro de Almadenejo, en los alrededores de Córdoba. La ruta transcurre por el monte donde a lo largo de los pinares se puede disfrutar de la belleza de la naturaleza de la zona. Existen bancos para sentarse a descansar y reponer energía en varios tramos de la ruta. El embalse de Puente Nuevo se aprecia durante prácticamente todo el recorrido.',
        7.2,
        '2,5-3 h',
        'Moderada',
        300,
        NULL
    ),
    -- 25
    (
        9,
        23,
        'Sendero de Santa Rita - Enrique Triano',
        'Sendero de Santa Rita - Enrique Triano',
        'Este sendero empieza en el Centro de Visitantes de Santa Rita y se llamaba previamente solo Sendero de Santa Rita, pero fue cambiado a Sendero Enrique Triano en honor al naturalista natural de Cabra. Esta ruta es exclusivamente peatonal, quedando prohibido el paso a bicicletas y a caballos.',
        3.5,
        '1,5-2 h',
        'Moderada',
        180,
        NULL
    ),
    -- 26
    (
        9,
        8,
        'Puente de los Arenales',
        'Puente de los Arenales',
        'Bonita y agradable ruta hasta el Puente Romano de los Arenales que discurre a las orillas del río Guadiato. Parte del sendero pasa por la GR48 de Sierra Morena.',
        19.0,
        '5-5,5 h',
        'Difícil',
        580,
        NULL
    ),
    -- 27
    (
        9,
        6,
        'Cerro Muriano',
        'Cerro Muriano',
        'Ruta de senderismo que forma parte del Camino de Santiago. La ruta es parte del Camino Mozárabe y ofrece una variedad de actividades. A lo largo de la ruta se pueden observar marcas propias del Camino de Santiago como cruceiros, mojones y la distintiva flecha amarilla.',
        26.9,
        '7,5-8 h',
        'Difícil',
        780,
        NULL
    ),
    -- 28
    (
        9,
        20,
        'PR-A 348 Embalse del Bembézar',
        'PR-A 348 Embalse del Bembézar',
        'Esta ruta tiene lugar en el espectacular Parque Natural de Hornachuelos. Los visitantes pasean el tramo del río Bembézar desde el embalse hasta unos 3 kilómetros más. En la orilla opuesta se pueden descubrir acantilados que albergan una importante colonia de buitres.',
        9.8,
        '3-3,5 h',
        'Moderada',
        380,
        NULL
    ),
    -- 29
    (
        9,
        18,
        'Ruta BTT Canal del Guadalmellato - Cinturón Verde',
        'Ruta BTT Canal del Guadalmellato - Cinturón Verde',
        'Esta ruta es un circuito popular entre los ciclistas de BTT en Córdoba. El sendero se desarrolla principalmente a lo largo del trazado de la acequia del Canal del Guadalmellato, una importante obra de ingeniería hidráulica.',
        8.0,
        '2-2,5 h',
        'Moderada',
        120,
        NULL
    ),
    -- 30
    (
        9,
        1,
        'Anker - Los Villares Bajos',
        'Anker - Los Villares Bajos',
        'Bonita, breve y agradable ruta, perfecta para hacer a pie, corriendo o en bicicleta de montaña, por los alrededores de Córdoba. El recorrido comienza cerca del Área de Acampada de Los Villares, junto al camino GR®48 Sierra Morena.',
        3.2,
        '1-1,5 h',
        'Moderada',
        150,
        NULL
    ),
    -- 31
    (
        9,
        6,
        'Camino Mozárabe: Córdoba - Cerro Muriano',
        'Camino Mozárabe: Córdoba - Cerro Muriano',
        'Esta etapa del Camino Mozárabe lleva a los peregrinos desde la ciudad de Córdoba hasta Cerro Muriano. El camino comienza con un paseo por los barrios históricos de Córdoba y se cruza un puente romano restaurado sobre el arroyo de Pedroches.',
        18.2,
        '4,5-5 h',
        'Difícil',
        650,
        NULL
    ),
    -- 32
    (
        9,
        1,
        'PR A343 Vereda de Trassierra',
        'PR A343 Vereda de Trassierra',
        'Esta preciosa ruta de senderismo comienza en Córdoba en la Calle Rafael Rivas Gómez. El recorrido continúa por el sendero PR-A 343 Vereda de Trassierra, pasando por el Acueducto Romano de Valdepuente hasta llegar a Santa María de Trassierra.',
        17.2,
        '5-5,5 h',
        'Difícil',
        720,
        NULL
    ),
    -- 33
    (
        9,
        3,
        'Carretera de las Ermitas - Hy Baby - Subida al Reventón',
        'Carretera de las Ermitas - Hy Baby - Subida al Reventón',
        'Este recorrido circular es una opción alternativa a la clásica ruta a las Ermitas, subiendo al Reventón por el sendero Hy Baby. Se tienen unas vistas estupendas de la ciudad de Córdoba y se disfruta de una zona de bosque.',
        6.0,
        '2,5-3 h',
        'Difícil',
        480,
        NULL
    ),
    -- 34
    (
        9,
        24,
        'Camino Mozárabe: Baena - Castro del Río',
        'Camino Mozárabe: Baena - Castro del Río',
        'El Camino Mozárabe une en Baena los caminos procedentes de Almería, Jaén y Málaga. Castro del Río, que debe su nombre a un campamento romano, tiene una rica historia con un castillo medieval.',
        20.6,
        '5-5,5 h',
        'Moderada',
        350,
        NULL
    ),
    -- 35
    (
        9,
        6,
        'Ermita Virgen de Linares - Cerro Muriano',
        'Ermita Virgen de Linares - Cerro Muriano',
        'Bonita e intensa ruta de senderismo en constante ascenso desde la Ermita de la Virgen de Linares hasta Cerro Muriano. Se recomienda llevar buen calzado ya que hay tramos bastante pedregosos.',
        16.1,
        '4,5-5 h',
        'Difícil',
        680,
        NULL
    ),
    -- 36
    (
        9,
        18,
        'PR-A 53 - Camino de Servicio Canal del Guadalmellato',
        'PR-A 53 - Camino de Servicio Canal del Guadalmellato',
        'Bonita ruta por los alrededores de Alcolea, perfecta para hacer en bicicleta de montaña, corriendo o a pie. El recorrido sigue el sendero PR-A 53, rodeando el Montón de la Tierra y el Camino de Servicio Canal del Guadalmellato.',
        13.2,
        '3-3,5 h',
        'Moderada',
        200,
        NULL
    ),
    -- 37
    (
        9,
        1,
        'PR-A 211 Circular de Trassierra',
        'PR-A 211 Circular de Trassierra',
        'Esta ruta circular (PR-A 211) es un recorrido por la Sierra Morena de Córdoba, partiendo de Santa María de Trassierra. El camino utiliza vías pecuarias aptas tanto para caminantes como para ciclistas.',
        13.8,
        '4-4,5 h',
        'Difícil',
        550,
        NULL
    ),
    -- 38
    (
        9,
        23,
        'Ermita de la Sierra de Cabra - Las Chorreras',
        'Ermita de la Sierra de Cabra - Las Chorreras',
        'La Nava de Cabra es uno de los paisajes más bellos de Córdoba. El área es conocida por muchas especies endémicas, hermosos narcisos y prados multicolores. El santuario dedicado a la Virgen de la Sierra ofrece una magnífica atalaya.',
        17.2,
        '4,5-5 h',
        'Difícil',
        680,
        NULL
    ),
    -- 39
    (
        9,
        25,
        'Azuel - Cerro de la Colmena',
        'Azuel - Cerro de la Colmena',
        'Esta ruta discurre por el paisaje de dehesa y monte mediterráneo del Parque Natural Sierra de Cardeña y Montoro. Esta zona es famosa por ser uno de los últimos refugios del lince ibérico.',
        10.5,
        NULL,
        'Moderada',
        380,
        NULL
    ),
    -- 40
    (
        9,
        3,
        'Los Lobos',
        'Los Lobos',
        'Bonita, breve y sencilla ruta de senderismo por los alrededores de Córdoba. El recorrido comienza cerca del barrio El Brillante, junto a una antena, y continúa cogiendo el sendero Los Lobos.',
        4.5,
        '1-1,5 h',
        'Moderada',
        180,
        NULL
    ),
    -- 41
    (
        9,
        1,
        'Camino Río - GR®48 Sierra Morena',
        'Camino Río - GR®48 Sierra Morena',
        'Una bonita ruta senderista a las afueras de Santa María de Trassierra circulando por un frondoso bosque, pasando por un bonito río y cascada. La ruta sigue por el Camino Río hasta la Cascada y Baños de Popea volviendo por el sendero GR®48 Sierra Morena.',
        8.9,
        '2,5-3 h',
        'Moderada',
        280,
        NULL
    ),
    -- 42
    (
        9,
        8,
        'Las Jaras - Cortafuegos - Río Guadanuño - Sendero de Pedro López',
        'Las Jaras - Cortafuegos - Río Guadanuño - Sendero de Pedro López',
        'Esta ruta circular se sumerge en el ecosistema forestal de Córdoba, partiendo desde Las Jaras. El camino discurre entre densos bosques de encinas y alcornoques, pasando junto al río Guadanuño, con vegetación de ribera que crea un microclima fresco.',
        9.7,
        NULL,
        'Moderada',
        320,
        NULL
    ),
    -- 43
    (
        9,
        26,
        'Doña Mencía - Loma del Canijón',
        'Doña Mencía - Loma del Canijón',
        'Preciosa y divertida ruta a la Loma del Canijón, desde la población de Doña Mencía. El recorrido combina vegetación, vistas y el entorno mágico de las Sierras Subbéticas. Vistas excelentes desde la parte alta.',
        9.0,
        '3,5-4 h',
        'Moderada',
        350,
        NULL
    ),
    -- 44
    (
        9,
        23,
        'Sendero de la Ermita',
        'Sendero de la Ermita',
        'Esta bonita ruta comienza en Cabra y se dirige al Santuario de la Ermita Virgen de la Sierra a lo largo del Camino Góngora, donde se pueden observar quejigos gigantes y caballos andaluces. Este sendero es exclusivamente peatonal.',
        10.8,
        '4,5-5 h',
        'Difícil',
        520,
        NULL
    ),
    -- 45
    (
        9,
        4,
        'Vía Verde del Aceite: Zuheros - La Estación',
        'Vía Verde del Aceite: Zuheros - La Estación',
        'Esta ruta discurre por la Vía Verde del Aceite, un camino rural que comienza en Jaén y continúa hasta Córdoba. La vía fue en su día trazado ferroviario, siendo la más larga de Andalucía. Este recorrido empieza en Zuheros y continúa hasta La Estación.',
        15.0,
        '3,5-4 h',
        'Moderada',
        200,
        NULL
    ),
    -- 46
    (
        9,
        3,
        'San Pablo - Antenas - Arco',
        'San Pablo - Antenas - Arco',
        'Preciosa ruta de senderismo, perfecta también para BTT o trail-running a tan solo unos pocos kilómetros de Córdoba. El recorrido comienza al lado de la carretera CO-3408, siguiendo por el sendero San Pablo, una zona de antenas y vuelta por el camino Arco.',
        6.4,
        '2-2,5 h',
        'Moderada',
        200,
        NULL
    ),
    -- 47
    (
        9,
        23,
        'Ruta de Pico Bermejo',
        'Ruta de Pico Bermejo',
        'El Parque Natural Sierra Subbética está formado por materiales sedimentarios de origen marino. El Bermejo es uno de los picos más altos del parque. El sendero parte de la masía de Vichira, que aunque hoy está abandonada, conserva el esplendor de antaño.',
        15.9,
        NULL,
        'Difícil',
        750,
        NULL
    ),
    -- 48
    (
        9,
        18,
        'Camino Mozárabe: Santa Cruz - Córdoba',
        'Camino Mozárabe: Santa Cruz - Córdoba',
        'En esta última etapa hacia Córdoba se unen las dos rutas principales del sur que parten de Castro del Río. Se camina por carretera rural entre olivares y campos de cereales, terminando al cruzar el magnífico puente romano sobre el río Guadalquivir.',
        26.1,
        '6,5-7,5 h',
        'Moderada',
        500,
        NULL
    ),
    -- 49
    (
        9,
        20,
        'Río Guadalora - Ermita de San Abundio',
        'Río Guadalora - Ermita de San Abundio',
        'Este precioso recorrido comienza en el Parque Natural Sierra de Hornachuelos y permite disfrutar del entorno del río Guadalora y del bosque de ribera. Es un sendero perfecto para recorrer en los meses de otoño, invierno y primavera.',
        14.2,
        '4-4,5 h',
        'Moderada',
        350,
        NULL
    ),
    -- 50
    (
        9,
        23,
        'Sendero Los Pelaos',
        'Sendero Los Pelaos',
        'Este recorrido comienza en la Vía Verde del Aceite de Cabra y sigue el Camino de San Marcos hacia la Venta de los Pelaos. Durante el sendero se puede disfrutar de campos de olivos y vegetación variada como higueras, nogales o endrinos.',
        10.9,
        '3-3,5 h',
        'Moderada',
        280,
        NULL
    );
SET FOREIGN_KEY_CHECKS = 1;