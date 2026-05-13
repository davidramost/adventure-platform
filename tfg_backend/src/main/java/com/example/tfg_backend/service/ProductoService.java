package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.ProductoRequest;
import com.example.tfg_backend.dto.ProductoResponse;
import com.example.tfg_backend.entity.Producto;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public ProductoResponse getProductoById(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return toProductoResponse(producto);
    }

    @Transactional
    public ProductoResponse createProducto(ProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .stock(request.getStock())
                .categoria(request.getCategoria())
                .imagen(request.getImagen())
                .build();
        return toProductoResponse(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse updateProducto(Integer id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setCategoria(request.getCategoria());
        producto.setImagen(request.getImagen());
        return toProductoResponse(productoRepository.save(producto));
    }

    @Transactional
    public void deleteProducto(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        productoRepository.delete(producto);
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
