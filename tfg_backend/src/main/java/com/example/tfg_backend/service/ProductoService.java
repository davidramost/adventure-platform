package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.ProductoResponse;
import com.example.tfg_backend.entity.Producto;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoResponse> getAllProductos(String categoria, String search) {
        List<Producto> productos;
        if (search != null && !search.isBlank()) {
            productos = productoRepository.findByNombreContainingIgnoreCase(search);
        } else if (categoria != null && !categoria.isBlank()) {
            productos = productoRepository.findByCategoria(categoria);
        } else {
            productos = productoRepository.findAll();
        }
        return productos.stream().map(this::toProductoResponse).toList();
    }

    public ProductoResponse getProductoById(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return toProductoResponse(producto);
    }

    private ProductoResponse toProductoResponse(Producto producto) {
        return ProductoResponse.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .categoria(producto.getCategoria())
                .imagen(producto.getImagen())
                .build();
    }
}
