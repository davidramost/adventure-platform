-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 31-01-2026 a las 22:27:19
-- Versión del servidor: 11.4.7-MariaDB-cll-lve
-- Versión de PHP: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rutas_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorito`
--

CREATE TABLE `favorito` (
  `id_ruta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `me_gusta`
--

CREATE TABLE `me_gusta` (
  `id_ruta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resena`
--

CREATE TABLE `resena` (
  `id_resena` int(11) NOT NULL,
  `id_ruta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `puntuacion` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `id_ruta` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_ubicacion` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `nombre_ruta` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `distancia_km` float DEFAULT NULL,
  `duracion_estimada` varchar(50) DEFAULT NULL,
  `dificultad` varchar(50) DEFAULT NULL,
  `desnivel_metros` int(11) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Volcado de datos para la tabla `ruta`
--

INSERT INTO `ruta` (`id_ruta`, `id_usuario`, `id_ubicacion`, `titulo`, `nombre_ruta`, `descripcion`, `distancia_km`, `duracion_estimada`, `dificultad`, `desnivel_metros`, `imagen_url`) VALUES
(1, 1, 2, 'Agua y Naturaleza', 'Arroyo del Bejarano', 'Esta emblemática ruta recorre uno de los enclaves naturales más valiosos de la Sierra Morena cordobesa. El sendero transcurre bajo un frondoso bosque en galería compuesto por alisos, fresnos y chopos. Durante el trayecto, los senderistas pueden contemplar las ruinas de antiguas minas romanas de cobre y los impresionantes Baños de Popea, una sucesión de cascadas y saltos de agua de gran belleza. Es un recorrido ideal para disfrutar del sonido del agua y la frescura de la vegetación califal.', 10.5, '3h 30m', 'Baja', 300, ''),
(2, 1, 3, 'El Mirador de Córdoba', 'Sendero de las Ermitas', 'Un recorrido espiritual e histórico que asciende por la ladera de la montaña hasta alcanzar el mirador del Sagrado Corazón de Jesús. El camino ofrece una transición fascinante entre la vegetación de monte bajo y los bosques de pinos y encinas. Una vez en la cima, las Ermitas de Córdoba ofrecen una de las vistas panorámicas más impresionantes de la ciudad, la vega del Guadalquivir y la campiña, permitiendo entender la ubicación estratégica de la capital califal desde las alturas.', 12, '4h 00m', 'Media', 412, ''),
(3, 1, 4, 'Cañón del Bailón', 'Río Bailón', 'Ubicada en el corazón del Geoparque de las Sierras Subbéticas, esta ruta desciende por el espectacular cañón horadado por el río Bailón. El paisaje se caracteriza por imponentes formaciones de roca caliza, lapiaces y simas. El sendero comienza en el pintoresco pueblo de Zuheros y atraviesa poljes y valles donde es posible avistar buitres leonados y una flora endémica única. Es una experiencia de inmersión total en la geología y la naturaleza salvaje de la provincia de Córdoba.', 12.5, '4h 30m', 'Media', 450, ''),
(4, 1, 5, 'Ruta Juego de Tronos', 'Castillo de Almodóvar', 'Esta ruta combina naturaleza con una de las joyas del patrimonio militar de Andalucía. El ascenso a la colina del castillo ofrece vistas estratégicas del río Guadalquivir. La fortaleza, de origen árabe y reconstruida en la época cristiana, es famosa mundialmente por su excelente estado de conservación y por haber sido escenario de rodaje de series como Juego de Tronos. El camino rodea el embalse de la Breña, ofreciendo un contraste visual entre el azul del agua y el verde de la dehesa cordobesa.', 3, '1h 00m', 'Media', 150, ''),
(5, 1, 6, 'Patrimonio Minero', 'Cerro Muriano', 'Un viaje al pasado industrial y romano de la provincia. Esta ruta recorre el entorno de Cerro Muriano, explorando las antiguas explotaciones mineras de cobre que datan de la época del Imperio Romano. El sendero atraviesa zonas de matorral mediterráneo, jaras y acebuches, pasando por búnkeres de la Guerra Civil y restos de la Vía Augusta. Es una ruta perfecta para quienes buscan combinar el ejercicio físico con el descubrimiento de la arqueología industrial y la historia bélica de la zona.', 10, '3h 30m', 'Media', 240, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion`
--

CREATE TABLE `ubicacion` (
  `id_ubicacion` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Volcado de datos para la tabla `ubicacion`
--

INSERT INTO `ubicacion` (`id_ubicacion`, `nombre`, `latitud`, `longitud`) VALUES
(1, 'Santa María de Trassierra', 37.93510000, -4.89420000),
(2, 'Arroyo del Bejarano', 37.91580000, -4.80150000),
(3, 'Las Ermitas', 37.54310000, -4.32150000),
(4, 'Zuheros', 37.81250000, -5.02330000),
(5, 'Almodóvar del Río', 38.00150000, -4.76800000),
(6, 'Cerro Muriano', 38.00150000, -4.76800000),
(7, 'Medina Azahara', 37.86140000, -4.84610000),
(8, 'Las Jaras', 37.96900000, -4.82500000),
(9, 'Pico Tiñosa', 37.42500000, -4.20100000),
(10, 'Vía Verde', 37.55800000, -4.27500000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `imagen` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `password`, `email`, `imagen`) VALUES
(1, 'Admin', '1234', 'info@tuweb.es', NULL),
(4, 'test2', '$2y$12$9l.iMzklmg5W9/pmDZGy3ew9GaAY4EZ2wgr7EbW9U7d3mkrv/mCee', '123423@234', NULL),
(7, 'test5', '$2y$12$872f4CQgmCh/5xSbAtryAOoqHJAYBC9XRuFLh7oKwi1UUJhDTZxgO', 'as@gmail.com', NULL),
(8, 'test6', '$2y$12$NUcIvLWIu5ymalzlNR2PQ.mVivEDZMbED1rh3x0UrvWg46H1ZFlwS', 'asdf234sdf@hotmail.com', NULL),
(9, 'daten', '$2y$12$qpwM481lduuoxkYQrAFM1Oz3LNKJmaQjo/hFrKHZcc/GtS.4hPudG', '1231234423@234', NULL),
(10, 'rafa', '$2y$12$JubqRs1RUZKaDemJWJy8puoL00SUErrS9iv/sdsecd0zxm4.FgL5q', '123423@234asdf', NULL),
(11, 'asdf', '$2y$12$Nh1kBhXcjbRB7OlSETP.YOA7XcWVFRB3KX059Ol8w7g/OhO2uXcuu', 'asdfasdf@asdfasdfasd', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD PRIMARY KEY (`id_ruta`,`id_usuario`),
  ADD KEY `fk_favorito_usuario` (`id_usuario`);

--
-- Indices de la tabla `me_gusta`
--
ALTER TABLE `me_gusta`
  ADD PRIMARY KEY (`id_ruta`,`id_usuario`),
  ADD KEY `fk_megusta_usuario` (`id_usuario`);

--
-- Indices de la tabla `resena`
--
ALTER TABLE `resena`
  ADD PRIMARY KEY (`id_resena`,`id_ruta`,`id_usuario`),
  ADD KEY `fk_resena_usuario` (`id_usuario`),
  ADD KEY `fk_resena_ruta` (`id_ruta`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`id_ruta`),
  ADD KEY `fk_ruta_usuario` (`id_usuario`),
  ADD KEY `fk_ruta_ubicacion` (`id_ubicacion`);

--
-- Indices de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD PRIMARY KEY (`id_ubicacion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `resena`
--
ALTER TABLE `resena`
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `id_ubicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `fk_favorito_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id_ruta`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `me_gusta`
--
ALTER TABLE `me_gusta`
  ADD CONSTRAINT `fk_megusta_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id_ruta`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_megusta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resena`
--
ALTER TABLE `resena`
  ADD CONSTRAINT `fk_resena_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id_ruta`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_resena_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD CONSTRAINT `fk_ruta_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ruta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
