-- ============================================================
-- TFG Adventure — productos_insert.sql
-- Fecha: 30 de abril de 2026
-- Descripción: ALTER TABLE + 50 productos de senderismo/escalada
-- ============================================================
-- 1. ALTER TABLE: añadir columna imagen
ALTER TABLE `producto`
ADD COLUMN `imagen` VARCHAR(500) DEFAULT NULL
AFTER `categoria`;
-- 2. 50 INSERT INTO productos de senderismo y montaña
INSERT INTO `producto` (
        `nombre`,
        `descripcion`,
        `precio`,
        `stock`,
        `categoria`,
        `imagen`
    )
VALUES -- CALZADO (8 productos)
    (
        'Bota de Trekking Waterproof MH500',
        'Bota de montaña con membrana impermeable, suela Contagrip y soporte de tobillo. Ideal para terrenos mixtos.',
        89.99,
        45,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Zapatilla Trail Running MT Cushion 3',
        'Zapatilla de trail con amortiguación máxima y protección en la puntera. Ligera y versátil para senderos técnicos.',
        64.99,
        60,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Bota de Alta Montaña Alpinism 100',
        'Bota rígida compatible con crampones de seguridad, forro Thinsulate y suela Vibram. Para ascensiones exigentes.',
        179.99,
        20,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Sandalia Trekking Arpenaz 500',
        'Sandalia cómoda con cierre rápido y suela antideslizante. Perfecta para rutas de baja dificultad en verano.',
        24.99,
        80,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Bota Senderismo Niño MH100',
        'Bota junior ligera e impermeable con velcro. Refuerzo en puntera y talón para mayor durabilidad.',
        39.99,
        35,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Zapatilla de Aproximación Simond Edge',
        'Zapatilla de aproximación con suela de fricción sticky rubber y puntera reforzada para vías ferrata.',
        74.99,
        25,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Bota Senderismo Ligera NH150',
        'Bota ultraligera (390g) con tratamiento DWR y suela flexisole. Cómoda desde el primer uso.',
        54.99,
        55,
        'Calzado',
        'https://picsum.photos/seed/1553062407/800/600'
    ),
    (
        'Calcetín Técnico Trekking Medio MT500',
        'Calcetín de merino con refuerzo en talón y puntera. Antibacteriano y termorregulador para largas jornadas.',
        14.99,
        100,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    -- MOCHILAS (7 productos)
    (
        'Mochila Senderismo 20L NH Arpenaz 20',
        'Mochila ligera y compacta con sistema de ventilación dorsal y tira pechera regulable. Ideal para salidas de un día.',
        19.99,
        70,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila Senderismo 40L NH Escape 500',
        'Mochila de trekking con sistema de carga Airstrech 3D, bolsillo de acceso lateral y funda de lluvia incluida.',
        59.99,
        40,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila Montaña 60L Forclaz 60',
        'Mochila de gran volumen para expediciones de varios días, espaldera regulable y cinturón de cadera anatómico.',
        89.99,
        25,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila de Día Hiking 10L NH100',
        'Mochila ultracompacta plegable en su propio bolsillo. Pesa solo 120g y aguanta hasta 8kg. Para llevar de reserva.',
        9.99,
        90,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila Escalada y Via Ferrata 22L',
        'Mochila técnica con soporte para casco en exterior, porta-material y tirantes ergonómicos. Semirrígida.',
        49.99,
        30,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila de Hidratación Trail 10L',
        'Mochila con reserva de agua de 2L incluida, porta-bastones y bolsillos elásticos en tirantes. Para trail running.',
        34.99,
        45,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    (
        'Mochila Trekking Mujer Arpenaz 30L',
        'Mochila especialmente diseñada para la anatomía femenina, con espalda ventilada y cinturón acolchado.',
        44.99,
        35,
        'Mochilas',
        'https://picsum.photos/seed/1548693846/800/600'
    ),
    -- ROPA (8 productos)
    (
        'Chubasquero Senderismo MH500',
        'Chaqueta impermeable 10.000mm con costuras soldadas, capucha ajustable y bolsillos con cremallera estanca.',
        49.99,
        50,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Forro Polar Trekking MH500 Fleece',
        'Polar de 300g/m² con forro antibollas, bolsillos con cremallera y cuello alto. Cálido y transpirable.',
        34.99,
        60,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Pantalón Trekking Convertible NH500',
        'Pantalón transformable en bermuda con cremallera. Tejido Ripstop resistente, secado rápido y tratamiento DWR.',
        29.99,
        65,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Camiseta Técnica Merino 100% Hombre',
        'Camiseta de lana merino 145g/m², regulación térmica natural, antibacteriana y secado rápido. Para todas las estaciones.',
        39.99,
        55,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Chaqueta Softshell Alpinism 100',
        'Chaqueta softshell con membrana windstop, 4 bolsillos y cierre central. Ligera y muy resistente al viento.',
        69.99,
        40,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Legging Trekking Mujer NH100',
        'Malla de montaña con tejido elástico 4 vías, costuras planas y bolsillo en la cintura. Cómoda en largas rutas.',
        19.99,
        70,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Poncho Lluvia Ultraligero NH',
        'Poncho impermeable plegable que cubre también la mochila. Pesa 120g y ocupa el espacio de un puño.',
        14.99,
        80,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    (
        'Chaleco Acolchado Down MH700',
        'Chaleco con relleno de plumón 90/10, compresible en su bolsillo y resistente a la humedad. Ligero (180g).',
        59.99,
        30,
        'Ropa',
        'https://picsum.photos/seed/1607522370275/800/600'
    ),
    -- BASTONES (3 productos)
    (
        'Bastones Plegables Trekking Arpenaz 900',
        'Bastones de carbono ultraligeros (240g/par) en 3 secciones con bloqueo rápido Flicklock y punta de tungsteno.',
        44.99,
        40,
        'Bastones',
        'https://picsum.photos/seed/1551632811/800/600'
    ),
    (
        'Bastones Aluminio NH100',
        'Bastones de aluminio resistentes con sistema de telescopaje suave. Incluye puntas de caucho para asfalto.',
        19.99,
        75,
        'Bastones',
        'https://picsum.photos/seed/1551632811/800/600'
    ),
    (
        'Bastón Nórdico Nordic Walking Light',
        'Bastón individual para caminata nórdica con empuñadura ergonómica de corcho y punta intercambiable.',
        24.99,
        50,
        'Bastones',
        'https://picsum.photos/seed/1551632811/800/600'
    ),
    -- ILUMINACIÓN (3 productos)
    (
        'Frontal LED Onnight 410 200 lúmenes',
        'Frontal con 3 modos de iluminación, resistente al agua IPX4 y autonomía de 6 horas. Incluye baterías.',
        19.99,
        85,
        'Iluminación',
        'https://picsum.photos/seed/1581822261/800/600'
    ),
    (
        'Frontal Recargable USB Onnight 900',
        'Frontal de 500 lúmenes con sensor de luz adaptativo, carga USB-C y modo rojo para no perder la visión nocturna.',
        49.99,
        45,
        'Iluminación',
        'https://picsum.photos/seed/1581822261/800/600'
    ),
    (
        'Linterna Compacta de Mano 250lm',
        'Linterna resistente al agua IPX5, 3 modos de luz (100%, 40%, flash) y cuerpo de aluminio anodizado.',
        14.99,
        60,
        'Iluminación',
        'https://picsum.photos/seed/1581822261/800/600'
    ),
    -- ACCESORIOS (5 productos)
    (
        'Gafas de Sol Mountaineering MH570',
        'Gafas con lentes polarizadas categoría 4, protección UV400 y patillas flotantes. Para alta montaña y nieve.',
        29.99,
        55,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Guantes de Trekking Stretch',
        'Guantes de microfibra con tejido elástico 4 vías, palma antideslizante y compatible con pantallas táctiles.',
        12.99,
        90,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Gorro Merino Trek 900',
        'Gorro de lana merino fina, sin costuras y con banda de silicona interior para que no resbale. Reversible.',
        16.99,
        75,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Buff Multifunción Merino 190',
        'Braga de cuello de lana merino, uso como gorro, bufanda o pasamontañas. Antibacteriana y termorreguladora.',
        22.99,
        80,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Cinturón Riñonera Running Belt 1L',
        'Cinturón porta-objetos con bolsillo estanco para móvil, llaves y gel energético. Se ajusta sin rebote.',
        9.99,
        95,
        'Accesorios',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    -- ESCALADA (7 productos)
    (
        'Arnés de Escalada Simond Rock',
        'Arnés regulable de cintura y perneras, con 4 anillas de material en la cintura y certificación EN 12277.',
        29.99,
        35,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Cuerda Dinámica 10mm x 50m Simond',
        'Cuerda dinámica de uso simple, tratamiento dry para humedad, marcado del medio y funda de alta resistencia.',
        89.99,
        15,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Mosquetón HMS con Seguro Automático',
        'Mosquetón pera con cierre automático de 3 posiciones. Certificación CE EN 12275. Acero de alta resistencia.',
        19.99,
        50,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Pies de Gato Escalada Rock+ Simond',
        'Pies de gato con plantilla de media planta y velcro para principiantes. Puntera y talón de goma sticky.',
        49.99,
        25,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Casco de Escalada Simond Orbit',
        'Casco polivalente escalada y vía ferrata. Ventilación integrada, ajuste micrometrico y forro extraible.',
        39.99,
        30,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Magnesio Escalada Polvo + Bolsa',
        'Bolsa de tela con cierre corredero y 200g de carbonato de magnesio en polvo. Reductora de deslizamiento.',
        14.99,
        70,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    (
        'Crampones de Aluminio 10 Puntas',
        'Crampones ligeros para senderismo invernal y glaciar, talla universal, antibolotas incluidas.',
        34.99,
        20,
        'Escalada',
        'https://picsum.photos/seed/1522163723/800/600'
    ),
    -- CAMPING (6 productos)
    (
        'Tienda de Campaña 2 Personas NH100',
        'Tienda igloo con 2 puertas y absides. Montaje en 5 minutos. Peso 2,4kg. Resistente a lluvia 1500mm.',
        69.99,
        20,
        'Camping',
        'https://picsum.photos/seed/1504851149312/800/600'
    ),
    (
        'Saco de Dormir 15°C Arpenaz',
        'Saco rectangular con forma anatómica, relleno de fibra hueca y capucha ajustable. Lavable a máquina.',
        24.99,
        40,
        'Camping',
        'https://picsum.photos/seed/1523987355523/800/600'
    ),
    (
        'Saco de Dormir Plumón 0°C Forclaz',
        'Saco de forma momia con relleno de plumón 85/15, compresible en funda de transporte y cremallera antienganche.',
        99.99,
        15,
        'Camping',
        'https://picsum.photos/seed/1523987355523/800/600'
    ),
    (
        'Esterilla Autoinflable 3cm Trek 500',
        'Esterilla aislante autoinflable R-Value 3.5. Ligera, compacta y con tejido antideslizante. Para 3 estaciones.',
        39.99,
        30,
        'Camping',
        'https://picsum.photos/seed/1504851149312/800/600'
    ),
    (
        'Hornillo de Gas Camping Gaz S 2500',
        'Hornillo de gas ultracompacto con plegado automático de soportes, regulación de llama y encendido piezoeléctrico.',
        19.99,
        50,
        'Camping',
        'https://picsum.photos/seed/1504851149312/800/600'
    ),
    (
        'Batería Solar 10000mAh Outdoor',
        'Powerbank con 2 paneles solares integrados, resistente al agua IPX4, 2 puertos USB y linterna LED de emergencia.',
        44.99,
        25,
        'Camping',
        'https://picsum.photos/seed/1504851149312/800/600'
    ),
    -- HIDRATACIÓN (5 productos)
    (
        'Botella de Agua Tritan 0,8L',
        'Botella libre de BPA, boca ancha fácil de limpiar, resistente a impactos y al frío. Tapa rosca de seguridad.',
        7.99,
        100,
        'Hidratación',
        'https://picsum.photos/seed/1602143407151/800/600'
    ),
    (
        'Botella Aislante Acero 0,5L Trek',
        'Termo de acero inoxidable que mantiene el frío 24h y el calor 12h. Boca estrecha ideal para beber en marcha.',
        17.99,
        80,
        'Hidratación',
        'https://picsum.photos/seed/1602143407151/800/600'
    ),
    (
        'Bolsa de Hidratación 2L Softflask',
        'Reserva de hidratación con válvula de mordida y manguera flexible. Compatible con mochilas de hasta 60L.',
        14.99,
        60,
        'Hidratación',
        'https://picsum.photos/seed/1602143407151/800/600'
    ),
    (
        'Pastillas Potabilizadoras Micropur 50 ud',
        'Pastillas de dióxido de cloro para potabilizar agua en emergencias. Eficaces en 30 minutos. Sin sabor residual.',
        9.99,
        90,
        'Hidratación',
        'https://picsum.photos/seed/1602143407151/800/600'
    ),
    (
        'Filtro de Agua Portátil LifeStraw Trek',
        'Filtro de fibra hueca que elimina el 99,999% de bacterias y protozoos. Sin químicos, vida útil 1000L.',
        29.99,
        35,
        'Hidratación',
        'https://picsum.photos/seed/1602143407151/800/600'
    ),
    -- SEGURIDAD (5 productos)
    (
        'Botiquín de Primeros Auxilios Trek 500',
        'Botiquín compacto con 30 artículos esenciales: vendas, antiséptico, tijeras, pinzas, apósitos y guías de actuación.',
        19.99,
        65,
        'Seguridad',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'GPS de Mano Garmin eTrex 32x',
        'GPS con mapas TopoActive preinstalados, pantalla de 2,2\" legible al sol, 25h de batería y resistencia IPX7.',
        219.99,
        8,
        'Seguridad',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Silbato de Emergencia Fox 40 Micro',
        'Silbato sin bola interior de alta potencia (100dB), no se bloquea con agua o suciedad. Peso 8g.',
        4.99,
        100,
        'Seguridad',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Manta Térmica de Emergencia 160x210cm',
        'Manta isotérmica de doble cara (plata/oro) que refleja el 90% del calor corporal. Imprescindible en kit de emergencia.',
        3.99,
        100,
        'Seguridad',
        'https://picsum.photos/seed/1510797215324/800/600'
    ),
    (
        'Spray Repelente Insectos DEET 50%',
        'Repelente de mosquitos y garrapatas con DEET al 50%. Protección de hasta 8 horas. Apto para zonas tropicales.',
        11.99,
        75,
        'Seguridad',
        'https://picsum.photos/seed/1510797215324/800/600'
    );
-- ============================================================
-- FIN DEL SCRIPT
-- Total: 50 productos en 10 categorías
-- ============================================================