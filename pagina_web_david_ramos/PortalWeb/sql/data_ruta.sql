USE rutas_app;

SET
    FOREIGN_KEY_CHECKS = 0;

DELETE FROM ruta;

ALTER TABLE ruta AUTO_INCREMENT = 1;

SET
    FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO usuario (id_usuario, nombre_usuario, password, email)
VALUES
    (
        1,
        'AdminCordoba',
        'password_segura',
        'admin@rutascordoba.es'
    );

INSERT INTO
    ruta (
        id_usuario,
        id_ubicacion,
        titulo,
        nombre_ruta,
        descripcion,
        distancia_km,
        duracion_estimada,
        dificultad,
        desnivel_metros,
        imagen_url
    )
VALUES
    (
        1,
        1,
        'Agua e Historia Milenaria',
        'Arroyo del Bejarano',
        'Esta emblemática ruta recorre uno de los enclaves naturales más valiosos de la Sierra Morena cordobesa. El sendero transcurre bajo un frondoso bosque en galería compuesto por alisos, fresnos y chopos. Durante el trayecto, los senderistas pueden contemplar las ruinas de antiguas minas romanas de cobre y los impresionantes Baños de Popea, una sucesión de cascadas y saltos de agua de gran belleza. Es un recorrido ideal para disfrutar del sonido del agua y la frescura de la vegetación califal.',
        10.5,
        '3h 30m',
        'Baja',
        300,
        'https://picsum.photos/id/1015/800/600'
    ),
    (
        1,
        2,
        'El Mirador Espiritual',
        'Sendero de las Ermitas',
        'Un recorrido espiritual e histórico que asciende por la ladera de la montaña hasta alcanzar el mirador del Sagrado Corazón de Jesús. El camino ofrece una transición fascinante entre la vegetación de monte bajo y los bosques de pinos y encinas. Una vez en la cima, las Ermitas de Córdoba ofrecen una de las vistas panorámicas más impresionantes de la ciudad, la vega del Guadalquivir y la campiña, permitiendo entender la ubicación estratégica de la ciudad desde las alturas.',
        12.0,
        '4h 00m',
        'Media',
        412,
        'https://picsum.photos/id/1036/800/600'
    ),
    (
        1,
        3,
        'Tesoro de las Subbéticas',
        'Río Bailón',
        'Ubicada en el corazón del Geoparque de las Sierras Subbéticas, esta ruta desciende por el espectacular cañón horadado por el río Bailón. El paisaje se caracteriza por imponentes formaciones de roca caliza, lapiaces y simas. El sendero comienza en el pintoresco pueblo de Zuheros y atraviesa poljes y valles donde es posible avistar buitres leonados y una flora endémica única. Es una experiencia de inmersión total en la geología y la naturaleza salvaje de la provincia de Córdoba.',
        12.5,
        '4h 30m',
        'Media',
        450,
        'https://picsum.photos/id/1016/800/600'
    ),
    (
        1,
        4,
        'Fortaleza sobre el Guadalquivir',
        'Castillo de Almodóvar',
        'Esta ruta combina naturaleza con una de las joyas del patrimonio militar de Andalucía. El ascenso a la colina del castillo ofrece vistas estratégicas del río Guadalquivir. La fortaleza, de origen árabe y reconstruida en la época cristiana, es famosa mundialmente por su excelente estado de conservación y por haber sido escenario de rodaje de series como Juego de Tronos. El camino rodea el embalse de la Breña, ofreciendo un contraste visual entre el azul del agua y el verde de la dehesa.',
        3.0,
        '1h 00m',
        'Media',
        150,
        'https://picsum.photos/id/1043/800/600'
    ),
    (
        1,
        5,
        'Huella Minera e Industrial',
        'Cerro Muriano',
        'Un viaje al pasado industrial y romano de la provincia. Esta ruta recorre el entorno de Cerro Muriano, explorando las antiguas explotaciones mineras de cobre que datan de la época del Imperio Romano. El sendero atraviesa zonas de matorral mediterráneo, jaras y acebuches, pasando por búnkeres de la Guerra Civil y restos de la Vía Augusta. Es una ruta perfecta para quienes buscan combinar el ejercicio físico con el descubrimiento de la arqueología industrial cordobesa.',
        10.0,
        '3h 30m',
        'Media',
        240,
        'https://picsum.photos/id/1040/800/600'
    );