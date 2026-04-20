-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 25-03-2026 a las 10:41:11
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

--
-- Volcado de datos para la tabla `favorito`
--

INSERT INTO `favorito` (`id_ruta`, `id_usuario`) VALUES
(1, 9),
(2, 9);

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
(1, 1, 1, 'Agua e Historia Milenaria', 'Arroyo del Bejarano', 'Esta emblemática ruta recorre uno de los enclaves naturales más valiosos de la Sierra Morena cordobesa. El sendero transcurre bajo un frondoso bosque en galería compuesto por alisos, fresnos y chopos. Durante el trayecto, los senderistas pueden contemplar las ruinas de antiguas minas romanas de cobre y los impresionantes Baños de Popea, una sucesión de cascadas y saltos de agua de gran belleza. Es un recorrido ideal para disfrutar del sonido del agua y la frescura de la vegetación califal.', 10.5, '3h 30m', 'Baja', 300, 'https://picsum.photos/id/1015/800/600'),
(2, 1, 2, 'El Mirador Espiritual', 'Sendero de las Ermitas', 'Un recorrido espiritual e histórico que asciende por la ladera de la montaña hasta alcanzar el mirador del Sagrado Corazón de Jesús. El camino ofrece una transición fascinante entre la vegetación de monte bajo y los bosques de pinos y encinas. Una vez en la cima, las Ermitas de Córdoba ofrecen una de las vistas panorámicas más impresionantes de la ciudad, la vega del Guadalquivir y la campiña, permitiendo entender la ubicación estratégica de la ciudad desde las alturas.', 12, '4h 00m', 'Media', 412, 'https://picsum.photos/id/1036/800/600'),
(3, 1, 3, 'Tesoro de las Subbéticas', 'Río Bailón', 'Ubicada en el corazón del Geoparque de las Sierras Subbéticas, esta ruta desciende por el espectacular cañón horadado por el río Bailón. El paisaje se caracteriza por imponentes formaciones de roca caliza, lapiaces y simas. El sendero comienza en el pintoresco pueblo de Zuheros y atraviesa poljes y valles donde es posible avistar buitres leonados y una flora endémica única. Es una experiencia de inmersión total en la geología y la naturaleza salvaje de la provincia de Córdoba.', 12.5, '4h 30m', 'Media', 450, 'https://picsum.photos/id/1016/800/600'),
(4, 1, 4, 'Fortaleza sobre el Guadalquivir', 'Castillo de Almodóvar', 'Esta ruta combina naturaleza con una de las joyas del patrimonio militar de Andalucía. El ascenso a la colina del castillo ofrece vistas estratégicas del río Guadalquivir. La fortaleza, de origen árabe y reconstruida en la época cristiana, es famosa mundialmente por su excelente estado de conservación y por haber sido escenario de rodaje de series como Juego de Tronos. El camino rodea el embalse de la Breña, ofreciendo un contraste visual entre el azul del agua y el verde de la dehesa.', 3, '1h 00m', 'Alta', 150, 'https://picsum.photos/id/1043/800/600'),
(8, 17, 19, 'Aventura', 'Aventura', 'Muy buena\n\nRecomendaciones: Cualquier', 12, '12h 12m', 'Media', 200, 'Img/Usuarios/6994330a0a498_astrocards_1.jpeg');

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
(10, 'Vía Verde', 37.55800000, -4.27500000),
(17, 'Si yo te dijera', 99.99999999, NULL),
(18, 'Córdoba', NULL, NULL),
(19, 'Córdoba', NULL, NULL);

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
(1, 'AdminCordoba', 'password_segura', 'admin@rutascordoba.es', NULL),
(9, 'daten', '$2y$12$qpwM481lduuoxkYQrAFM1Oz3LNKJmaQjo/hFrKHZcc/GtS.4hPudG', '1231234423@234', NULL),
(12, 'admin', '$2y$12$msaIRUx3EE3rhIHQotEjoebzcPUNXGMzPAl3hY8Wf993/H96MwW/y', 'davidramost@iesflorenciopintado.es', NULL),
(14, 'sd1234', '$2y$12$0awPx/YZM1g605/O51k0w.fH6GC4hYisNl3NDKyzUNK8IIyUGaBfC', 'asdf@gmail.com', 0x496d672f5573756172696f732f50726f66696c652f70726f66696c655f36393932303764303966356138302e38383032333134382e706e67),
(15, 'davidr', '$2y$12$Fg0RKgZsT53kIXnMWUXqbuUML.KFpGtw.9Io4/J.8TjhOaVICAYTq', 'davidfsdf@gmail.com', 0x496d672f5573756172696f732f50726f66696c652f363939333430623964343164375f356432386137643064383732332e6a7067),
(16, 'qwerty', '$2y$12$fO8/p7EIQK3iIv0u1dXTKu1R9at9KLLDoZGgh1c4mkb5F7t7ojubu', 'qwerty@gmail.com', 0x496d672f5573756172696f732f50726f66696c652f363939333538353865633138305f356432386137643064383732332e6a7067),
(17, 'test', '$2y$12$bFk95wRHyC7Saf5VhkgZzO5wLygIovup/BCDccdLX27KFURg4.R1u', 'test@gmail.com', 0x496d672f5573756172696f732f50726f66696c652f363939333561386138623962645f617374726f63617264735f312e6a706567);

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
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `id_ubicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
