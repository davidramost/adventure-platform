$(document).ready(function() {
    $(document).on('click', '.botonMarcador', function(e) {
        e.preventDefault();
        
        var btn = $(this);
        var idRuta = btn.data('id');
        var img = btn.find('img');

        $.ajax({
            url: 'toggle_favorite.php',
            type: 'POST',
            data: { id_ruta: idRuta },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    if (response.action === 'added') {
                        img.attr('src', 'Img/Icons/favorito_solid.png');
                        img.css('opacity', '1');
                    } else {
                        if (window.location.pathname.includes('favorites_page.php')) {
                            btn.closest('.tarjetaRuta').fadeOut(300, function() { 
                                $(this).remove(); 
                                if ($('.tarjetaRuta').length === 0) {
                                    $('.listaRutas').html("<p style='padding: 2em; color: white; text-align: center;'>No tienes rutas favoritas guardadas.</p>");
                                }
                            });
                        } else {
                            img.attr('src', 'Img/Icons/favourite.png');
                            img.css('opacity', '1');
                        }
                    }
                } else {
                    if (response.message === 'Debes iniciar sesión') {
                        window.location.href = 'login.php';
                    } else {
                        alert(response.message);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error AJAX:', error);
                
                if (xhr.responseText) {
                    console.log('Respuesta del servidor:', xhr.responseText);
                }
                alert('Error al procesar la solicitud');
            }
        });
    });
});