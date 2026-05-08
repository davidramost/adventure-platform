-- Migration: Add checkout fields to pedido table
-- Execute in TiDB Cloud / MySQL before restarting the backend
ALTER TABLE pedido
ADD COLUMN direccion_envio TEXT,
    ADD COLUMN tipo_envio ENUM('ESTANDAR', 'EXPRESS', 'RECOGIDA_PUNTO') NOT NULL DEFAULT 'ESTANDAR',
    ADD COLUMN metodo_pago ENUM('TARJETA', 'BIZUM', 'PAYPAL') NOT NULL DEFAULT 'TARJETA',
    ADD COLUMN gasto_envio DECIMAL(10, 2) NOT NULL DEFAULT 0.00;