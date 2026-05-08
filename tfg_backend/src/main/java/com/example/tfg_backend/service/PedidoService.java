package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.CrearPedidoRequest;
import com.example.tfg_backend.dto.LineaPedidoResponse;
import com.example.tfg_backend.dto.PedidoResponse;
import com.example.tfg_backend.entity.LineaPedido;
import com.example.tfg_backend.entity.MetodoPago;
import com.example.tfg_backend.entity.Pedido;
import com.example.tfg_backend.entity.Producto;
import com.example.tfg_backend.entity.TipoEnvio;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.LineaPedidoRepository;
import com.example.tfg_backend.repository.PedidoRepository;
import com.example.tfg_backend.repository.ProductoRepository;
import com.example.tfg_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final LineaPedidoRepository lineaPedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public PedidoResponse crearPedido(CrearPedidoRequest request, Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + idUsuario));

        BigDecimal total = BigDecimal.ZERO;
        List<Producto> productosValidados = request.getLineas().stream().map(linea -> {
            Producto producto = productoRepository.findById(linea.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con id: " + linea.getIdProducto()));
            if (producto.getStock() == null || producto.getStock() < linea.getCantidad()) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para el producto: " + producto.getNombre());
            }
            return producto;
        }).toList();

        for (int i = 0; i < request.getLineas().size(); i++) {
            Producto producto = productosValidados.get(i);
            Integer cantidad = request.getLineas().get(i).getCantidad();
            total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
        }

        BigDecimal gastoEnvio = TipoEnvio.EXPRESS.equals(request.getTipoEnvio())
                ? new BigDecimal("4.99")
                : BigDecimal.ZERO;
        total = total.add(gastoEnvio);

        Pedido pedido = Pedido.builder()
                .fecha(LocalDateTime.now())
                .total(total)
                .gastoEnvio(gastoEnvio)
                .direccionEnvio(request.getDireccionEnvio())
                .tipoEnvio(request.getTipoEnvio())
                .metodoPago(request.getMetodoPago())
                .usuario(usuario)
                .build();
        pedido = pedidoRepository.save(pedido);

        final Integer idPedido = pedido.getIdPedido();
        for (int i = 0; i < request.getLineas().size(); i++) {
            Producto producto = productosValidados.get(i);
            Integer cantidad = request.getLineas().get(i).getCantidad();

            LineaPedido linea = LineaPedido.builder()
                    .idPedido(idPedido)
                    .idProducto(producto.getIdProducto())
                    .cantidad(cantidad)
                    .precioUnitario(producto.getPrecio())
                    .build();
            lineaPedidoRepository.save(linea);

            producto.setStock(producto.getStock() - cantidad);
            productoRepository.save(producto);
        }

        List<LineaPedido> lineasGuardadas = lineaPedidoRepository.findByIdPedido(idPedido);
        return toPedidoResponse(pedido, lineasGuardadas);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> getMisPedidos(Integer idUsuario) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioIdUsuarioOrderByFechaDesc(idUsuario);
        return pedidos.stream().map(pedido -> {
            List<LineaPedido> lineas = lineaPedidoRepository.findByIdPedido(pedido.getIdPedido());
            return toPedidoResponse(pedido, lineas);
        }).toList();
    }

    private PedidoResponse toPedidoResponse(Pedido pedido, List<LineaPedido> lineas) {
        List<LineaPedidoResponse> lineasResponse = lineas.stream()
                .map(this::toLineaPedidoResponse)
                .toList();
        return PedidoResponse.builder()
                .idPedido(pedido.getIdPedido())
                .fecha(pedido.getFecha())
                .total(pedido.getTotal())
                .gastoEnvio(pedido.getGastoEnvio())
                .direccionEnvio(pedido.getDireccionEnvio())
                .tipoEnvio(pedido.getTipoEnvio())
                .metodoPago(pedido.getMetodoPago())
                .lineas(lineasResponse)
                .build();
    }

    private LineaPedidoResponse toLineaPedidoResponse(LineaPedido linea) {
        String nombreProducto = null;
        String imagenProducto = null;
        if (linea.getProducto() != null) {
            nombreProducto = linea.getProducto().getNombre();
            imagenProducto = linea.getProducto().getImagen();
        } else {
            Producto producto = productoRepository.findById(linea.getIdProducto()).orElse(null);
            if (producto != null) {
                nombreProducto = producto.getNombre();
                imagenProducto = producto.getImagen();
            }
        }
        BigDecimal subtotal = linea.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(linea.getCantidad()));
        return LineaPedidoResponse.builder()
                .idProducto(linea.getIdProducto())
                .nombreProducto(nombreProducto)
                .imagenProducto(imagenProducto)
                .precioUnitario(linea.getPrecioUnitario())
                .cantidad(linea.getCantidad())
                .subtotal(subtotal)
                .build();
    }
}
